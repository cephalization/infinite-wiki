import { useLayoutEffect, useRef, useState } from "react";

const colors = ["lightblue", "lightgreen", "lightcoral"] as const;

function blob(
  canvas: HTMLCanvasElement,
  waveHeight = 50,
  color = "lightblue",
  eraser = false,
  lag = 300
) {
  const ctx = canvas.getContext("2d");

  if (ctx) {
    const width = canvas.width;
    const height = canvas.height;
    const delta = Math.floor(width / 256);
    const iLag = eraser ? Math.floor(delta * lag) : 0;

    let xPos = 0 - iLag;
    let heightFactor = Math.floor(height - height / 8);

    const animate = () => {
      // Generate the y-value for the wave
      let y = Math.floor(
        Math.sin((xPos * Math.PI) / 180) * waveHeight + heightFactor
      );

      // Set the fill style to a light blue color
      ctx.fillStyle = color;

      // Draw a rectangle at the x and y coordinates
      if (xPos >= 0 && !eraser) {
        ctx.fillRect(xPos, y, 2, 2);
      }

      if (xPos >= 0 && eraser) {
        ctx.clearRect(xPos, y, 2, 2);
      }

      // Increase the x-position
      xPos += delta;

      if (xPos > width) {
        xPos = 0;
        heightFactor = Math.floor(heightFactor - height / 8);
      }

      // Animate the wave
      if (Math.floor(heightFactor + height / 8) > waveHeight) {
        setTimeout(() => requestAnimationFrame(animate), 1000 / 120);
      } else {
        blob(canvas, waveHeight * 1.1, color, eraser, lag);
      }
    };

    // Start the animation
    animate();
  }
}

export const Landing = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({
    height: window?.innerHeight ?? 200,
    width: window?.innerWidth ?? 400,
  });

  useLayoutEffect(() => {
    if (ref.current) {
      const waves = new Array(5).fill(25);

      for (let i = 0; i < waves.length; i++) {
        waves[i] = Math.min((waves?.[i - 1] ?? 50) * 1.1, 100);
      }

      console.log(waves);

      waves.reverse().forEach((w) => {
        ref.current && blob(ref.current, w, "lightcoral");
        ref.current && blob(ref.current, w, "lightcoral", true, 600);
      });
    }
  }, []);

  return (
    <canvas
      ref={ref}
      id="canvas"
      className="absolute w-screen h-screen top-0 left-0 -z-10"
      width={dimensions.width}
      height={dimensions.height}
    ></canvas>
  );
};
