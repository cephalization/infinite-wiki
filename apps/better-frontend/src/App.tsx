import clsx from "clsx";
import { FormEvent, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Header } from "./components/Header";
import { followupPrimer, initialPrimer } from "./prompts";

const API_HOST = import.meta.env.VITE_API_HOST || "http://localhost:5001";

const askEndpoint = (body: Record<string, unknown>) =>
  fetch(`${API_HOST}/ask`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });

export default function App() {
  const ref = useRef<HTMLFormElement>(null);
  const [data, setData] = useState<null | {
    article: string;
    originalPrompt: string;
  }>(null);
  const [loading, setLoading] = useState(false);
  const [stream, setStream] = useState<{ data: string; type: "article" }[]>([]);
  const [originalPrompt, setOriginalPrompt] = useState<string | null>(null);
  const [submittedSearch, setSubmittedSearch] = useState<string | null>(null);

  const handleAsk = async ({ prompt }: { prompt: string }) => {
    setLoading(true);
    try {
      const articleResult = await askEndpoint({ prompt });
      const { article, originalPrompt } = await articleResult.json();

      console.log({ article, originalPrompt });
      setData({ article, originalPrompt });
      setStream((s) => [...s, { type: "article", data: article }]);
      return originalPrompt;
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }

    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (ref.current) {
      const formBody = new FormData(ref.current);
      const search = formBody.get("search") as string;

      setStream([]);
      setSubmittedSearch(search);
      const originalPrompt = await handleAsk({ prompt: initialPrimer(search) });
      setOriginalPrompt(originalPrompt);
    }
  };

  const handleLink = ({ linkTitle }: { linkTitle: string }) => {
    const newStream = stream.length > 2 ? stream.slice(1) : stream;
    const prompt = followupPrimer(
      String(originalPrompt),
      newStream.map((n) => n.data).join(";"),
      linkTitle,
      String(submittedSearch)
    );

    setStream(newStream);

    return handleAsk({ prompt });
  };

  console.log({ streamLength: stream.length });

  return (
    <div className="p-2 sm:rounded-md flex w-full flex-wrap gap-4">
      <Header className="flex w-full">Infinite Wiki</Header>
      <form
        onSubmit={handleSubmit}
        className="flex flex-wrap w-full items-start gap-2"
        ref={ref}
      >
        <input
          disabled={loading}
          className="rounded w-full px-2 py-1 text-neutral-800 bg-neutral-300 shadow-inner shadow-zinc-800 focus:outline-zinc-500"
          name="search"
          placeholder="Search for a topic"
          type="search"
          autoComplete="off"
        />
        <button
          disabled={loading}
          className="p-2 py-1 bg-zinc-700 text-zinc-300 rounded disabled:text-slate-300"
        >
          Search
        </button>
      </form>
      <div
        className={clsx(
          "whitespace-pre-wrap p-4 rounded-sm bg-neutral-700 w-full text-white",
          (loading || data?.article) && "shadow-inner shadow-zinc-900",
          "transition-all duration-200"
        )}
      >
        {loading ? (
          "Loading"
        ) : data?.article ? (
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
              h1: (props) => <h1 {...props} className="font-bold" />,
            }}
            children={data.article}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
