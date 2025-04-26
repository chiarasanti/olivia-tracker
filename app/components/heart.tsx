"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface HeartProps {
  pulse?: boolean;
}

export function Heart({ pulse = false }: HeartProps) {
  const [isPulsing, setIsPulsing] = useState(false);

  // Trigger pulse animation when the pulse prop changes to true
  useEffect(() => {
    if (pulse) {
      setIsPulsing(true);
      const timer = setTimeout(() => {
        setIsPulsing(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [pulse]);

  return (
    <div className="">
      <div
        className={cn(
          "flex items-center justify-center transition-transform duration-300",
          isPulsing && "animate-heartbeat z-30"
        )}
      >
        <Image
          src="heart-bubble.png"
          width="49"
          height="54"
          alt="heart bubble"
          className="z-30"
        />
      </div>
    </div>
  );
}
