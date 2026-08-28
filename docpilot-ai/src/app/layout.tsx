import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/ThemeProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "DocPilot AI — Transform Documents with AI",
  description:
    "DocPilot AI is an AI-powered document processing platform: merge, split, compress, convert, and chat with your PDFs, Word, Excel, and PowerPoint files. Developed by Hamzah Khan.",
  keywords: ["PDF tools", "AI document processing", "chat with PDF", "document AI", "DocPilot AI"],
  authors: [{ name: "Hamzah Khan" }],
  openGraph: {
    title: "DocPilot AI — Transform Documents with AI",
    description: "Merge, convert, summarize, and chat with your documents using AI.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
