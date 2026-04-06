# SupportBot Deployment Guide

## Prerequisites

- Vercel account
- PostgreSQL database (Supabase, Neon, Railway, etc.)
- Anthropic API key
- Stripe account

## 1. Database Setup

Create a PostgreSQL database and run migrations:

```bash
DATABASE_URL="your-connection-string" npm run db:push
```

## 2. Stripe Setup

1. Create two products in Stripe Dashboard:
   - Starter: $99/month recurring → copy the Price ID
   - Growth: $199/month recurring → copy the Price ID

2. Set up webhook endpoint:
   - URL: `https://your-app.vercel.app/api/stripe/webhook`
   - Events: `checkout.session.completed`, `invoice.payment_succeeded`, `customer.subscription.deleted`
   - Copy the webhook signing secret

## 3. Environment Variables

Set these in Vercel (Project → Settings → Environment Variables):

```
DATABASE_URL=postgresql://...
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=<run: openssl rand -base64 32>
ANTHROPIC_API_KEY=sk-ant-...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_STARTER_PRICE_ID=price_...
STRIPE_GROWTH_PRICE_ID=price_...
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

## 4. Deploy to Vercel

```bash
npx vercel --prod
```

Or connect the GitHub repo in Vercel dashboard for auto-deploy.

## 5. Post-Deploy

1. Sign up at `/register`
2. Go to Dashboard → copy your embed snippet
3. Add the snippet to your website's `<body>` tag
4. Add knowledge base content at Dashboard → Knowledge Base
5. Test the chat widget on your site

## Widget Embed

```html
<script>
  window.SupportBotConfig = { widgetId: "YOUR_USER_ID" };
</script>
<script src="https://your-app.vercel.app/widget.js" async></script>
```

Your Widget ID is shown on the Dashboard page after signup.
