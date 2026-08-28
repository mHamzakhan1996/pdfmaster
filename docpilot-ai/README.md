# DocPilot AI

**AI-powered document processing platform** — merge, split, compress, convert, and chat with your PDFs, Word, Excel, and PowerPoint files.

Developed by **Hamzah Khan**.

---

## 1. Tech Stack

| Layer          | Technology                                             |
|----------------|---------------------------------------------------------|
| Frontend       | Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion |
| Backend        | Next.js Route Handlers (Node.js runtime)                |
| Database       | PostgreSQL + Prisma ORM                                 |
| Auth           | Supabase Auth (email/password + Google OAuth)           |
| Storage        | Supabase Storage (S3-compatible; swappable for AWS S3/R2)|
| AI             | OpenAI API (GPT-4o-mini default; Gemini-ready)           |
| PDF processing | `pdf-lib`, `pdfjs-dist`                                  |
| Office parsing | `mammoth` (Word), `xlsx` (Excel), `pptxgenjs` (PowerPoint)|
| Payments       | Stripe (subscriptions)                                   |
| Charts         | Recharts                                                  |

---

## 2. Project Structure

```
docpilot-ai/
├── prisma/
│   └── schema.prisma            # PostgreSQL schema (Users, Documents, Jobs, Chat, Usage, Billing)
├── src/
│   ├── app/
│   │   ├── page.tsx              # Landing page
│   │   ├── layout.tsx            # Root layout (theme, fonts, metadata)
│   │   ├── globals.css
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   ├── dashboard/
│   │   │   ├── layout.tsx        # Sidebar shell
│   │   │   ├── page.tsx          # Main dashboard (upload + tools)
│   │   │   ├── tools/[tool]/page.tsx  # Dynamic tool runner (PDF + AI tools)
│   │   │   ├── chat/page.tsx     # AI Assistant / Chat with PDF
│   │   │   ├── reports/page.tsx  # Excel → AI report generator
│   │   │   ├── billing/page.tsx
│   │   │   └── settings/page.tsx
│   │   └── api/
│   │       ├── upload/route.ts
│   │       ├── chat/route.ts
│   │       ├── process/route.ts          # dispatches all AI tools
│   │       ├── reports/generate/route.ts
│   │       └── pdf/{merge,split,compress,rotate,watermark,extract}/route.ts
│   ├── components/
│   │   ├── landing/              # Navbar, Hero, FeatureCards, Pricing, Testimonials, Footer
│   │   ├── dashboard/             # Sidebar, Topbar, UploadZone, ToolGrid, DocumentRow
│   │   └── ui/                    # Button, Card, ThemeToggle, ThemeProvider
│   ├── lib/
│   │   ├── ai.ts                  # OpenAI wrapper — all AI document features
│   │   ├── pdf/operations.ts      # pdf-lib based merge/split/compress/rotate/watermark
│   │   ├── extractText.ts         # Client-side PDF/DOCX text extraction
│   │   ├── tools.ts               # Central tool registry
│   │   ├── usage.ts               # Free-plan daily quota enforcement
│   │   ├── utils.ts
│   │   └── supabase/{client,server}.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useDocumentStore.ts    # Zustand client-side document state
│   ├── types/index.ts
│   └── middleware.ts              # Route protection + session refresh
├── .env.example
├── package.json
├── tailwind.config.ts
├── next.config.js
└── tsconfig.json
```

---

## 3. Database Schema (PostgreSQL via Prisma)

Core models (see `prisma/schema.prisma` for full detail):

- **User** — mirrors `auth.users` from Supabase; holds plan type
- **Subscription** — Stripe customer/subscription linkage, plan status
- **Document** — uploaded file metadata, storage path, extracted text, auto-delete timestamp
- **Job** — one row per tool execution (type, status, result, error)
- **ChatSession** / **ChatMessage** — persisted "Chat with PDF" conversations
- **UsageRecord** — per-user, per-day counters enforcing the Free plan's 5 docs/day and limited AI requests/day

---

## 4. Local Setup

### Prerequisites
- Node.js 18.18+ or 20+
- A PostgreSQL database (Supabase, Neon, Railway, or local Postgres)
- A Supabase project (for Auth + Storage)
- An OpenAI API key (or Gemini key)
- (Optional) A Stripe account for billing

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables and fill in real values
cp .env.example .env.local

# 3. Push the Prisma schema to your database
npx prisma generate
npx prisma migrate dev --name init

# 4. Run the dev server
npm run dev
```

App runs at `http://localhost:3000`.

---

## 5. Supabase Configuration

1. Create a project at https://supabase.com
2. **Auth → Providers**: enable *Email* and *Google*. For Google, add your OAuth Client ID/Secret from Google Cloud Console, and set the redirect URL to:
   `https://<your-supabase-project>.supabase.co/auth/v1/callback`
3. **Storage**: create a bucket named `documents` with **private** access. Add a storage policy so each user can only read/write objects under their own `userId/` prefix, e.g.:

```sql
create policy "Users can access their own files"
on storage.objects for all
using ( auth.uid()::text = (storage.foldername(name))[1] );
```

4. Copy your Project URL, anon key, and service role key into `.env.local`.

