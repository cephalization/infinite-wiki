<script lang="ts">
	import { afterUpdate, onMount } from 'svelte';

	function blob(
		canvas: HTMLCanvasElement,
		waveHeight = 50,
		color = 'lightblue',
		eraser = false,
		lag = 300
	) {
		const ctx = canvas.getContext('2d');

		if (ctx) {
			const width = canvas.width;
			const height = canvas.height;
			const delta = Math.floor(width / 256);
			const iLag = eraser ? Math.floor(delta * lag) : 0;

			let xPos = 0 - iLag;
			let heightFactor = Math.floor(height - height / 8);
			const size = 2;

			const animate = () => {
				// Generate the y-value for the wave
				let y = Math.floor(Math.sin((xPos * Math.PI) / 180) * waveHeight + heightFactor);

				// Set the fill style to a light blue color
				ctx.fillStyle = color;

				// Draw a rectangle at the x and y coordinates
				if (xPos >= 0 && !eraser) {
					ctx.fillRect(xPos, y, size, size);
				}

				if (xPos >= 0 && eraser) {
					ctx.clearRect(xPos, y, size, size);
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
					setTimeout(
						() => requestAnimationFrame(() => blob(canvas, waveHeight, color, eraser, lag)),
						1000 / 120
					);
				}
			};

			// Start the animation
			animate();
		}
	}

	let canvas: HTMLCanvasElement;
	let width: number;
	let height: number;

	onMount(() => {
		const waves = new Array(5).fill(25);

		for (let i = 0; i < waves.length; i++) {
			waves[i] = Math.min((waves?.[i - 1] ?? 50) * 1.1, 100);
		}

		canvas.width = width;
		canvas.height = height;

		waves.reverse().forEach((w) => {
			blob(canvas, w, 'lightcoral');
			blob(canvas, w, 'lightcoral', true, 600);
		});
	});

	afterUpdate(() => {
		if (canvas.width !== width) {
			canvas.width = width;
		}

		if (canvas.height !== height) {
			canvas.height = height;
		}
	});
</script>

<svelte:window bind:innerHeight={height} bind:innerWidth={width} />

<div class="absolute top-0 left-0 -z-10">
	<canvas bind:this={canvas} id="canvas-waves" />
</div>
