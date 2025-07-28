"use client";
import confetti from "canvas-confetti";
export default function useCelebration() {
  const triggerConfetti = () => {
    var end = Date.now() + 3 * 1000;

    var colors = [
      "#bb0000",
      "#ffffff",
      "#a864fd",
      "#29cdff",
      "#78ff44",
      "#ff718d",
      "#fdff6a",
    ];

    (function frame() {
      confetti({
        particleCount: 7,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 7,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  return { triggerConfetti };
}
