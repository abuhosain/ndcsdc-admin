# NDCSDC Admin Control Portal — NACS 2026 Operations

> **Notre Dame Career & Skill Development Club (NDCSDC)**  
> *Administrative Headquarters & Summit Secretariat Portal*  
> **Flagship Event:** 1st National Academic Career Summit 2026 (14 November 2026)

---

## 🧭 Overview

The **NDCSDC Admin Portal** is an enterprise-grade, bespoke management panel designed for the moderators, executive board, and secretariat of the **Notre Dame Career & Skill Development Club (NDCSDC)**.

It provides real-time control over summit registrations, mock examination track allocations, schedule timelines, activity bulletins, campus photo galleries, executive contact directories, and global countdown drivers.

---

## 📦 Core Modules & Capabilities

| Module | Route | Functionality |
| :--- | :--- | :--- |
| **📊 Executive Overview** | `/dashboard` | Real-time KPI cards (Total registered, today's inflow, active inquiries), capacity gauge (1,800 seats), track distribution breakdown, and instant CSV roster export. |
| **📋 Registrations Roster** | `/dashboard/registrations` | Live search by code/name/phone/institution, filter by **Track** (BUET, IBA, Medical, Abroad) and **Stream** (Science, Commerce, Arts), pass verification modal, confirm/cancel toggles, and filtered CSV export. |
| **🎯 Summit Management** | `/dashboard/summit` | Dynamic management and modal editing for **Tracks & Capacities**, **14 Nov Master Schedule Timeline**, and **Public FAQs**. |
| **📰 Activities & Bulletins** | `/dashboard/activities` | CRUD manager for club activities, study expos, and bootcamps with instant publish/draft toggles. |
| **📸 Photo Gallery & Albums** | `/dashboard/gallery` | Album filtering (`Study Fair 2025`, `Workshops`, `Executive`), photo upload, and caption manager. |
| **👥 Executive Team & Moderator** | `/dashboard/team` | Committee roster, Faculty Moderator designations, phone/email contact directory, Facebook profile links, and public visibility controls. |
| **🤝 Partners & Sponsors** | `/dashboard/partners` | Sponsorship tier management with built-in **Protected Partner Locks** for official website partner **NeexG** ([https://neexg.com](https://neexg.com)). |
| **✉️ Secretariat Messages** | `/dashboard/messages` | Public contact inquiry inbox with unread status indicators and inquiry reader modal. |
| **⚙️ Global Site Settings** | `/dashboard/settings` | Summit date countdown driver, registration capacity limits, campus address, office hours, transit directions, and Google Maps integration. |
| **🔒 Users & Security Audit** | `/dashboard/users` | Role-Based Access Control (`SUPER_ADMIN`, `EDITOR`) and live immutable audit trail logging administrative write actions. |

---

## 🖥️ Layout & UX Architecture

- **Viewport-Locked Shell (`h-screen w-screen overflow-hidden`)**: Locks browser window scrolling, preventing layout shifts.
- **Pinned Left Sidebar (`shrink-0 h-screen`)**: Sidebar remains permanently fixed in place while navigating and scrolling data tables.
- **Independent Content Scroll (`main.flex-1.overflow-y-auto`)**: Only the right-hand dashboard workspace scrolls smoothly.
- **Collapsible Sider**: Compact 76px icon rail mode for expanded data grid viewing.

---

## 🛠️ Technology Stack

- **Framework**: [React 19](https://react.dev/) + [Vite v8](https://vitejs.dev/)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **UI & Data Tables**: [Ant Design v5](https://ant.design/) (Custom branded with `#1A1614` & `#A81818` theme overrides)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Routing**: [React Router v7 / v8](https://reactrouter.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)

---

## 📂 Project Structure

```
ndcsdc-admin/
├── public/
│   └── logos/                 # NDCSDC crest, NDC College logo, NeexG partner assets
├── src/
│   ├── components/
│   │   └── layout/            # MainLayout (Pinned Shell), Sidebar, Header
│   ├── contexts/              # AuthContext (Role & session management)
│   ├── pages/
│   │   ├── dashboard/         # 10 Admin Modules (Overview, Registrations, Summit, etc.)
│   │   └── public/            # Editorial Login screen
│   ├── routes/                # ProtectedRoute wrapper and React Router config
│   ├── index.css              # NDCSDC design tokens & Ant Design theme overrides
│   ├── main.tsx               # App root with ConfigProvider & Toast container
│   └── App.tsx
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## 💻 Getting Started

### Prerequisites
- Node.js 18.18+ or 20+
- npm / yarn / pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/abuhosain/ndcsdc-admin.git
cd ndcsdc-admin

# Install dependencies
npm install
```

### Running Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) (or configured port) in your browser.

### Default Credentials
- **Email**: `admin@ndcsdc.org`
- **Password**: `admin1234`
- **Role**: `SUPER_ADMIN`

### Building for Production

```bash
npm run build
npm run preview
```

---

## 🛡️ Partner & Organization Credits

- **Host Institution**: Notre Dame College, Dhaka
- **Club**: Notre Dame Career & Skill Development Club (NDCSDC)
- **Official Website Partner**: **NeexG** ([https://neexg.com](https://neexg.com))

---

## 📄 License
Internal proprietary portal for Notre Dame Career & Skill Development Club (NDCSDC). All rights reserved © 2026.