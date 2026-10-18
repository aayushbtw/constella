import type { ReactNode } from "react";

import { Toaster } from "@/components/primitives/toast";
import { Header } from "~/components/header";

function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <Toaster>
      <Header />
      {children}
    </Toaster>
  );
}

export { SiteChrome };
