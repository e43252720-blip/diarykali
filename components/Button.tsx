import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
};

export function Button({ className, variant = "primary", ...props }: Props) {
  const base = "px-4 py-2 rounded-2xl text-sm font-medium transition shadow-soft";
  const variants = {
    primary: "bg-accent text-white hover:bg-accent-muted",
    ghost: "bg-white text-slate-800 hover:bg-slate-100 border border-slate-200",
  };
  return <button className={clsx(base, variants[variant], className)} {...props} />;
}
