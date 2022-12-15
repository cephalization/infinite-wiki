import clsx from "clsx";
import ReactMarkdown from "react-markdown";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { Header } from "../components/Header";
import { Puff } from "../components/Puff";
import { Xmark } from "../components/Xmark";
import { ArticleContext } from "../App";
import {
  getLastBreadcrumbContents,
  isArticle,
  isArticleInitialized,
  isArticleLoading,
  loadArticle,
  useArticleStore,
} from "../store";
import { useEffect } from "react";
import { followupPrimer, initialPrimer } from "../prompts";

export const Article = () => {
  const navigate = useNavigate();
  const { currentTopic, handleReset } = useOutletContext<ArticleContext>();
  const { articleName } = useParams();

  const article = useArticleStore(
    ({ articles }) => articles[articleName as string]
  );
  const uninitialized = !isArticleInitialized(article);
  const loading = isArticleLoading(article);

  useEffect(() => {
    if (uninitialized) {
      loadArticle(articleName as string, [], initialPrimer, false);
    }
  }, []);

  if (uninitialized) {
    return null;
  }

  const handleLink = ({ linkTitle }: { linkTitle: string }) => {
    if (isArticle(article)) {
      const newBreadcrumbs = [...article.breadcrumbs, article.title];
      const primer = (title: string) =>
        followupPrimer(
          article.originalPrompt,
          getLastBreadcrumbContents({
            breadcrumbs: newBreadcrumbs,
            amount: 3,
          }).join("; "),
          title,
          currentTopic ?? ""
        );
      console.log({ newBreadcrumbs });
      loadArticle(linkTitle, newBreadcrumbs, primer, false);
      navigate(`/article/${linkTitle}`);
    }
  };

  return (
    <div
      className={clsx(
        "p-2 sm:p-4 text-zinc-200 shadow-md shadow-zinc-900 rounded w-full bg-neutral-700 m-1 sm:m-8",
        "transition-all duration-200 whitespace-pre-line relative"
      )}
    >
      {!loading && (
        <div className="flex w-full justify-end absolute top-2 right-2">
          <button onClick={handleReset}>
            <Xmark className="hover:text-white hover:cursor-pointer hover:animate-pulse" />
          </button>
        </div>
      )}
      {loading ? (
        <div className="flex items-center justify-center h-full w-full">
          <Puff />
        </div>
      ) : isArticle(article) ? (
        <ReactMarkdown
          components={{
            a: ({ children, ...props }) => (
              <a
                {...props}
                children={children}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  handleLink({ linkTitle: String(children) });
                }}
                className="underline text-blue-400"
              />
            ),
            h1: (props) => <Header {...props} />,
            h2: (props) => <Header as="h2" {...props} />,
            h3: (props) => <Header as="h3" {...props} />,
            h4: (props) => <Header as="h4" {...props} />,
            ul: (props) => <ul className="my-1" {...props} />,
          }}
          children={article.content}
        />
      ) : null}
    </div>
  );
};
