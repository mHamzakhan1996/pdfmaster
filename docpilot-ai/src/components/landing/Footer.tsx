import Link from "next/link";
import { FileStack, Twitter, Github, Linkedin } from "lucide-react";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "AI Tools", href: "#ai-tools" },
      { label: "Pricing", href: "#pricing" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Security", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-ink-100 dark:border-ink-800 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 font-display font-bold text-lg">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
                <FileStack className="h-4.5 w-4.5 text-white" />
              </div>
              DocPilot <span className="text-brand-500">AI</span>
            </Link>
            <p className="mt-4 text-sm text-ink-500 dark:text-ink-400 max-w-xs">
              AI-powered document processing — merge, convert, summarize, and chat with your files.
            </p>
            <div className="mt-5 flex gap-3">
              <a href="#" aria-label="Twitter" className="h-9 w-9 rounded-lg border border-ink-200 dark:border-ink-700 flex items-center justify-center hover:bg-ink-50 dark:hover:bg-ink-800">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" aria-label="GitHub" className="h-9 w-9 rounded-lg border border-ink-200 dark:border-ink-700 flex items-center justify-center hover:bg-ink-50 dark:hover:bg-ink-800">
                <Github className="h-4 w-4" />
              </a>
              <a href="#" aria-label="LinkedIn" className="h-9 w-9 rounded-lg border border-ink-200 dark:border-ink-700 flex items-center justify-center hover:bg-ink-50 dark:hover:bg-ink-800">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-semibold text-sm mb-4">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="text-sm text-ink-500 dark:text-ink-400 hover:text-ink-900 dark:hover:text-white transition-colors">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-8 border-t border-ink-100 dark:border-ink-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-ink-400">
          <p>© {new Date().getFullYear()} DocPilot AI. All rights reserved.</p>
          <p className="font-medium text-ink-500 dark:text-ink-300">
            Developed by <span className="text-brand-500">Hamzah Khan</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
