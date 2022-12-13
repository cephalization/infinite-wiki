import clsx from "clsx";
import { FormEvent, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Header } from "./components/Header";
import { Puff } from "./components/Puff";
import { Landing } from "./Landing";
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
    <div className="flex w-full flex-wrap gap-4">
      <nav className="p-2 bg-neutral-800 flex justify-center w-full border-b border-zinc-700">
        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-7xl items-center gap-2 justify-end flex-wrap"
          ref={ref}
        >
          <Header className="grow basis-36 w-full my-0">Infinite Wiki</Header>
          <input
            disabled={loading}
            className="rounded px-2 py-1 grow basis-96 text-zinc-400 placeholder:text-zinc-500 bg-neutral-700 focus:outline-zinc-500"
            name="search"
            placeholder="Search Infinite Wiki"
            type="search"
            autoComplete="off"
          />
          <button
            disabled={loading}
            className="p-2 py-1 grow basis-4 bg-zinc-700 text-zinc-300 rounded disabled:text-slate-300"
          >
            Search
          </button>
        </form>
      </nav>

      {(loading || data?.article) && (
        <div
          className={clsx(
            "p-2 sm:p-4 text-zinc-200 shadow-md shadow-zinc-900 rounded w-full bg-neutral-700 m-1 sm:m-8",
            "transition-all duration-200 whitespace-pre-line"
          )}
        >
          {loading ? (
            <div className="flex items-center justify-center h-full w-full">
              <Puff />
            </div>
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
                h1: (props) => <Header {...props} />,
                h2: (props) => <Header as="h2" {...props} />,
                h3: (props) => <Header as="h3" {...props} />,
                h4: (props) => <Header as="h4" {...props} />,
                ul: (props) => <ul className="my-1" {...props} />,
              }}
              children={data.article}
            />
          ) : null}
        </div>
      )}
      <Landing />
    </div>
  );
}
