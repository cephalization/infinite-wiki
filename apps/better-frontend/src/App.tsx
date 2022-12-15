import { FormEvent, useRef, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

import { Header } from "./components/Header";
import { Landing } from "./Landing";

export type ArticleContext = {
  currentTopic?: string;
  handleReset: () => void;
};

const App = () => {
  const ref = useRef<HTMLFormElement>(null);
  const [search, setSearch] = useState("");
  const [currentTopic, setCurrentTopic] = useState<string>("");
  const navigate = useNavigate();

  const disabled = !search || search === currentTopic;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (ref.current && !disabled) {
      setCurrentTopic(search);
      navigate(`/article/${search}`);
    }
  };

  const handleReset = () => {
    setSearch("");
    setCurrentTopic("");
    navigate("/");
  };

  const context: ArticleContext = {
    currentTopic: currentTopic ?? "",
    handleReset,
  };

  return (
    <div className="flex w-full flex-wrap gap-4">
      <nav className="p-2 bg-neutral-800 flex justify-center w-full border-b border-zinc-700">
        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-7xl items-center gap-2 justify-end flex-wrap"
          ref={ref}
        >
          <Header className="grow basis-36 w-full my-0">
            <Link to="/" onClick={handleReset}>
              Infinite Wiki
            </Link>
          </Header>
          <input
            className="rounded px-2 py-1 grow basis-96 text-zinc-400 placeholder:text-zinc-500 bg-neutral-700 focus:outline-zinc-500"
            name="search"
            placeholder="Search Infinite Wiki"
            type="search"
            autoComplete="off"
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
          />
          <button
            disabled={disabled}
            className="p-2 py-1 grow basis-4 bg-zinc-700 text-zinc-300 rounded disabled:text-zinc-500 transition-colors duration-300"
          >
            Search
          </button>
        </form>
      </nav>
      <Outlet context={context} />
      <Landing />
    </div>
  );
};

export default App;
