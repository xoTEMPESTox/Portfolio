# 🚀 Priyanshu Sah – AI & Full-Stack Portfolio

This repository contains the source code for my **personal portfolio website**, built with **local agentic AI orchestration** (Kilo Code + Ollama).  
The goal is to create a **feature-packed, interactive developer hub** with 3D visuals, dynamic stats integrations, and AI-assisted resume interactions.

---

## 🎯 Vision & Goals

- Professional portfolio showcasing **projects, work experience, and achievements**.
- Built progressively in **stages** (HTML → Tailwind → Next.js → 3D → Feature integrations).
- Powered by **local agentic AI**, following detailed requirements and validation rules.
- Fully deployable on **Vercel**.

---

## 📑 Requirements Checklist

### Core Sections
- [ ] Hero Section (intro, tagline, resume + contact buttons)
- [ ] About Me (bio, skills, photo)
- [ ] Work Experience (timeline)
- [ ] Projects (GitHub repos + demos)
- [ ] Hackathons & Awards
- [ ] Publications / Blogs
- [ ] Resume (viewer + download)
- [ ] Contact (form + social links)

### Extra Features
- [ ] Dynamic Stats Dashboard (GitHub, LeetCode, Codolio, Kaggle, StackOverflow)
- [ ] 3D Skills Cloud
- [ ] Gamification (XP bars, badges)
- [ ] AI Resume Assistant
- [ ] Blog Auto-Fetch (Medium, LinkedIn)
- [ ] Dark/Light Mode

---

## 📂 Project Structure (to be enforced)

```

.
├── Readme.md                # Requirements & progress log
├── Tasks.md                 # Current sprint task list
├── public/                  # Static assets (images, resume PDF, icons)
├── src/
│   ├── components/          # Reusable React/Next.js components
│   ├── pages/               # Next.js routing pages
│   ├── styles/              # Tailwind/global CSS
│   ├── utils/               # Helper functions, API fetchers
│   └── data/                # JSON/YAML for projects, work exp, hackathons
├── package.json
├── next.config.js
└── vercel.json

```

**Rules:**
- Each section must be its own component.
- Content (projects, experience, hackathons) comes from `src/data/*.json`.
- Resume, profile photo, and icons go inside `public/`.

---

## ✅ Validation Rules

Before committing/pushing:

1. Run linter → `npm run lint`
2. Run build → `npm run build`
3. Run formatter → `npm run format` (if available)
4. Verify navigation and links work
5. Only if all steps pass → proceed to commit

---

## 🔐 Git Rules

- Work on a **feature branch per stage** (`stage-1-html`, `stage-2-layout`, etc.)
- Push only after a **stage is complete and validated**.
- Commit messages must follow format:
  - `Stage 2: Added Tailwind layout for Hero + About`
  - `Stage 3: Integrated GitHub API for Projects`
- After validation, merge into `main` and push.

---

## 📈 Progress Log

- Stage 0: Repo initialized ✅
- Stage 1: Static HTML templates scaffolded ✅
- Stage 2: Layout & responsiveness ✅
- Stage 3: Next.js Migration + Dynamic Data ✅
- Stage 4: Advanced UI/UX (3D + Parallax) ✅

---

## 🔗 Resources

- **Resume**: [bit.ly/Priyanshu_Sah-Resume-Foreign](https://bit.ly/Priyanshu_Sah-Resume-Foreign)
- **GitHub**: [@xoTEMPESTox](https://github.com/xoTEMPESTox)
- **LinkedIn**: [linkedin.com/in/priyanshu123sah](https://www.linkedin.com/in/priyanshu123sah/)
- **Codolio Portfolio**: [codolio.com/profile/_TEMPEST_](https://codolio.com/profile/_TEMPEST_)
- **Email**: [priyanshu123sah@gmail.com](mailto:priyanshu123sah@gmail.com)

---

## ⚙️ Agent Workflow

1. Read `README.md` for requirements.
2. Read `TASKS.md` for current sprint.
3. Work only on listed tasks.
4. Validate before commit.
5. Update progress log in `README.md`.
6. Push once per completed stage.
```