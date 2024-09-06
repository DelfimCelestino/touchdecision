"use client"
import { useState, useEffect, useRef } from "react"

interface Touch {
  x: number
  y: number
  id: number
}

export default function FingerGame() {
  const [touches, setTouches] = useState<Touch[]>([]) // Armazena as posições dos toques
  const [selectedFinger, setSelectedFinger] = useState<Touch | null>(null) // O dedo escolhido no final
  const [isChoosing, setIsChoosing] = useState<boolean>(false) // Controla se está no processo de escolha
  const [colors, setColors] = useState<string[]>([]) // Armazena as cores de cada dedo
  const [showStartMessage, setShowStartMessage] = useState<boolean>(true) // Exibe a mensagem inicial
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const resetGame = () => {
    setTouches([])
    setSelectedFinger(null)
    setIsChoosing(false)
    setColors([])
    setShowStartMessage(true)
  }

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      const newTouches: Touch[] = Array.from(e.touches).map((touch) => ({
        x: touch.pageX,
        y: touch.pageY,
        id: touch.identifier,
      }))
      setTouches(newTouches)
      setColors(new Array(newTouches.length).fill("red")) // Inicializa todas as cores como vermelho

      // Remove a mensagem de início assim que o primeiro toque for detectado
      if (newTouches.length > 0 && showStartMessage) {
        setShowStartMessage(false)
      }

      // Inicia o processo de escolha quando os dedos são mantidos na tela
      if (!isChoosing && newTouches.length > 0) {
        setIsChoosing(true)
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      const updatedTouches: Touch[] = Array.from(e.touches).map((touch) => ({
        x: touch.pageX,
        y: touch.pageY,
        id: touch.identifier,
      }))
      setTouches(updatedTouches)
    }

    const handleTouchEnd = (e: TouchEvent) => {
      // Se todos os dedos forem removidos, reset o jogo
      if (e.touches.length === 0) {
        resetGame()
      } else {
        // Atualiza a lista de toques quando algum dedo for removido
        const remainingTouches: Touch[] = Array.from(e.touches).map(
          (touch) => ({
            x: touch.pageX,
            y: touch.pageY,
            id: touch.identifier,
          }),
        )
        setTouches(remainingTouches)
      }
    }

    document.addEventListener("touchstart", handleTouchStart)
    document.addEventListener("touchmove", handleTouchMove)
    document.addEventListener("touchend", handleTouchEnd)

    return () => {
      document.removeEventListener("touchstart", handleTouchStart)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)
    }
  }, [isChoosing, showStartMessage])

  // Alterna as cores enquanto está escolhendo o dedo
  useEffect(() => {
    if (isChoosing && touches.length > 0) {
      let counter = 0

      intervalRef.current = setInterval(() => {
        // Alterna entre vermelho e verde
        setColors((prevColors) =>
          prevColors.map((color) => (color === "red" ? "green" : "red")),
        )
        counter++

        // Após 5 segundos (5000ms), para de alternar e seleciona o dedo
        if (counter >= 10) {
          if (intervalRef.current) clearInterval(intervalRef.current)
          const randomIndex = Math.floor(Math.random() * touches.length)
          setSelectedFinger(touches[randomIndex])
          setIsChoosing(false)
        }
      }, 500) // Alterna as cores a cada 500ms (meio segundo)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isChoosing, touches])

  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
        backgroundColor: "#f0f0f0",
      }}
    >
      <h1 style={{ textAlign: "center" }}>Press Your Fingers!</h1>

      {/* Renderiza os círculos dos dedos */}
      {!selectedFinger &&
        touches.map((touch, index) => (
          <div
            key={touch.id}
            style={{
              position: "absolute",
              width: "200px",
              height: "200px",
              backgroundColor: colors[index] || "red", // Alterna a cor
              borderRadius: "50%",
              left: `${touch.x - 25}px`,
              top: `${touch.y - 25}px`,
            }}
          />
        ))}

      {/* Exibe apenas o dedo selecionado com verde */}
      {selectedFinger && (
        <div
          style={{
            position: "absolute",
            width: "200px",
            height: "200px",
            backgroundColor: "green",
            borderRadius: "50%",
            left: `${selectedFinger.x - 30}px`,
            top: `${selectedFinger.y - 30}px`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p style={{ color: "#fff" }}>Selected!</p>
        </div>
      )}

      {/* Mensagem inicial */}
      {showStartMessage && !isChoosing && !selectedFinger && (
        <p style={{ textAlign: "center", color: "#888" }}>
          Coloquem todos os dedos na tela para começar a escolha!
        </p>
      )}

      {/* Mensagem de escolha em andamento */}
      {isChoosing && !selectedFinger && (
        <p style={{ textAlign: "center", color: "#888" }}>
          Escolhendo o dedo...
        </p>
      )}

      {/* Botão de reiniciar */}
      {selectedFinger && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button
            onClick={resetGame}
            style={{ padding: "10px 20px", fontSize: "16px" }}
          >
            Recomeçar
          </button>
        </div>
      )}
    </div>
  )
}
