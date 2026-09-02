import type { ReactNode } from "react";

/** Mobile-first shell: centers the kid app on wide screens. */
export function Screen({
  children,
  withNav = true,
}: {
  children: ReactNode;
  withNav?: boolean;
}) {
  return (
    <div className="min-h-screen bg-ivory-fade">
      <div
        className={`mx-auto w-full max-w-md px-5 pt-6 ${withNav ? "pb-32" : "pb-10"}`}
      >
        {children}
      </div>
    </div>
  );
}
