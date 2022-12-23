<script lang="ts">
	import clsx from 'clsx';
	type ValidHeaders = 'h1' | 'h2' | 'h3' | 'h4';

	export let as: ValidHeaders = 'h1';
	export let classNames: string | undefined;

	const classes = {
		h1: 'font-bold text-2xl text-neutral-300 my-2',
		h2: 'font-semibold text-xl my-2',
		h3: 'font-semibold text-lg my-1',
		h4: 'font-semibold my-1'
	};
</script>

<svelte:element this={as} class={clsx(classes[as], classNames)}><slot /></svelte:element>
