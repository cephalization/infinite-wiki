import { FormEvent, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
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
    <div className="p-4 sm:rounded-md bg-slate-200">
      <h1 className="text-lg font-semibold mb-2 sm:mb-0">Infinite Wiki</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col m-4 items-start gap-4"
        ref={ref}
      >
        <input
          disabled={loading}
          className="rounded"
          name="search"
          placeholder="Search for a topic"
          type="search"
        />
        <button
          disabled={loading}
          className="p-2 bg-slate-400 text-white rounded disabled:text-slate-300"
        >
          Search
        </button>
      </form>
      <div className="whitespace-pre-wrap rounded p-4 m-2 bg-slate-700 text-white">
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