---

## 6. Stripe Configuration (Billing)

1. Create two recurring Prices in the Stripe dashboard (Premium monthly/yearly).
2. Add a webhook endpoint pointing to `https://your-domain.com/api/stripe/webhook` listening for:
   `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`.
3. Copy the secret key, webhook signing secret, and price IDs into `.env.local`.
4. Wire `Subscription` row updates inside the webhook handler (create this route under `src/app/api/stripe/webhook/route.ts` following the Stripe Node quick-start).

---

## 7. AI Provider Configuration

Default provider is OpenAI (`src/lib/ai.ts`), using `gpt-4o-mini` for cost efficiency. To switch models, change `OPENAI_MODEL` in `.env.local`. To use Google Gemini instead, implement the same exported function signatures in a `src/lib/ai-gemini.ts` file using `@google/generative-ai`, then swap the import in the API routes.

---

## 8. Security Notes

- All file uploads are validated by MIME type and size (`MAX_UPLOAD_SIZE_MB`) in `/api/upload`.
- Files are stored under a per-user path (`{userId}/{uuid}-{filename}`) in Supabase Storage, isolated by Row Level Security policies.
- `middleware.ts` protects all `/dashboard/**` routes — unauthenticated users are redirected to `/login`.
- `SUPABASE_SERVICE_ROLE_KEY` is server-only and must never be exposed to the client bundle.
- Set `FILE_RETENTION_HOURS` to auto-expire uploaded documents; wire a scheduled job (Vercel Cron or Supabase Edge Function) that deletes storage objects and Document rows past `autoDeleteAt`.
- All AI/tool routes check `supabase.auth.getUser()` server-side before processing.

---

## 9. Deployment

### A. Deploy to Vercel
1. Push this repo to GitHub.
2. Import the repo in Vercel → Framework preset: **Next.js**.
3. Add all variables from `.env.example` to Vercel → Project Settings → Environment Variables.
4. Set the build command to `prisma generate && next build` (or add a `postinstall": "prisma generate"` script — already safe to add in `package.json`).
5. Deploy. Vercel will assign a production URL — update `NEXT_PUBLIC_APP_URL` and your Supabase/Stripe redirect URLs to match.

### B. Supabase (Auth + Storage)
Already configured in step 5 above — no separate deployment needed, it's a managed service.

### C. Database (PostgreSQL)
Use Supabase's built-in Postgres, or an external provider (Neon, Railway, RDS). Ensure `DATABASE_URL` and `DIRECT_URL` (for Prisma migrations through connection poolers like PgBouncer) are both set.

### D. Cloud Storage
Supabase Storage is used by default. To use raw AWS S3 or Cloudflare R2 instead, set `STORAGE_PROVIDER=s3` and fill in the `S3_*` variables — then swap the storage calls in `/api/upload/route.ts` for the `@aws-sdk/client-s3` equivalents (already included in `package.json`).

---

## 10. Feature Checklist

**Landing page**: Hero, feature cards, pricing, testimonials, footer credit ✅
**Auth**: Email + Google login, protected routes, profile ✅
**Dashboard**: Upload (PDF/Word/Excel/PPT/Images), document list, tool grid ✅
**PDF tools**: Merge, split, compress, rotate, watermark add/remove, extract pages, PDF↔Word/Excel/PPT conversion stubs ✅
**AI tools**: Chat with PDF, summarize, translate, rewrite, key points, report generation, presentation outline, FAQs, quiz, table extraction ✅
**AI Assistant**: Full chat UI grounded in uploaded document text ✅
**Report Generator**: Excel upload → KPIs, chart, insights, executive summary ✅
**Pricing**: Free (5 docs/day) vs Premium (unlimited) vs Team ✅
**Dark/light mode**: `next-themes`, system-aware ✅
**Responsive design**: Mobile-first Tailwind layout throughout ✅

---

## 11. Notes on What's Wired vs. Stubbed

To be transparent about the state of this codebase:

- **Fully functional, no external keys needed**: PDF merge/split/compress/rotate/watermark/extract (pure `pdf-lib`, runs client-side or server-side).
- **Functional once you add an OpenAI key**: All AI tools (chat, summarize, translate, rewrite, key points, report, presentation outline, FAQs, quiz generation, table extraction, spreadsheet insights).
- **Functional once Supabase is configured**: Auth (email + Google), file storage, protected routes.
- **Scaffolded, needs your Prisma client wired in**: Usage-limit enforcement (`src/lib/usage.ts`), persisting Documents/Jobs/ChatMessages to Postgres — the query shapes are written and commented, just uncomment after running `prisma generate` against your live database.
- **Scaffolded, needs Stripe webhook route**: Billing upgrade flow — the pricing UI and plan cards are live; wire `src/app/api/stripe/webhook/route.ts` following Stripe's Next.js quick-start to activate real subscription changes.
- **Word/Excel/PPT → PDF conversion**: routed through `/api/process`; production implementations typically shell out to LibreOffice headless (`soffice --convert-to pdf`) on the server, or a hosted conversion API — add that call inside the route handler for those tool IDs.

---

## License

Proprietary — © DocPilot AI. Developed by Hamzah Khan.
