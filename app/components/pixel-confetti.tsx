"use client"

import { useEffect, useState } from "react"

interface ConfettiPiece {
  id: number
  x: number
  y: number
  color: string
  size: number
  speedX: number
  speedY: number
  rotation: number
}

interface PixelConfettiProps {
  persistent?: boolean
}

export function PixelConfetti({ persistent = false }: PixelConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([])

  useEffect(() => {
    // Create pixel confetti pieces
    const colors = ["#7358D5", "#FE5F55", "#64B6AC", "#FFCC5C", "#88D8B0"]
    const newPieces: ConfettiPiece[] = []

    // Create 60 confetti pieces
    for (let i = 0; i < 60; i++) {
      newPieces.push({
        id: i,
        x: 40 + Math.random() * 20, // center of screen with some variation
        y: 40 + Math.random() * 10, // start in middle
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.floor(Math.random() * 3) + 2, // pixel sizes between 2-4px
        speedX: (Math.random() - 0.5) * 6, // random horizontal direction
        speedY: (Math.random() - 0.5) * 6, // random vertical direction
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
          x: piece.x + piece.speedX * 0.1,
          y: piece.y + piece.speedY * 0.1,
          rotation: piece.rotation + 1,
        })),
      )

      // For non-persistent confetti, clear after 3 seconds
      // For persistent confetti, keep animating but create new pieces periodically
      if (!persistent && elapsed > 3000) {
        setPieces([]) // Clear confetti after animation ends
      } else {
        animationId = requestAnimationFrame(animate)

        // For persistent mode, add new confetti pieces occasionally
        if (persistent && elapsed % 1000 < 20) {
          setPieces((prevPieces) => {
            // Keep only 40 pieces to avoid performance issues
            const filteredPieces = prevPieces.slice(0, 40)

            // Add 5 new pieces
            for (let i = 0; i < 5; i++) {
              filteredPieces.push({
                id: Math.random() * 10000,
                x: 40 + Math.random() * 20,
                y: 40 + Math.random() * 10,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.floor(Math.random() * 3) + 2,
                speedX: (Math.random() - 0.5) * 6,
                speedY: (Math.random() - 0.5) * 6,
                rotation: Math.random() * 360,
              })
            }

            return filteredPieces
          })
        }
      }
    }

    animationId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [persistent])

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
