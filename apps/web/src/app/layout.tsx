import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { ThemeProvider } from "@/providers/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",  
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://example.com"),

  title: {
    default: "Project TITAN",
    template: "%s | Project TITAN",
  },

  description:
    "Enterprise AI & Data Science Platform built with Next.js, FastAPI, Machine Learning, and Interactive Analytics.",

  keywords: [
    "Data Science",
    "Machine Learning",
    "Artificial Intelligence",
    "Portfolio",
    "Python",
    "Power BI",
    "Next.js",
    "FastAPI",
    "Gen AI",
    "Data Analytics",
    "Data Visualization",
    "Data Engineering",
    "Data Analysis",
    "Data Science Portfolio",
    "Data Science Projects",
    "Data Science Portfolio Platform",
    "Data Science Portfolio Website",
    "Data Science Portfolio App",
    "Data Science Portfolio Dashboard",
    "Data Science Portfolio Management",
    "Data Science Portfolio Management Platform",
    "Data Science Portfolio Management App",
    "Data Science Portfolio Management Dashboard",
    "Data Science Portfolio Management Website",
    "Data Science Portfolio Management System",
    "Data Science Portfolio Management Tool",
    "Data Science Portfolio Management Software",
    "Data Science Portfolio Management Solution",
    "Data Science Portfolio Management Framework",
    "Data Science Portfolio Management Architecture",
    "Data Science Portfolio Management Design",
    "Data Science Portfolio Management Development",
    "Data Science Portfolio Management Implementation",
    "Data Science Portfolio Management Deployment",
  ],

  authors: [
    {
      name: "Harikrushnareddy Vangala",
    },
  ],

  creator: "Harikrushnareddy Vangala",

  openGraph: {
    title: "Project TITAN",

    description:
      "Enterprise AI & Data Science Portfolio Platform",

    type: "website",
  },
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
            <Navbar />
            {children}
        </ThemeProvider>
      </body>
    </html>
  );
}