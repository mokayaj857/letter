import type { ReactNode } from "react";

/** Adaptive screen shell: seamlessly scales across mobile, tablet, desktop, and large displays with smooth scrolling */
export function Screen({
  children,
  withNav = true,
}: {
  children: ReactNode;
  withNav?: boolean;
}) {
  return (
    <div className="min-h-screen min-h-dvh w-full bg-ivory-fade overflow-x-hidden">
      <main
        className={`mx-auto w-full max-w-md sm:max-w-xl md:max-w-2xl px-4 sm:px-6 pt-4 sm:pt-6 ${
          withNav
            ? "pb-[calc(6.5rem+env(safe-area-inset-bottom,1rem))] sm:pb-[calc(7rem+env(safe-area-inset-bottom,1rem))]"
            : "pb-[calc(2.5rem+env(safe-area-inset-bottom,1rem))]"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
