import { ThemeProvider } from "next-themes";
import { QueryProvider } from "./QueryProvider";
import { SerwistProvider } from "@serwist/turbopack/react";
import { Toaster } from "sonner";
import { Toast } from "@heroui/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      enableSystem={false}
      attribute="class"
      defaultTheme="light"
      disableTransitionOnChange
    >
      <Toast.Provider placement="top end" />
      <SerwistProvider swUrl="/serwist/sw.js">{children}</SerwistProvider>
      <Toaster richColors position="top-right" />
      {/* <QueryProvider>
      </QueryProvider> */}
    </ThemeProvider>
  );
}
