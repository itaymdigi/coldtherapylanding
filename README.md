# Cold Therapy Landing Page

A modern, bilingual (Hebrew/English) Progressive Web App for Dan's Cold Therapy business.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server (runs on http://0.0.0.0:5000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔐 Environment Variables

Required environment variables (configured in Replit Secrets):

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anon/public key
- `VITE_ADMIN_PASSWORD` - Admin dashboard password

## 📚 Documentation

**All project documentation is located in the `/docs` folder.**

👉 **Start here:** [Documentation Index](/docs/INDEX.md)

### Key Documents

- **[Project Summary](/docs/PROJECT_SUMMARY.md)** - Complete project overview
- **[PWA Guide](/docs/PWA_GUIDE.md)** - Progressive Web App features
- **[AI Chatbot Setup](/docs/AI_CHATBOT_SETUP.md)** - Chatbot implementation
- **[CONVEX_TO_SUPABASE_MIGRATION.md](./CONVEX_TO_SUPABASE_MIGRATION.md)** - Migration reference

## 🎯 Features

- ✅ **Progressive Web App** - Installable on all platforms
- ✅ **AI Chatbot** - Customer support powered by OpenAI
- ✅ **Bilingual** - Full Hebrew/English support
- ✅ **Admin Dashboard** - Content management system
- ✅ **Booking System** - Real-time session bookings
- ✅ **Photo Gallery** - Dynamic image management
- ✅ **Breathing Videos** - Educational content library
- ✅ **Live Practice** - Live session scheduling
- ✅ **SEO Optimized** - Search engine ready

## 🛠️ Tech Stack

- **Frontend:** React + Vite + TailwindCSS
- **Backend:** Supabase (PostgreSQL database)
- **AI:** n8n + OpenAI GPT-4o-mini
- **Deployment:** Replit
- **PWA:** Service Workers + Web App Manifest

## 📦 Project Structure

```
/src
  /components     - React components
  /contexts       - React contexts
  /data          - Static data & translations
  /api           - Supabase API wrappers
  /lib           - Supabase client configuration
/public          - Static assets
/docs            - 📚 All documentation
```

## 🔗 Links

- **Supabase Dashboard:** https://supabase.com/dashboard/project/hqumvakozmicqfrbjssr
- **n8n Workflow:** https://n8n.digiautomation.cloud

---

For detailed documentation, see the [/docs](/docs) folder.
