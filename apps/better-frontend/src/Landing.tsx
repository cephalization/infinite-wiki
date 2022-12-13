import { useLayoutEffect, useRef, useState } from "react";

const colors = ["lightblue", "lightgreen", "lightcoral"] as const;

function blob(
  canvas: HTMLCanvasElement,
  waveHeight = 50,
  runs = 3,
  color = "lightblue"
) {
  const ctx = canvas.getContext("2d");

  if (ctx) {
    const width = canvas.width;
    const height = canvas.height;

    // for (let x = 0; x < width; x++) {
    //   // Generate the y-value for the wave
    //   let y = Math.sin((x * Math.PI) / 180) * 50 + height / 2;

    //   // Set the fill style to a light blue color
    //   ctx.fillStyle = "lightblue";

    //   // Draw a rectangle at the x and y coordinates
    //   ctx.fillRect(x, y, 1, 1);
    // }

    let xPos = 0;
    let heightFactor = height - height / 8;

    const animate = () => {
      // Clear the canvas
      // ctx.clearRect(0, 0, width, height);

      // Generate the y-value for the wave
      let y = Math.sin((xPos * Math.PI) / 180) * waveHeight + heightFactor;

      // Set the fill style to a light blue color
      ctx.fillStyle = color;

      // Draw a rectangle at the x and y coordinates
      ctx.fillRect(xPos, y, 2, 2);

      // Increase the x-position
      xPos += 3;

      if (xPos > width) {
        xPos = 0;
        heightFactor = heightFactor - height / 8;
      }

      // Animate the wave
      if (heightFactor + height / 4 > waveHeight) {
        setTimeout(() => requestAnimationFrame(animate), 1000 / 120);
      }
      // else if (runs > 0) {
      //   blob(canvas, waveHeight * 1.1, runs - 1, color);
      // }
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

      waves
        .reverse()
        .forEach((w) => ref.current && blob(ref.current, w, 0, "lightcoral"));
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
