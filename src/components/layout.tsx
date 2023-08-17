import React, { PropsWithChildren } from "react";

export const PageLayout = (props: PropsWithChildren<object>) => {
  return (
    <main className="flex h-screen justify-center">
      <div className="w-full border-x border-accent md:max-w-2xl">
        {props.children}
      </div>
    </main>
  );
};
