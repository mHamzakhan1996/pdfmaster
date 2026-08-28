"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { clsx } from "clsx";

const plans = [
  {
    name: "Free",
    id: "free",
    priceMonthly: 0,
    priceYearly: 0,
    tagline: "Try DocPilot AI with no commitment",
    features: [
      "5 documents / day",
      "Limited AI requests / day",
      "Core PDF tools (merge, split, compress)",
      "Chat with PDF (short docs)",
      "Standard processing speed",
    ],
    cta: "Start for free",
    highlighted: false,
  },
  {
    name: "Premium",
    id: "premium",
    priceMonthly: 19,
    priceYearly: 15,
    tagline: "For professionals & power users",
    features: [
      "Unlimited documents",
      "Unlimited AI requests",
      "All PDF & AI tools unlocked",
      "Priority / faster processing",
      "50 GB cloud storage",
      "Generate reports & presentations",
      "Priority support",
    ],
    cta: "Upgrade to Premium",
    highlighted: true,
  },
  {
    name: "Team",
    id: "team",
    priceMonthly: 49,
    priceYearly: 39,
    tagline: "Shared workspace for teams",
    features: [
      "Everything in Premium",
      "Up to 10 team members",
      "Shared document workspace",
      "Admin & usage analytics",
      "SSO (coming soon)",
      "Dedicated account manager",
    ],
    cta: "Contact sales",
    highlighted: false,
  },
];

export function Pricing() {
  const [yearly, setYearly] = useState(true);

  return (
    <section id="pricing" className="py-24 border-t border-ink-100 dark:border-ink-800">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="font-display text-3xl sm:text-4xl font-bold">Simple, transparent pricing</h2>
          <p className="mt-4 text-ink-500 dark:text-ink-400">Start free. Upgrade when you need unlimited power.</p>

          <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-ink-200 dark:border-ink-700 p-1">
            <button
              onClick={() => setYearly(false)}
              className={clsx("px-4 py-1.5 rounded-full text-sm font-medium transition", !yearly ? "bg-brand-500 text-white" : "text-ink-500")}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={clsx("px-4 py-1.5 rounded-full text-sm font-medium transition", yearly ? "bg-brand-500 text-white" : "text-ink-500")}
            >
              Yearly <span className="opacity-80">(save 20%)</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={clsx(
                "p-8 flex flex-col relative",
                plan.highlighted && "ring-2 ring-brand-500 shadow-glow md:-translate-y-3"
              )}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Most popular
                </span>
              )}
              <h3 className="font-semibold text-lg">{plan.name}</h3>
              <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">{plan.tagline}</p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold">${yearly ? plan.priceYearly : plan.priceMonthly}</span>
                <span className="text-ink-400 text-sm">/month{plan.priceMonthly > 0 && yearly ? ", billed yearly" : ""}</span>
              </div>

              <ul className="mt-6 space-y-3 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-brand-500 mt-0.5 shrink-0" />
                    <span className="text-ink-600 dark:text-ink-300">{f}</span>
                  </li>
                ))}
              </ul>

              <Link href={plan.id === "team" ? "/#contact" : "/signup"} className="mt-8">
                <Button variant={plan.highlighted ? "primary" : "outline"} className="w-full">
                  {plan.cta}
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
