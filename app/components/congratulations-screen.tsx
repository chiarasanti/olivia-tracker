import { Cat } from "./cat";
import { Heart } from "./heart";
import { PixelConfetti } from "./pixel-confetti";

interface CongratulationsScreenProps {
  streak: number;
}

export function CongratulationsScreen({ streak }: CongratulationsScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full py-8">
      {/* Confetti animation that stays visible */}
      <PixelConfetti persistent={true} />

      {/* Congratulations message */}
      <h1 className="text-4xl font-pixel text-center mb-16">
        U did ur job human
      </h1>

      {/* Larger cat illustration with heart bubble */}
      <div className="mb-8 relative animate-bounce">
        <Cat />
      </div>

      {/* Streak information */}
      <div className="mt-4 text-2xl font-pixel text-center">
        <p>Current streak: {streak} days</p>
      </div>
    </div>
  );
}
