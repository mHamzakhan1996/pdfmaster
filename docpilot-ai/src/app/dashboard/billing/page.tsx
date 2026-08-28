"use client";

export const dynamic = "force-dynamic";

import { Check, Zap } from "lucide-react";
import { Topbar } from "@/components/dashboard/Topbar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const plans = [
  { name: "Free", price: 0, current: true, features: ["5 documents/day", "Limited AI requests", "Core PDF tools"] },
  { name: "Premium", price: 19, current: false, features: ["Unlimited documents", "Unlimited AI requests", "All tools unlocked", "Priority processing", "50GB storage"] },
  { name: "Team", price: 49, current: false, features: ["Everything in Premium", "Up to 10 members", "Shared workspace", "Admin analytics"] },
];

export default function BillingPage() {
  return (
    <>
      <Topbar title="Billing & Subscription" />
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <Card className="p-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm text-ink-400">Current plan</p>
            <p className="text-2xl font-bold mt-1">Free</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-ink-500 dark:text-ink-400">
            <Zap className="h-4 w-4 text-brand-500" /> 3 of 5 documents used today
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((p) => (
            <Card key={p.name} className={`p-6 flex flex-col ${p.current ? "ring-2 ring-brand-500" : ""}`}>
              <h3 className="font-semibold">{p.name}</h3>
              <p className="text-3xl font-bold mt-2">${p.price}<span className="text-sm font-normal text-ink-400">/mo</span></p>
              <ul className="mt-4 space-y-2 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-ink-600 dark:text-ink-300">
                    <Check className="h-4 w-4 text-brand-500 mt-0.5 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Button variant={p.current ? "outline" : "primary"} className="w-full mt-5" disabled={p.current}>
                {p.current ? "Current plan" : `Upgrade to ${p.name}`}
              </Button>
            </Card>
          ))}
        </div>

        <Card className="p-6">
          <h3 className="font-semibold mb-1">Payment method</h3>
          <p className="text-sm text-ink-400 mb-4">Managed securely via Stripe. No card on file.</p>
          <Button variant="outline">Add payment method</Button>
        </Card>
      </div>
    </>
  );
}
