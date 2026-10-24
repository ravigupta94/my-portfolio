# Ravi Gupta — Developer Portfolio & Agency Showcase

A modern, high-performance portfolio and agency website built for **Ravi Gupta** (Full Stack Developer & Founder of **ARintelligenceX**). Built with Next.js 14 App Router, Tailwind CSS, Three.js, GSAP, MongoDB, Vercel AI SDK, and a custom authenticated Admin CMS.

---

## 🌟 Key Features

### 1. Interactive Public Portfolio
- **Fluid Visuals & 3D Elements**: Interactive Three.js particle hero canvas, smooth GSAP and Framer Motion micro-interactions, custom interactive cursor, and initial page loader.
- **Dynamic Content Sections**:
  - **Hero**: Catchy headline, social links, call-to-actions, and background animation.
  - **Stats & About**: Overview of expertise, agency mission, and experience.
  - **Skills**: Categorized technical stacks (Frontend, Backend, Databases, Tools).
  - **Timeline Experience**: Career and agency milestones.
  - **Projects Showcase**: Filterable showcase with tech tags, live links, and GitHub repositories.
  - **Agency Showcase (ARintelligenceX)**: Company vision, core services, and team details.
  - **Contact Form**: Form with validation saving inquiries directly to MongoDB.

### 2. Ravi AI — Embedded Intelligent Assistant
- **AI-Powered Chatbot**: Powered by OpenAI (`gpt-4o-mini`) and Vercel AI SDK with real-time text streaming.
- **Dynamic Knowledge Base**: Reads system prompt, identity, FAQs, conversation rules, and services directly from MongoDB.
- **Lead Qualification**: Detects visitor hiring intent and flags conversations as leads for easy review.

### 3. Full-Featured Admin Portal (`/admin`)
- **Secure Authentication**: Protected via JWT cookie sessions (`jose`) and Next.js Edge Middleware.
- **Isolated Layout**: Pure dashboard UI free of public site cursors, 3D canvases, or loaders.
- **Full CMS Capabilities**:
  - 🚀 **Projects Management**: Add, edit, reorder, or delete projects.
  - 💡 **Skills Management**: Update technical categories and proficiency levels.
  - 🏢 **Experience Management**: Maintain career timeline and positions.
  - 🏗️ **Company Profile**: Edit ARintelligenceX tagline, mission, services, and team size.
  - 📬 **Messages & Inquiries**: View, filter (unread/all), search, reply via email, or delete contact submissions.
  - 🤖 **AI Knowledge Base Editor**: Live editor for Ravi AI persona, rules, and FAQ pairs.
  - 💬 **Chat Sessions & Leads**: Inspect visitor conversations and filter qualified leads.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.17+ or v20+)
- [MongoDB Atlas](https://cloud.mongodb.com/) cluster (or local MongoDB)
- [OpenAI API Key](https://platform.openai.com/api-keys)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ravigupta94/ravi-gupta-portfolio.git
   cd "my port"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```
   Configure the following variables in `.env.local`:
   ```env
   # MongoDB Atlas Connection
   MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/ravi-portfolio?retryWrites=true&w=majority

   # Public Site URL
   NEXT_PUBLIC_SITE_URL=http://localhost:3000

   # Admin Panel Secret Password
   ADMIN_SECRET=your-secure-admin-password

   # JWT Secret (minimum 32 random characters)
   JWT_SECRET=your-secure-jwt-secret-min-32-chars-long

   # OpenAI Configuration
   OPENAI_API_KEY=sk-...
   OPENAI_MODEL=gpt-4o-mini
   ```

4. **Seed Initial Database Data**:
   Once MongoDB is connected, start the dev server and hit the seed endpoints in your browser:
   - `http://localhost:3000/api/seed` — Seeds default projects, skills, company info, and experience.
   - `http://localhost:3000/api/ai/seed-kb` — Seeds the AI knowledge base and FAQs.

5. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the portfolio.  
   Open [http://localhost:3000/admin](http://localhost:3000/admin) to log in to the admin portal.

---

## 🛠️ Available Scripts

- `npm run dev` — Starts Next.js development server with Turbopack/HMR.
- `npm run build` — Builds the optimized production application.
- `npm run start` — Starts Next.js in production mode.
- `npm run lint` — Runs ESLint checks across the codebase.

---

## 📁 Project Architecture

```
my-port/
├── app/
│   ├── admin/               # Admin Portal pages (Dashboard, Projects, Skills, Messages, etc.)
│   ├── api/
│   │   ├── admin/           # Protected admin CRUD API endpoints
│   │   ├── ai/              # AI chat streaming & KB seeding
│   │   ├── contact/         # Contact form submission endpoint
│   │   └── seed/            # Main database seeder
│   ├── globals.css          # Tailwind CSS & global styling
│   ├── layout.tsx           # Root HTML and fonts
│   └── page.tsx             # Public portfolio single-page layout
├── components/
│   ├── admin/               # Admin UI components (Sidebar, StatCard, Modal, ConfirmDialog)
│   ├── Cursor.tsx           # Custom interactive mouse follower
│   ├── Loader.tsx           # Initial loading animation
│   ├── Navbar.tsx           # Public navigation bar with mobile drawer
│   ├── PublicShell.tsx      # Public site effect wrapper (isolated from admin)
│   ├── RaviAI.tsx           # Floating AI chat window
│   └── Footer.tsx           # Public footer
├── lib/
│   ├── adminAuth.ts         # JWT sign & verify functions
│   ├── mongodb.ts           # Cached Mongoose connection handler
│   └── systemPrompt.ts      # Dynamic AI prompt builder & fallback KB
├── models/                  # Mongoose Schemas (Project, Skill, Experience, Company, Contact, ChatSession, KnowledgeBase)
├── sections/                # Public portfolio sections (Hero, About, Projects, Skills, Company, Contact, Stats)
├── middleware.ts            # Route protection for /admin and /api/admin
└── tailwind.config.ts       # Tailwind CSS theme configuration
```

---

## 🔒 Security & Admin Access

- All routes under `/admin/*` and `/api/admin/*` (except login endpoints) are protected by Next.js middleware.
- Only users with a valid signed JWT token in an `httpOnly` cookie can access protected pages and APIs.
- Tokens expire in 7 days and can be revoked immediately via logout.

---

## 🚀 Deployment

### Deploy on Vercel
1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. Set the Environment Variables (`MONGODB_URI`, `ADMIN_SECRET`, `JWT_SECRET`, `OPENAI_API_KEY`, `NEXT_PUBLIC_SITE_URL`).
4. Hit Deploy!
