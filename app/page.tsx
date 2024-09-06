"use client"

import { Button } from "@/components/ui/button"
import { Info } from "lucide-react"
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
      const chooseFinger = () => {
        const randomIndex = Math.floor(Math.random() * touches.length)
        setSelectedFinger(touches[randomIndex])
      }

      const chooseFingerTimeout = setTimeout(() => {
        chooseFinger()
        setHasStarted(false)
      }, 1000)

      return () => clearTimeout(chooseFingerTimeout)
    }
  }, [showStartMessage, hasStarted, touches])

  const resetGame = () => {
    setTouches([])
    setSelectedFinger(null)
    setHasStarted(false)
    setShowStartMessage(true)
    setCounter(5)
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden bg-background">
      <Info className="absolute right-4 top-4 h-6 w-6 text-zinc-50" />

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
          className="absolute flex h-[200px] w-[200px] items-center justify-center rounded-full bg-red-500 text-2xl font-bold text-zinc-50"
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