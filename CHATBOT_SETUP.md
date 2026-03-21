# Chatbot Setup Guide

## What Was Added

Your dashboard now includes an **AI-powered chatbot assistant** that helps you understand and manage your supporter data. The chatbot appears as a floating button in the bottom-right corner of the dashboard.

### Features
- **Ask questions** about your supporter data
- **Get insights** on supporter statistics by status and location
- **Navigate the dashboard** with assistance
- **Privacy-focused**: Only shows aggregate data, never exposes individual details

---

## Quick Setup (3 Steps)

### 1. Get an OpenAI API Key

1. Go to https://platform.openai.com
2. Sign up or log in with your account
3. Click your profile → **API keys**
4. Click **Create new secret key**
5. Copy the key (starts with `sk-`)

### 2. Add to .env.local

Add this line to your `.env.local` file:

```env
OPENAI_API_KEY=sk-proj-your-key-here
```

Your complete `.env.local` should look like:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
OPENAI_API_KEY=sk-proj-your-key-here
```

### 3. Restart and Test

```bash
npm run dev
```

Open http://localhost:3000 and click the **💬** button!

---

## How to Use

### Opening the Chat
- Click the **💬** button in the bottom-right corner
- The chat window opens with introductory message
- Click **✕** to close

### Asking Questions

**Example questions you can ask:**

- "How many supporters do we have total?"
- "What's our breakdown by status?"
- "Show me supporters by district"
- "What districts do we have the most supporters in?"
- "How many strong supporters vs pending?"

### Chat Features
- **Real-time responses** powered by GPT-3.5 Turbo
- **Typing indicator** shows when AI is thinking
- **Scroll automatically** to latest message
- **Press Enter** to send or click **Send** button
- **Context-aware**: Assistant has access to your aggregated data

---

## Files Created

### Components
- **[components/Chatbot.tsx](components/Chatbot.tsx)** - Floating chat UI component

### API Routes
- **[app/api/chat/route.ts](app/api/chat/route.ts)** - ChatGPT backend integration

### Updates
- **[app/page.tsx](app/page.tsx)** - Added Chatbot component to dashboard
- **[components/index.ts](components/index.ts)** - Exported Chatbot component
- **[ENV_GUIDE.md](ENV_GUIDE.md)** - Added OpenAI configuration instructions

---

## Pricing & Costs

### OpenAI Pricing
- **Model**: GPT-3.5 Turbo (most affordable)
- **Cost**: ~$0.01-0.05 per conversation (10-20 messages)
- **Free Trial**: $5 credit for first 3 months
- **Payment**: Pay as you go (no subscription required)

### Example Usage
- 10 people, 2 conversations per day = ~$3/month
- 50 people, 5 conversations per day = ~$10/month

Monitor usage at: https://platform.openai.com/account/usage/overview

---

## Troubleshooting

### "API key not configured" Error
- ✅ Check `.env.local` exists in project root (not in `app/` or `components/`)
- ✅ Verify `OPENAI_API_KEY=sk-...` is present
- ✅ Restart dev server: `npm run dev`

### Chatbot not responding
1. Open browser console: **F12** → **Console** tab
2. Check for error messages
3. Verify API key is active: https://platform.openai.com/api-keys
4. Check you have API credits remaining

### "Maximum tokens exceeded"
- The chatbot temporarily reduces context if conversation gets long
- Start a new chat to reset

---

## Advanced Configuration

### Change the AI Model

To use GPT-4 (more powerful, higher cost):

Open [app/api/chat/route.ts](app/api/chat/route.ts) and change:

```typescript
// Change from:
model: 'gpt-3.5-turbo',

// To:
model: 'gpt-4',
```

**Cost comparison:**
- GPT-3.5 Turbo: ~$0.02 per chat
- GPT-4: ~$0.10 per chat

### Customize System Prompt

In [app/api/chat/route.ts](app/api/chat/route.ts), modify the `systemMessage` variable to change how the assistant behaves.

---

## Privacy & Security

✅ **What's safe:**
- Only aggregate (summary) statistics are shown to AI
- No individual supporter names or contact info
- All data stays within your infrastructure
- API key is server-side only (never exposed to client)

❌ **What's not available:**
- Individual supporter details
- Full contact information
- Detailed personal data

---

## Support & Resources

**OpenAI Help:**
- Docs: https://platform.openai.com/docs
- API Status: https://status.openai.com
- Billing: https://platform.openai.com/account/billing

**Getting Help:**
1. Check browser console (F12) for errors
2. Verify `.env.local` configuration
3. Check OpenAI API key is active and has credits
4. Review [ENV_GUIDE.md](ENV_GUIDE.md) for detailed setup steps

---

## Next Steps

1. ✅ Add `OPENAI_API_KEY` to `.env.local`
2. Run `npm run dev`
3. Test the chatbot with sample questions
4. Explore what insights you can get from your data!

**Questions?** Review [ENV_GUIDE.md](ENV_GUIDE.md) for additional configuration details.
