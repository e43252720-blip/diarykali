import { ReactNode } from "react";
import { Button } from "./Button";

export function PageHeader({
  title,
  onNew,
  actions,
}: {
  title: string;
  onNew?: () => void;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
        <p className="text-sm text-slate-500">CalmDesk</p>
      </div>
      <div className="flex items-center gap-2">
        {actions}
        {onNew && <Button onClick={onNew}>New</Button>}
      </div>
    </div>
  );
}
