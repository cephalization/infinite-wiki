<script lang="ts">
	import { goto } from '$app/navigation';
	import Header from '$lib/header.svelte';
	import Waves from '$lib/waves.svelte';
	import '../app.css';

	let disabled: boolean;
	let value: string;
	$: disabled = !value;

	const handleSubmit = (e: SubmitEvent) => {
		e.preventDefault();
		e.stopPropagation();

		if (disabled) return;

		goto(`/article/${value}`);
		value = '';
	};

	const handleReset = () => {};
</script>

<svelte:head>
	<title>Infinite Wiki</title>
	<link
		rel="icon"
		type="image/svg+xml"
		href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22256%22 height=%22256%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%23262626%22></rect><path fill=%22%23d4d4d4%22 d=%22M8.98 28.89L8.98 28.89L14.08 28.83Q14.20 29.57 14.20 30.39L14.20 30.39L14.05 34.31L13.26 70.99L7.67 71.14Q7.67 71.14-7.66 71.28L-7.66 71.28Q-7.74 70.43-7.74 69.12L-7.74 69.12Q-7.74 69.12-6.75 29.27L-6.75 29.27Q-0.27 28.89 8.98 28.89ZM73.03 71.78L73.03 71.78L65.53 51.57L60.96 66.54L59.29 71.49Q54.01 71.78 39.60 71.78L39.60 71.78L24.98 36.16L22.55 28.83L36.82 28.39L44.43 28.22L51.26 50.45L57.79 28.83L73.85 28.57L81.55 48.99L88.12 28.77L107.74 28.57L90.99 71.20Q89.40 71.37 82.80 71.58Q76.19 71.78 73.03 71.78Z%22></path></svg>"
	/>
</svelte:head>

<div class="flex w-full flex-wrap gap-4">
	<nav class="p-2 bg-neutral-800 flex justify-center w-full border-b border-zinc-700">
		<form
			on:submit={handleSubmit}
			class="flex w-full max-w-7xl items-center gap-2 justify-end flex-wrap"
		>
			<Header classNames="grow basis-36 w-full">
				<a href="/" class="no-underline text-zinc-300" on:click={handleReset}>Infinite Wiki</a>
			</Header>
			<input
				class="rounded px-2 py-1 grow basis-96 text-zinc-400 placeholder:text-zinc-500 bg-neutral-700 focus:outline-zinc-500"
				name="search"
				placeholder="Search Infinite Wiki"
				type="search"
				autoComplete="off"
				bind:value
			/>
			<button
				{disabled}
				class="p-2 py-1 grow basis-4 bg-zinc-700 text-zinc-300 rounded disabled:text-zinc-500 transition-colors duration-300"
			>
				Search
			</button>
		</form>
	</nav>
	<slot />
	<Waves />
</div>

<style>
</style>
