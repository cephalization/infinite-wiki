import { createElement, HTMLProps } from "react";
import clsx from "clsx";

type HeaderProps = HTMLProps<HTMLHeadingElement> & {
  className?: string;
  as?: ValidHeaders;
};

type ValidHeaders = "h1" | "h2" | "h3" | "h4";

const classes = {
  h1: "font-bold text-2xl text-neutral-300 my-2",
  h2: "font-semibold text-xl my-2",
  h3: "font-semibold text-lg my-1",
  h4: "font-semibold my-1",
};

export const Header = ({ className, as = "h1", ...props }: HeaderProps) => {
  return createElement(as, {
    className: clsx(classes[as], className),
    ...props,
  });
};
