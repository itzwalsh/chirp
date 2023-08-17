import React, { PropsWithChildren } from "react";

export const PageLayout = (props: PropsWithChildren<object>) => {
  return (
    <main className="overflow-none flex h-screen justify-center">
      <div className="flex h-full w-full flex-col border-x border-accent md:max-w-2xl">
        {props.children}
      </div>
    </main>
  );
};
