import create from "zustand";
import createVanilla from "zustand/vanilla";
import { subscribeWithSelector } from "zustand/middleware";
import { askEndpoint } from "./data/ask";

export type Article = {
  title: string;
  content: string;
  originalPrompt: string;
  breadcrumbs: string[];
};

export const isArticleInitialized = (maybeArticle: unknown) =>
  maybeArticle !== undefined;

export const isArticleLoading = (maybeArticle: unknown) =>
  isArticleInitialized(maybeArticle) &&
  typeof maybeArticle == "boolean" &&
  maybeArticle;

export const isArticle = (maybeArticle: unknown): maybeArticle is Article =>
  isArticleInitialized(maybeArticle) && !isArticleLoading(maybeArticle);

type ArticleStore = {
  articles: Record<string, Article | boolean | undefined>;
};

export const articleStore = createVanilla(
  subscribeWithSelector<ArticleStore>(() => ({
    articles: {},
    breadcrumbs: [],
  }))
);

export const useArticleStore = create(articleStore);

export const loadArticle = async (
  title: string,
  breadcrumbs: string[],
  primer?: (input: string) => string,
  reload: boolean = true
) => {
  try {
    if (
      isArticleLoading(articleStore.getState().articles[title]) ||
      (!reload && isArticle(articleStore.getState().articles[title]))
    ) {
      return;
    }

    console.log(`Loading "${title}"`);

    articleStore.setState((s) => ({
      ...s,
      articles: {
        ...s.articles,
        [title]: true,
      },
    }));

    const response = await askEndpoint({
      prompt: primer ? primer(title) : title,
    });
    const { article, originalPrompt } = await response.json();

    articleStore.setState((s) => ({
      ...s,
      articles: {
        ...s.articles,
        [title]: {
          title,
          content: article,
          originalPrompt,
          breadcrumbs,
        },
      },
    }));

    console.log(`Success: Loaded "${title}"`);
    return articleStore.getState().articles[title] as Article;
  } catch (e) {
    console.log(`Error: Loading "${title}"`);
    return e as Error;
  }
};

export const getLastBreadcrumbContents = ({
  amount,
  breadcrumbs,
}: {
  amount?: number;
  breadcrumbs: string[];
}) => {
  const store = articleStore.getState();

  const crumbs = breadcrumbs
    .flatMap((b) => {
      const article = store.articles[b];

      if (isArticle(article)) {
        return [article.content];
      }

      return [];
    })
    .reverse();

  return amount ? crumbs.slice(-1 * amount) : crumbs;
};

console.log("created");
