import { ReactNode } from "react";
import clsx from "clsx";

type Props = {
  title?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function Card({ title, actions, children, className }: Props) {
  return (
    <div className={clsx("bg-white rounded-2xl shadow-soft p-4", className)}>
      {(title || actions) && (
        <div className="flex items-center justify-between mb-3">
          {title && <h3 className="text-lg font-semibold text-slate-900">{title}</h3>}
          {actions}
        </div>
      )}
      {children}
    </div>
  );
}
