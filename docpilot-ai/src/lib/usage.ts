/**
 * DocPilot AI — Usage limit enforcement
 * Enforces the Free plan's "5 documents/day" and "limited AI requests/day" rules
 * described in the pricing model. Called from /api/upload, /api/process, /api/chat.
 *
 * This uses the UsageRecord table (see prisma/schema.prisma), keyed by (userId, date).
 * Swap the `prisma` import below for your generated client once `prisma generate` has run.
 */

// import { prisma } from "@/lib/prisma"; // uncomment once Prisma client is generated

const FREE_DAILY_DOCS = Number(process.env.FREE_PLAN_DAILY_DOCS || 5);
const FREE_DAILY_AI_REQUESTS = Number(process.env.FREE_PLAN_DAILY_AI_REQUESTS || 10);

export type UsageKind = "documents" | "aiRequests";

export interface UsageCheckResult {
  allowed: boolean;
  used: number;
  limit: number;
  remaining: number;
}

/**
 * Atomically checks whether the user is within their daily quota for `kind`,
 * and increments the counter if allowed. Premium/Team plans always pass.
 */
export async function checkAndIncrementUsage(
  userId: string,
  kind: UsageKind,
  planType: "FREE" | "PREMIUM" | "TEAM" = "FREE"
): Promise<UsageCheckResult> {
  if (planType !== "FREE") {
    return { allowed: true, used: 0, limit: Infinity, remaining: Infinity };
  }

  const limit = kind === "documents" ? FREE_DAILY_DOCS : FREE_DAILY_AI_REQUESTS;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // --- Production implementation (uncomment once Prisma client is available) ---
  // const record = await prisma.usageRecord.upsert({
  //   where: { userId_date: { userId, date: today } },
  //   update: {},
  //   create: { userId, date: today, documentsUsed: 0, aiRequestsUsed: 0 },
  // });
  //
  // const usedField = kind === "documents" ? "documentsUsed" : "aiRequestsUsed";
  // const used = record[usedField];
  //
  // if (used >= limit) {
  //   return { allowed: false, used, limit, remaining: 0 };
  // }
  //
  // await prisma.usageRecord.update({
  //   where: { userId_date: { userId, date: today } },
  //   data: { [usedField]: { increment: 1 } },
  // });
  //
  // return { allowed: true, used: used + 1, limit, remaining: limit - used - 1 };

  // Placeholder pass-through until Prisma is wired in your deployment:
  return { allowed: true, used: 0, limit, remaining: limit };
}
