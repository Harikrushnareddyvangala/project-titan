import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Navbar } from "@/components/layout/Navbar";
import { ThemeProvider } from "@/providers/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Project TITAN",
    template: "%s | Project TITAN",
  },
  description:
    "Enterprise AI & Data Science Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body className={inter.variable}>
        <ThemeProvider>
          { <Navbar /> }
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}