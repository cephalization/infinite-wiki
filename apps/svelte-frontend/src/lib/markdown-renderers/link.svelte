<script lang="ts">
	export let title: string | undefined = undefined;
	export let raw;
	export let text;
	export let linkOnClick: (e: MouseEvent) => void;

	const href = `/article/${text}`.replaceAll(' ', '_');
</script>

<!-- https://github.com/pablo-abc/svelte-markdown/blob/main/src/renderers/Link.svelte -->
<a {href} {title} on:click={linkOnClick} data-sveltekit-preload-data="off"><slot /></a>
