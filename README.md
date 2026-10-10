# JEE Insight AI 🚀

An AI-powered performance analysis, score simulation, and personalized preparation platform for **JEE Main & JEE Advanced** aspirants.

![JEE Insight AI](src/assets/hero.png)

---

## 🌟 Key Features

- **📊 Comprehensive Analytics & Insights**: Deep breakdown of scores across Physics, Chemistry, and Mathematics with accuracy metrics, negative marking analysis, and time distribution.
- **🎯 AI Preparation Coach**: Interactive conversational AI assistant tailored for JEE doubts, concept clarifications, problem-solving strategies, and mental preparation guidance.
- **⚡ Interactive Score Simulator**: "What-If" simulator to project percentiles and college eligibility based on accuracy improvements and targeted marks gains.
- **🔍 Weak Concept Diagnostic**: Automatic identification of low-accuracy and high-negative-marking topics with customized revision suggestions.
- **📅 Smart Adaptive Study Planner**: Day-by-day customized study routines with high-weightage topic prioritization and progress tracking.
- **📝 Real-time Mock Test Engine**: Realistic CBT-style JEE mock tests with countdown timers, subject switching, question pallette, and instant evaluation.
- **📈 Progress & Trend History**: Longitudinal performance tracking across multiple tests with percentile trajectories and mastery milestones.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styling**: Modern Vanilla CSS Design System with dark mode, glassmorphism, responsive typography, and micro-interactions
- **Linting & Quality**: [Oxlint](https://oxc.rs/)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` or `yarn` / `pnpm`

### Installation

```bash
# Clone the repository
git clone https://github.com/SrijeshReddy/jee-insight-ai.git

# Navigate into the project directory
cd jee-insight-ai

# Install dependencies
npm install
```

### Development Server

Run the development server locally:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

Create an optimized production bundle:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

## 📁 Project Structure

```
src/
├── assets/          # Static assets & images
├── components/      # Reusable UI components
│   ├── common/      # StatCards, ProgressBars, TrendCharts, Modals
│   └── layout/      # Sidebar navigation, Topbar
├── data/            # Mock dataset & initial benchmark data
├── pages/           # Core application views (Overview, Analytics, MockTests, etc.)
├── services/        # Business logic & simulation engines
├── types/           # TypeScript interfaces & types
├── App.tsx          # Root application container & page routing
└── index.css        # Global design tokens and styles
```

---

## 📄 License

This project is licensed under the MIT License.
