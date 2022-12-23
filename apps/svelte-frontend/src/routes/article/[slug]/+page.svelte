<script lang="ts">
	import SvelteMarkdown from 'svelte-markdown';
	import {
		articleStore,
		getLastBreadcrumbContents,
		isArticle,
		isArticleInitialized,
		isArticleLoading,
		type ArticleEntry
	} from '$lib/article.store';
	import Puff from '$lib/icons/puff.svelte';
	import Xmark from '$lib/icons/xmark.svelte';
	import clsx from 'clsx';
	import type { PageData } from './$types';
	import { followupPrimer, initialPrimer } from '$lib/prompts';
	import { afterUpdate } from 'svelte';
	import Link from '$lib/markdown-renderers/link.svelte';
	import { cleanLink } from '$lib/cleanLink';
	import { goto } from '$app/navigation';

	export let data: PageData;

	let article: ArticleEntry;
	$: article = $articleStore?.articles?.[data.title];

	$: loading = isArticleLoading(article);

	const handleReset = () => {};

	const handleLink = ({ linkTitle }: { linkTitle: string }) => {
		if (isArticle(article)) {
			const { originalPrompt } = article;
			const newBreadcrumbs = [...article.breadcrumbs, article.title];
			const primer = (title: string) =>
				followupPrimer(
					originalPrompt,
					getLastBreadcrumbContents({
						breadcrumbs: newBreadcrumbs,
						amount: 3,
						articles: $articleStore.articles
					}).join('; '),
					title,
					''
				);
			console.log({ newBreadcrumbs });
			articleStore.load(undefined, linkTitle, newBreadcrumbs, primer, false);
			goto(`/article/${cleanLink(linkTitle)}`);
		}
	};

	afterUpdate(() => {
		if (!isArticleInitialized(article)) {
			articleStore.load(article, data.title, [], initialPrimer);
		}
		console.log($articleStore);
	});

	const renderers = {
		link: Link
	};
</script>

<div
	class={clsx(
		'p-2 sm:p-4 text-zinc-200 shadow-md shadow-zinc-900 rounded w-full bg-neutral-700 m-1 sm:m-8',
		'transition-all duration-200 whitespace-pre-line relative'
	)}
>
	<!-- Article Contents -->
	{#if isArticle(article)}
		<div class="flex w-full justify-end absolute top-2 right-2">
			<button on:click={handleReset}>
				<Xmark className="hover:text-white hover:cursor-pointer hover:animate-pulse" />
			</button>
		</div>
		<SvelteMarkdown source={article.content} {renderers} />
	{:else if loading}
		<div class="flex items-center justify-center h-full w-full">
			<Puff />
		</div>
	{/if}
</div>
