import { createElement, HTMLProps } from "react";
import clsx from "clsx";

type HeaderProps = HTMLProps<HTMLHeadingElement> & {
  className?: string;
  as?: ValidHeaders;
};

type ValidHeaders = "h1" | "h2";

const classes = {
  h1: "font-bold text-2xl text-neutral-300",
  h2: "",
};

export const Header = ({ className, as = "h1", ...props }: HeaderProps) => {
  return createElement(as, {
    className: clsx(className, classes[as]),
    ...props,
  });
};
