"use client";

import { Star } from "lucide-react";
import { Card } from "@/components/ui/Card";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Operations Manager, Fintra",
    quote: "We replaced three separate tools with DocPilot AI. The chat-with-PDF feature alone saves our analysts hours every week.",
  },
  {
    name: "David Okafor",
    role: "Founder, Lightpath Consulting",
    quote: "Generating an executive report from a messy Excel export used to take me half a day. Now it takes ninety seconds.",
  },
  {
    name: "Meera Patel",
    role: "Graduate Researcher",
    quote: "The quiz generator turned my lecture PDFs into study material instantly. It's genuinely changed how I revise.",
  },
  {
    name: "Tomás Rivera",
    role: "Legal Ops Lead, Norwood LLP",
    quote: "Merging, watermarking, and converting contracts used to be five different websites. Now it's one clean dashboard.",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 border-t border-ink-100 dark:border-ink-800">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center max-w-xl mx-auto mb-14">
          <h2 className="font-display text-3xl sm:text-4xl font-bold">Loved by teams and individuals</h2>
          <p className="mt-4 text-ink-500 dark:text-ink-400">Real feedback from people who process documents every day.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {testimonials.map((t) => (
            <Card key={t.name} className="p-7">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-brand-500 text-brand-500" />
                ))}
              </div>
              <p className="text-ink-700 dark:text-ink-200 leading-relaxed">"{t.quote}"</p>
              <div className="mt-5 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-semibold text-sm">
                  {t.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="font-medium text-sm">{t.name}</p>
                  <p className="text-xs text-ink-400">{t.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
