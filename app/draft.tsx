"use client"

import CreatorDialog from "@/components/creator-dialog"
import InfoModal from "@/components/info-modal"
import InstallModal from "@/components/install-modal"
import { Button } from "@/components/ui/button"
import { CircleHelpIcon, Info } from "lucide-react"
import { useState, useEffect, useRef } from "react"

interface Touch {
  x: number
  y: number
  id: number
}

export default function FingerGame() {
  const [touches, setTouches] = useState<Touch[]>([])
  const [counter, setCounter] = useState<number>(5)
  const [showStartMessage, setShowStartMessage] = useState<boolean>(true)
  const [hasStarted, setHasStarted] = useState<boolean>(false)
  const [selectedFinger, setSelectedFinger] = useState<Touch | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const [openInfo, setOpenInfo] = useState(false)
  const [open, setOpen] = useState(false)
  const [isChoosing, setIsChoosing] = useState(false)
  const [currentColor, setCurrentColor] = useState("bg-red-500")

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const handleServiceWorker = async () => {
        await navigator.serviceWorker.register("/service-worker.js")
      }

      handleServiceWorker()
    }
  }, [])

  useEffect(() => {
    if (showStartMessage) {
      intervalRef.current = setInterval(() => {
        setCounter((prevCounter) => {
          if (prevCounter <= 1) {
            clearInterval(intervalRef.current!)
            setShowStartMessage(false)
            setHasStarted(true)
            return 0
          }
          return prevCounter - 1
        })
      }, 1000)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [showStartMessage])

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (hasStarted || showStartMessage) {
        const newTouches: Touch[] = Array.from(e.touches).map((touch) => ({
          x: touch.pageX,
          y: touch.pageY,
          id: touch.identifier,
        }))
        setTouches(newTouches)
      }
    }

    document.addEventListener("touchstart", handleTouchStart)

    return () => {
      document.removeEventListener("touchstart", handleTouchStart)
    }
  }, [hasStarted, showStartMessage])

  useEffect(() => {
    if (!showStartMessage && hasStarted && touches.length > 0) {
      setIsChoosing(true)

      const colorInterval = setInterval(() => {
        setCurrentColor((prevColor) =>
          prevColor === "bg-red-500" ? "bg-green-500" : "bg-red-500",
        )
      }, 500)

      const chooseFinger = () => {
        const randomIndex = Math.floor(Math.random() * touches.length)
        setSelectedFinger(touches[randomIndex])
        setIsChoosing(false)
        clearInterval(colorInterval) // Para a troca de cores quando o dedo for escolhido
      }

      const chooseFingerTimeout = setTimeout(() => {
        chooseFinger()
        setHasStarted(false)
      }, 3000) // Escolhe o dedo após 3 segundos

      return () => {
        clearTimeout(chooseFingerTimeout)
        clearInterval(colorInterval)
      }
    }
  }, [showStartMessage, hasStarted, touches])

  const resetGame = () => {
    setTouches([])
    setSelectedFinger(null)
    setHasStarted(false)
    setShowStartMessage(true)
    setCounter(5)
    setCurrentColor("bg-red-500")
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden bg-background">
      <InstallModal />
      <InfoModal open={openInfo} onOpenChange={setOpenInfo} />
      <CreatorDialog open={open} onOpenChange={setOpen} />
      <CircleHelpIcon
        onClick={() => setOpenInfo(true)}
        className="fixed left-4 top-4 z-30 h-6 w-6 text-zinc-50"
      />
      <Info
        onClick={() => setOpen(true)}
        className="fixed right-4 top-4 z-30 h-6 w-6 text-zinc-50"
      />

      {!showStartMessage && touches.length < 2 && (
        <h1 className="text-center text-2xl">Pressionem seus dedos na tela</h1>
      )}

      {showStartMessage && (
        <div className="text-center text-2xl">
          <p>Coloquem todos os dedos na tela!</p>
          <p>{counter}</p>
        </div>
      )}

      {touches.map((touch, index) => (
        <div
          className={`absolute flex h-[200px] w-[200px] items-center justify-center rounded-full ${
            isChoosing ? currentColor : "bg-red-500"
          } text-2xl font-bold text-zinc-50`}
          key={touch.id}
          style={{
            left: `${touch.x - 100}px`,
            top: `${touch.y - 100}px`,
          }}
        >
          {index + 1}
        </div>
      ))}

      {selectedFinger && (
        <div
          className="absolute flex h-[200px] w-[200px] items-center justify-center rounded-full bg-green-500 text-2xl font-bold text-zinc-50"
          style={{
            left: `${selectedFinger.x - 100}px`,
            top: `${selectedFinger.y - 100}px`,
          }}
        >
          <p>Selecionado!</p>
        </div>
      )}

      {!showStartMessage && selectedFinger && (
        <div className="absolute bottom-10 left-0 right-0 text-center">
          <Button className="w-full" variant={"secondary"} onClick={resetGame}>
            Recomeçar
          </Button>
        </div>
      )}
    </div>
  )
}
