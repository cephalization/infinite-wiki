import { writable } from 'svelte/store';
import { askEndpoint } from './data/ask';

export type Article = {
	title: string;
	content: string;
	originalPrompt: string;
	breadcrumbs: string[];
};

export const isArticleInitialized = (maybeArticle: unknown) => maybeArticle !== undefined;

export const isArticleLoading = (maybeArticle: unknown) =>
	isArticleInitialized(maybeArticle) && typeof maybeArticle == 'boolean' && maybeArticle;

export const isArticle = (maybeArticle: unknown): maybeArticle is Article =>
	isArticleInitialized(maybeArticle) && !isArticleLoading(maybeArticle);

export type ArticleEntry = Article | boolean | undefined;

type ArticleStore = {
	articles: Record<string, ArticleEntry>;
};

export const createArticleStore = () => {
	const { subscribe, update } = writable<ArticleStore>({
		articles: {}
	});

	const loadArticle = async (
		articleEntry: ArticleEntry,
		title: string,
		breadcrumbs: string[],
		primer?: (input: string) => string,
		reload = true
	) => {
		try {
			if (isArticleLoading(articleEntry) || (!reload && isArticle(articleEntry))) {
				return articleEntry;
			}

			update((s) => {
				const newState = { ...s };

				console.log(`Loading "${title}"`);

				return {
					...newState,
					articles: {
						...newState.articles,
						[title]: true
					}
				};
			});

			const response = await askEndpoint({
				prompt: primer ? primer(title) : title
			});

			const { article, originalPrompt } = await response.json();

			const newEntry: ArticleEntry = {
				title,
				content: article,
				originalPrompt,
				breadcrumbs
			};

			update((s) => ({
				...s,
				articles: {
					...s.articles,
					[title]: newEntry
				}
			}));

			console.log(`Success: Loaded "${title}"`);
			return newEntry;
		} catch (e) {
			console.log(`Error: Loading "${title}"`);
			return e as Error;
		}
	};

	return {
		subscribe,
		load: loadArticle
	};
};

export const getLastBreadcrumbContents = ({
	amount,
	breadcrumbs,
	articles
}: {
	amount?: number;
	breadcrumbs: string[];
	articles: ArticleStore['articles'];
}) => {
	const crumbs = breadcrumbs
		.flatMap((b) => {
			const article = articles[b];

			if (isArticle(article)) {
				return [article.content];
			}

			return [];
		})
		.reverse();

	return amount ? crumbs.slice(-1 * amount) : crumbs;
};

export const articleStore = createArticleStore();
console.log('created');
