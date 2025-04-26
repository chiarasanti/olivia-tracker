"use client"

import { useEffect, useState } from "react"

interface ConfettiPiece {
  id: number
  x: number
  y: number
  size: number
  color: string
  speedX: number
  speedY: number
  rotation: number
}

export function Confetti() {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([])

  useEffect(() => {
    // Create confetti pieces
    const colors = ["#7358D5", "#FE5F55", "#64B6AC", "#FFCC5C", "#88D8B0"]
    const newPieces: ConfettiPiece[] = []

    // Create 50 confetti pieces
    for (let i = 0; i < 50; i++) {
      newPieces.push({
        id: i,
        x: Math.random() * 100, // random position across screen width (%)
        y: Math.random() * 20 - 20, // start above the viewport
        size: Math.floor(Math.random() * 6) + 4, // random size between 4-10px
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: Math.random() * 3 - 1.5, // random horizontal speed
        speedY: Math.random() * 3 + 2, // random vertical speed (always downward)
        rotation: Math.random() * 360, // random rotation
      })
    }

    setPieces(newPieces)

    // Animation loop
    let animationId: number
    const startTime = Date.now()

    const animate = () => {
      const currentTime = Date.now()
      const elapsed = currentTime - startTime

      // Update positions
      setPieces((prevPieces) =>
        prevPieces.map((piece) => ({
          ...piece,
          x: piece.x + piece.speedX,
          y: piece.y + piece.speedY,
          rotation: piece.rotation + 2,
        })),
      )

      // Continue animation for 3 seconds
      if (elapsed < 3000) {
        animationId = requestAnimationFrame(animate)
      } else {
        setPieces([]) // Clear confetti after animation ends
      }
    }

    animationId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute"
          style={{
            left: `${piece.x}%`,
            top: `${piece.y}%`,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            backgroundColor: piece.color,
            transform: `rotate(${piece.rotation}deg)`,
          }}
        />
      ))}
    </div>
  )
}
