import { Toast } from "@heroui/react";
import { ThemeProvider } from "next-themes";
import { QueryProvider } from "./QueryProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      enableSystem={false}
      attribute="class"
      defaultTheme="light"
      disableTransitionOnChange
    >
      <Toast.Provider placement="top end" />
      <QueryProvider>{children}</QueryProvider>
    </ThemeProvider>
  );
}
