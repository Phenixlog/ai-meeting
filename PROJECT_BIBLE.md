# 📋 Meeting Transcriptor Pro - Project Bible

> **Version:** 1.0.0  
> **Created:** January 6, 2025  
> **Last Updated:** January 6, 2025  
> **Status:** 🟡 In Development

---

## 📖 Table of Contents

1. [Project Overview](#-project-overview)
2. [Tech Stack](#-tech-stack)
3. [Architecture](#-architecture)
4. [Database Schema](#-database-schema)
5. [API Endpoints](#-api-endpoints)
6. [Frontend Structure](#-frontend-structure)
7. [Components Specification](#-components-specification)
8. [User Flows](#-user-flows)
9. [Design System](#-design-system)
10. [Implementation Phases](#-implementation-phases)
11. [Environment Variables](#-environment-variables)
12. [Deployment](#-deployment)
13. [Testing Strategy](#-testing-strategy)
14. [Security Considerations](#-security-considerations)
15. [Performance Optimization](#-performance-optimization)
16. [Future Enhancements](#-future-enhancements)

---

## 🎯 Project Overview

### Vision
**Meeting Transcriptor Pro** is a professional-grade web application that transforms the way teams document their meetings. By combining real-time audio capture, AI-powered transcription, and intelligent report generation, it eliminates manual note-taking and delivers structured, actionable meeting summaries.

### Core Value Proposition
- ⏱️ **Save Time**: Eliminate hours of manual transcription
- 📊 **Structured Output**: Auto-generated reports with decisions, action items, and insights
- 🎯 **Never Miss Details**: Capture every important point with timestamp markers
- 📱 **Access Anywhere**: Fully responsive, works on any device
- 🔒 **Secure**: Enterprise-grade authentication and data protection

### Target Users
- Remote teams needing meeting documentation
- Project managers tracking decisions and action items
- Consultants documenting client meetings
- HR professionals recording interviews
- Legal teams transcribing depositions

---

## 🛠 Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | ^18.3.0 | UI Framework |
| **TypeScript** | ^5.6.0 | Type Safety |
| **Vite** | ^6.0.0 | Build Tool & Dev Server |
| **Tailwind CSS** | ^3.4.0 | Styling |
| **shadcn/ui** | Latest | UI Component Library |
| **Lucide React** | ^0.460.0 | Icon Library |
| **React Router** | ^6.28.0 | Client-side Routing |
| **React Markdown** | ^9.0.0 | Markdown Rendering |
| **Zustand** | ^5.0.0 | State Management |
| **React Hook Form** | ^7.54.0 | Form Handling |
| **Zod** | ^3.23.0 | Schema Validation |
| **date-fns** | ^4.1.0 | Date Manipulation |
| **html2pdf.js** | ^0.10.0 | PDF Export |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | ^20.0.0 | Runtime |
| **Express.js** | ^4.21.0 | API Framework |
| **TypeScript** | ^5.6.0 | Type Safety |
| **PostgreSQL** | ^16.0 | Database |
| **Prisma** | ^6.0.0 | ORM |
| **OpenAI API** | ^4.73.0 | Whisper & GPT-4o |
| **Multer** | ^1.4.5 | File Upload Handling |
| **bcryptjs** | ^2.4.3 | Password Hashing |
| **jsonwebtoken** | ^9.0.0 | JWT Authentication |
| **cors** | ^2.8.5 | CORS Middleware |
| **helmet** | ^8.0.0 | Security Headers |
| **winston** | ^3.17.0 | Logging |

### External Services

| Service | Purpose |
|---------|---------|
| **OpenAI Whisper** | Audio Transcription |
| **OpenAI GPT-4o** | Report Generation |
| **Local File Storage** | Audio File Storage |

---

## 🏗 Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           CLIENT (Browser)                          │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    React Application                         │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐ │   │
│  │  │ Recording│  │ History  │  │  Report  │  │Authentication│ │   │
│  │  │   View   │  │Dashboard │  │  Viewer  │  │   Provider   │ │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────────┘ │   │
│  │                                                               │   │
│  │  ┌─────────────────────────────────────────────────────────┐ │   │
│  │  │              MediaRecorder API (Audio Capture)           │ │   │
│  │  └─────────────────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   │ HTTPS
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         EXPRESS.JS API SERVER                        │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                      API Routes                              │   │
│  │  /api/auth/*    /api/meetings/*    /api/transcribe          │   │
│  └─────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Middleware: Auth | CORS | Rate Limiting | Error Handler    │   │
│  └─────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                     Services Layer                           │   │
│  │  TranscriptionService | ReportService | MeetingService      │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                          │                    │
                          ▼                    ▼
              ┌──────────────────┐   ┌──────────────────┐
              │   PostgreSQL     │   │   OpenAI API     │
              │   Database       │   │  Whisper + GPT   │
              └──────────────────┘   └──────────────────┘
```

### Folder Structure

```
AIMeeting/
├── 📁 frontend/
│   ├── 📁 public/
│   │   └── favicon.ico
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   │   ├── 📁 ui/           # shadcn/ui components
│   │   │   │   ├── button.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── dropdown-menu.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   ├── toast.tsx
│   │   │   │   ├── skeleton.tsx
│   │   │   │   ├── badge.tsx
│   │   │   │   └── progress.tsx
│   │   │   ├── 📁 recording/
│   │   │   │   ├── RecordingButton.tsx
│   │   │   │   ├── RecordingTimer.tsx
│   │   │   │   ├── TimestampMarker.tsx
│   │   │   │   ├── TimestampList.tsx
│   │   │   │   ├── AudioWaveform.tsx
│   │   │   │   └── RecordingControls.tsx
│   │   │   ├── 📁 meeting/
│   │   │   │   ├── MeetingForm.tsx
│   │   │   │   ├── MeetingCard.tsx
│   │   │   │   ├── MeetingList.tsx
│   │   │   │   └── MeetingFilters.tsx
│   │   │   ├── 📁 report/
│   │   │   │   ├── ReportViewer.tsx
│   │   │   │   ├── ReportSection.tsx
│   │   │   │   ├── ReportHeader.tsx
│   │   │   │   ├── ActionItemsTable.tsx
│   │   │   │   └── ExportMenu.tsx
│   │   │   ├── 📁 processing/
│   │   │   │   ├── ProcessingLoader.tsx
│   │   │   │   ├── UploadProgress.tsx
│   │   │   │   └── ProcessingStatus.tsx
│   │   │   ├── 📁 layout/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── MobileMenu.tsx
│   │   │   │   └── Layout.tsx
│   │   │   └── 📁 auth/
│   │   │       ├── LoginForm.tsx
│   │   │       ├── SignupForm.tsx
│   │   │       ├── ForgotPasswordForm.tsx
│   │   │       └── ProtectedRoute.tsx
│   │   ├── 📁 pages/
│   │   │   ├── Home.tsx
│   │   │   ├── Recording.tsx
│   │   │   ├── Processing.tsx
│   │   │   ├── Report.tsx
│   │   │   ├── History.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Signup.tsx
│   │   │   └── ForgotPassword.tsx
│   │   ├── 📁 hooks/
│   │   │   ├── useRecording.ts
│   │   │   ├── useAudioCapture.ts
│   │   │   ├── useTimestamps.ts
│   │   │   ├── useMeetings.ts
│   │   │   ├── useAuth.ts
│   │   │   └── useToast.ts
│   │   ├── 📁 stores/
│   │   │   ├── authStore.ts
│   │   │   ├── meetingStore.ts
│   │   │   └── recordingStore.ts
│   │   ├── 📁 services/
│   │   │   ├── api.ts
│   │   │   ├── authService.ts
│   │   │   ├── meetingService.ts
│   │   │   └── uploadService.ts
│   │   ├── 📁 lib/
│   │   │   ├── utils.ts
│   │   │   ├── constants.ts
│   │   │   └── validators.ts
│   │   ├── 📁 types/
│   │   │   ├── meeting.ts
│   │   │   ├── user.ts
│   │   │   ├── timestamp.ts
│   │   │   └── report.ts
│   │   ├── 📁 styles/
│   │   │   └── globals.css
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── vite-env.d.ts
│   ├── components.json        # shadcn config
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── package.json
│   └── .env.local
│
├── 📁 backend/
│   ├── 📁 src/
│   │   ├── 📁 controllers/
│   │   │   ├── authController.ts
│   │   │   ├── meetingController.ts
│   │   │   └── transcriptionController.ts
│   │   ├── 📁 services/
│   │   │   ├── authService.ts
│   │   │   ├── meetingService.ts
│   │   │   ├── transcriptionService.ts
│   │   │   ├── reportService.ts
│   │   │   └── storageService.ts
│   │   ├── 📁 middleware/
│   │   │   ├── auth.ts
│   │   │   ├── errorHandler.ts
│   │   │   ├── rateLimiter.ts
│   │   │   └── upload.ts
│   │   ├── 📁 routes/
│   │   │   ├── auth.ts
│   │   │   ├── meetings.ts
│   │   │   └── transcription.ts
│   │   ├── 📁 utils/
│   │   │   ├── logger.ts
│   │   │   ├── jwt.ts
│   │   │   └── prompts.ts
│   │   ├── 📁 types/
│   │   │   └── index.ts
│   │   ├── 📁 prisma/
│   │   │   └── schema.prisma
│   │   ├── app.ts
│   │   └── server.ts
│   ├── 📁 uploads/            # Temporary audio storage
│   ├── tsconfig.json
│   ├── package.json
│   └── .env
│
├── 📁 docs/
│   └── API.md
├── PROJECT_BIBLE.md           # This file
├── docker-compose.yml
└── README.md
```

---

## 🗄 Database Schema

### Entity Relationship Diagram

```mermaid
erDiagram
    USERS ||--o{ MEETINGS : "has many"
    MEETINGS ||--o{ TIMESTAMPS : "has many"
    
    USERS {
        uuid id PK
        string email UK
        string password_hash
        string name
        timestamp created_at
        timestamp updated_at
    }
    
    MEETINGS {
        uuid id PK
        uuid user_id FK
        string title
        enum type
        text context
        int duration_seconds
        enum status
        text transcript
        text report
        string audio_path
        timestamp meeting_date
        timestamp created_at
        timestamp updated_at
    }
    
    TIMESTAMPS {
        uuid id PK
        uuid meeting_id FK
        int time_seconds
        enum type
        text note
        timestamp created_at
    }
```

### Prisma Schema

```prisma
// backend/src/prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum MeetingType {
  DAILY
  CLIENT_MEETING
  BRAINSTORM
  STRATEGY
  COMMITTEE
  RETROSPECTIVE
  OTHER
}

enum MeetingStatus {
  RECORDING
  UPLOADING
  TRANSCRIBING
  GENERATING_REPORT
  COMPLETED
  FAILED
}

enum TimestampType {
  IMPORTANT_POINT
  DECISION_MADE
  ACTION_ITEM
  IDEA
}

model User {
  id           String    @id @default(uuid())
  email        String    @unique
  passwordHash String    @map("password_hash")
  name         String?
  createdAt    DateTime  @default(now()) @map("created_at")
  updatedAt    DateTime  @updatedAt @map("updated_at")
  
  meetings     Meeting[]
  
  @@map("users")
}

model Meeting {
  id              String        @id @default(uuid())
  userId          String        @map("user_id")
  title           String?
  type            MeetingType   @default(OTHER)
  context         String?
  durationSeconds Int           @default(0) @map("duration_seconds")
  status          MeetingStatus @default(RECORDING)
  transcript      String?
  report          String?
  audioPath       String?       @map("audio_path")
  meetingDate     DateTime      @default(now()) @map("meeting_date")
  createdAt       DateTime      @default(now()) @map("created_at")
  updatedAt       DateTime      @updatedAt @map("updated_at")
  
  user            User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  timestamps      Timestamp[]
  
  @@map("meetings")
}

model Timestamp {
  id        String        @id @default(uuid())
  meetingId String        @map("meeting_id")
  timeSeconds Int         @map("time_seconds")
  type      TimestampType
  note      String?
  createdAt DateTime      @default(now()) @map("created_at")
  
  meeting   Meeting       @relation(fields: [meetingId], references: [id], onDelete: Cascade)
  
  @@map("timestamps")
}
```

---

## 🔌 API Endpoints

### Authentication Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/auth/signup` | Create new user account | ❌ |
| `POST` | `/api/auth/login` | Authenticate user | ❌ |
| `POST` | `/api/auth/logout` | Invalidate session | ✅ |
| `POST` | `/api/auth/forgot-password` | Send password reset email | ❌ |
| `POST` | `/api/auth/reset-password` | Reset password with token | ❌ |
| `GET` | `/api/auth/me` | Get current user info | ✅ |

### Meetings Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/meetings` | Get all user meetings | ✅ |
| `GET` | `/api/meetings/:id` | Get single meeting | ✅ |
| `POST` | `/api/meetings` | Create new meeting | ✅ |
| `PATCH` | `/api/meetings/:id` | Update meeting | ✅ |
| `DELETE` | `/api/meetings/:id` | Delete meeting | ✅ |
| `GET` | `/api/meetings/:id/report` | Get meeting report | ✅ |
| `GET` | `/api/meetings/:id/audio` | Stream audio file | ✅ |

### Transcription Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/transcribe` | Upload audio & transcribe | ✅ |
| `GET` | `/api/transcribe/:id/status` | Get processing status | ✅ |

### Request/Response Examples

#### POST /api/auth/signup

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-here",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "token": "jwt-token-here"
  }
}
```

#### POST /api/meetings

**Request:**
```json
{
  "title": "Q1 Planning Session",
  "type": "STRATEGY",
  "context": "Discussing quarterly goals and OKRs",
  "timestamps": [
    { "timeSeconds": 120, "type": "DECISION_MADE", "note": "Budget approved" },
    { "timeSeconds": 340, "type": "ACTION_ITEM", "note": "John to prepare slides" }
  ]
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "title": "Q1 Planning Session",
    "type": "STRATEGY",
    "status": "RECORDING",
    "createdAt": "2025-01-06T10:30:00Z"
  }
}
```

#### POST /api/transcribe

**Request:** `multipart/form-data`
- `audio`: Audio file (WAV/WebM, max 100MB)
- `meetingId`: Meeting UUID

**Response (202):**
```json
{
  "success": true,
  "data": {
    "meetingId": "uuid-here",
    "status": "UPLOADING",
    "estimatedTime": 45
  }
}
```

---

## 🎨 Frontend Structure

### Pages Breakdown

#### Home Page (`/`)
- Hero section with app description
- "Start Recording" CTA button
- Brief feature highlights
- Redirect to Recording page on click

#### Recording Page (`/recording`)
- Pre-meeting form (optional, collapsible)
  - Meeting title input
  - Meeting type dropdown
  - Context textarea
- Large recording button (center)
- When recording:
  - Live timer (MM:SS)
  - Pause/Resume button
  - Timestamp quick actions bar
  - List of added timestamps
  - Audio waveform visualization
  - Stop button

#### Processing Page (`/processing/:id`)
- Animated loader
- Upload progress bar (0-100%)
- Status text that cycles through:
  - "Uploading audio..."
  - "Transcribing audio..."
  - "Analyzing content..."
  - "Generating report..."
- Estimated time remaining
- Auto-redirect to Report when complete

#### Report Page (`/report/:id`)
- Meeting header (title, date, type, duration)
- Expandable/collapsible sections:
  - Executive Summary
  - Decisions Made
  - Action Items (table)
  - Key Discussion Points
  - Blockers & Open Questions
  - Insights & Ideas
- Export menu (floating or sticky)
- Back to History button

#### History Page (`/history`)
- Search bar with filters
- Sortable list of meetings
- Each card shows:
  - Title
  - Date & time
  - Meeting type badge
  - Duration
  - Quick actions (view, delete)
- Empty state for new users
- Pagination or infinite scroll

#### Auth Pages
- `/login` - Email/password form
- `/signup` - Registration form with password requirements
- `/forgot-password` - Email input for reset

---

## 🧩 Components Specification

### RecordingButton

```typescript
interface RecordingButtonProps {
  isRecording: boolean;
  isPaused: boolean;
  onStart: () => void;
  onStop: () => void;
  onPause: () => void;
  onResume: () => void;
}
```

**Visual States:**
- **Idle**: Large indigo circle with mic icon, pulse animation on hover
- **Recording**: Red background, animated ring pulse, stop icon
- **Paused**: Yellow background, play icon

**Animation:** CSS keyframe pulse animation when recording

---

### TimestampMarker

```typescript
interface TimestampMarkerProps {
  type: 'important' | 'decision' | 'action' | 'idea';
  time: number; // seconds
  note?: string;
  onClick?: () => void;
  onDelete?: () => void;
}
```

**Icons:**
- 📌 Important Point
- ✅ Decision Made
- 🚨 Action Item
- 💡 Idea

**Visual:** Badge with colored background, time display (MM:SS), hover to reveal delete

---

### ReportSection

```typescript
interface ReportSectionProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}
```

**Features:**
- Collapsible with smooth animation
- Chevron indicator for state
- Markdown rendering inside
- Copy section button

---

### MeetingCard

```typescript
interface MeetingCardProps {
  id: string;
  title: string;
  date: Date;
  type: MeetingType;
  duration: number;
  status: MeetingStatus;
  onView: () => void;
  onDelete: () => void;
}
```

**Layout:**
- Title (large)
- Date/time (subtle)
- Type badge (colored)
- Duration formatted
- Hover to reveal actions

---

### ProcessingLoader

```typescript
interface ProcessingLoaderProps {
  status: 'uploading' | 'transcribing' | 'generating' | 'complete';
  progress: number; // 0-100
  estimatedSeconds?: number;
}
```

**Animation:** Animated spinner with status text, progress bar below

---

### ExportMenu

```typescript
interface ExportMenuProps {
  onExportMd: () => void;
  onExportPdf: () => void;
  onSendEmail: () => void;
  onCopyLink: () => void;
}
```

**Layout:** Dropdown menu with icons for each option

---

## 🚶 User Flows

### Flow 1: New User Registration

```mermaid
flowchart TD
    A[Landing Page] --> B[Click Sign Up]
    B --> C[Enter Email/Password/Name]
    C --> D{Valid Input?}
    D -->|No| E[Show Validation Errors]
    E --> C
    D -->|Yes| F[Create Account]
    F --> G[Store JWT]
    G --> H[Redirect to Home]
```

### Flow 2: Recording a Meeting

```mermaid
flowchart TD
    A[Home Page] --> B[Click Start Recording]
    B --> C[Optional: Fill Meeting Details]
    C --> D[Click Record Button]
    D --> E[Request Mic Permission]
    E --> F{Permission Granted?}
    F -->|No| G[Show Error Message]
    F -->|Yes| H[Start Recording]
    H --> I[Display Timer]
    I --> J[Add Timestamp Markers]
    J --> K[Click Stop]
    K --> L[Navigate to Processing]
```

### Flow 3: Post-Recording Processing

```mermaid
flowchart TD
    A[Processing Page] --> B[Upload Audio]
    B --> C[Show Upload Progress]
    C --> D[Audio Uploaded]
    D --> E[Call Whisper API]
    E --> F[Show Transcribing Status]
    F --> G[Transcript Ready]
    G --> H[Call GPT-4o API]
    H --> I[Show Generating Status]
    I --> J[Report Ready]
    J --> K[Auto-redirect to Report Page]
```

### Flow 4: Viewing Past Meetings

```mermaid
flowchart TD
    A[History Page] --> B[Search/Filter]
    B --> C[Select Meeting]
    C --> D[View Report]
    D --> E{Export?}
    E -->|Markdown| F[Download .md]
    E -->|PDF| G[Download .pdf]
    E -->|Email| H[Send via Email]
    E -->|Link| I[Copy Shareable URL]
```

---

## 🎨 Design System

### Color Palette

```css
:root {
  /* Primary Colors */
  --primary-50: #eef2ff;
  --primary-100: #e0e7ff;
  --primary-200: #c7d2fe;
  --primary-300: #a5b4fc;
  --primary-400: #818cf8;
  --primary-500: #6366f1;  /* Main Primary */
  --primary-600: #4f46e5;
  --primary-700: #4338ca;
  --primary-800: #3730a3;
  --primary-900: #312e81;
  
  /* Success Colors */
  --success-50: #ecfdf5;
  --success-100: #d1fae5;
  --success-500: #10b981;  /* Main Success */
  --success-600: #059669;
  
  /* Danger Colors */
  --danger-50: #fef2f2;
  --danger-100: #fee2e2;
  --danger-500: #ef4444;   /* Main Danger */
  --danger-600: #dc2626;
  
  /* Warning Colors */
  --warning-500: #f59e0b;
  
  /* Neutral Colors */
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-400: #9ca3af;
  --gray-500: #6b7280;
  --gray-600: #4b5563;
  --gray-700: #374151;
  --gray-800: #1f2937;
  --gray-900: #111827;
  
  /* Backgrounds */
  --bg-light: #ffffff;
  --bg-dark: #1f2937;
  
  /* Text */
  --text-dark: #111827;
  --text-light: #f9fafb;
  --text-muted: #6b7280;
}
```

### Typography

```css
/* Font Stack */
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;

/* Font Sizes */
--text-xs: 0.75rem;     /* 12px */
--text-sm: 0.875rem;    /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg: 1.125rem;    /* 18px */
--text-xl: 1.25rem;     /* 20px */
--text-2xl: 1.5rem;     /* 24px */
--text-3xl: 1.875rem;   /* 30px */
--text-4xl: 2.25rem;    /* 36px */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;

/* Line Heights */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
```

### Spacing Scale

```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
```

### Border Radius

```css
--radius-sm: 0.25rem;   /* 4px */
--radius-md: 0.375rem;  /* 6px */
--radius-lg: 0.5rem;    /* 8px */
--radius-xl: 0.75rem;   /* 12px */
--radius-2xl: 1rem;     /* 16px */
--radius-full: 9999px;  /* Circular */
```

### Shadows

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
```

### Animation Keyframes

```css
@keyframes pulse-ring {
  0% { transform: scale(1); opacity: 1; }
  100% { transform: scale(1.5); opacity: 0; }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-up {
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
```

---

## 📅 Implementation Phases

### Phase 1: Foundation Setup ⏱️ ~2 hours
- [x] Initialize Vite React project with TypeScript
- [ ] Configure Tailwind CSS
- [ ] Install and configure shadcn/ui
- [ ] Set up folder structure
- [ ] Create base layout components (Header, Footer, Layout)
- [ ] Configure React Router with routes
- [ ] Set up Zustand stores

### Phase 2: Authentication ⏱️ ~2 hours
- [ ] Create Prisma schema for users
- [ ] Build signup API endpoint
- [ ] Build login API endpoint
- [ ] Implement JWT token handling
- [ ] Create LoginForm component
- [ ] Create SignupForm component
- [ ] Build auth store
- [ ] Create ProtectedRoute component

### Phase 3: Recording Interface ⏱️ ~3 hours
- [ ] Build RecordingButton component
- [ ] Implement MediaRecorder hook
- [ ] Build RecordingTimer component
- [ ] Create timestamp button actions
- [ ] Build TimestampMarker component
- [ ] Build TimestampList component
- [ ] Create AudioWaveform component (optional)
- [ ] Build MeetingForm (pre-recording)
- [ ] Assemble Recording page

### Phase 4: Audio Processing Backend ⏱️ ~3 hours
- [ ] Create meetings table in database
- [ ] Build meeting CRUD endpoints
- [ ] Set up file upload middleware (Multer)
- [ ] Implement audio storage service
- [ ] Create Whisper transcription service
- [ ] Build GPT-4o report generation service
- [ ] Create processing status endpoints
- [ ] Handle async job processing

### Phase 5: Processing UI ⏱️ ~1 hour
- [ ] Build ProcessingLoader component
- [ ] Create UploadProgress component
- [ ] Build ProcessingStatus component
- [ ] Implement polling for status updates
- [ ] Handle error states
- [ ] Auto-redirect on completion

### Phase 6: Report Viewer ⏱️ ~2 hours
- [ ] Build ReportHeader component
- [ ] Build ReportSection component (collapsible)
- [ ] Build ActionItemsTable component
- [ ] Implement Markdown rendering
- [ ] Build ExportMenu component
- [ ] Implement Markdown export
- [ ] Implement PDF export (html2pdf)
- [ ] Implement copy link functionality
- [ ] Assemble Report page

### Phase 7: History Dashboard ⏱️ ~2 hours
- [ ] Build MeetingCard component
- [ ] Build MeetingList component
- [ ] Create search functionality
- [ ] Implement filter dropdowns
- [ ] Build empty state
- [ ] Implement delete with confirmation
- [ ] Add loading skeletons
- [ ] Assemble History page

### Phase 8: Polish & Testing ⏱️ ~2 hours
- [ ] Mobile responsive adjustments
- [ ] Add toast notifications
- [ ] Error boundary implementation
- [ ] Loading states refinement
- [ ] Cross-browser testing
- [ ] Performance optimization
- [ ] Final UI polish

### Phase 9: Deployment ⏱️ ~1 hour
- [ ] Configure production environment
- [ ] Set up database on production
- [ ] Deploy backend
- [ ] Deploy frontend
- [ ] Configure domain (if applicable)
- [ ] Final testing on production

---

## 🔐 Environment Variables

### Frontend (.env.local)

```env
# API
VITE_API_URL=http://localhost:3001/api

# App
VITE_APP_NAME="Meeting Transcriptor Pro"
VITE_APP_URL=http://localhost:5173
```

### Backend (.env)

```env
# Server
PORT=3001
NODE_ENV=development

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/meeting_transcriptor?schema=public"

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key

# Storage
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=104857600  # 100MB

# CORS
CORS_ORIGIN=http://localhost:5173
```

---

## 🚀 Deployment

### Option 1: Local Development

```bash
# Start PostgreSQL (Docker)
docker run --name meeting-db -e POSTGRES_PASSWORD=password -e POSTGRES_DB=meeting_transcriptor -p 5432:5432 -d postgres:16

# Backend
cd backend
npm install
npx prisma migrate dev
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

### Option 2: Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_USER: meeting_user
      POSTGRES_PASSWORD: secure_password
      POSTGRES_DB: meeting_transcriptor
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    environment:
      DATABASE_URL: postgresql://meeting_user:secure_password@postgres:5432/meeting_transcriptor
      JWT_SECRET: ${JWT_SECRET}
      OPENAI_API_KEY: ${OPENAI_API_KEY}
    ports:
      - "3001:3001"
    depends_on:
      - postgres
    volumes:
      - uploads:/app/uploads

  frontend:
    build: ./frontend
    ports:
      - "5173:80"
    depends_on:
      - backend

volumes:
  postgres_data:
  uploads:
```

### Option 3: Railway / Render

1. Create PostgreSQL database service
2. Deploy backend as web service
3. Deploy frontend as static site
4. Configure environment variables
5. Set up custom domain (optional)

---

## 🧪 Testing Strategy

### Unit Tests (Vitest)

```typescript
// Example: RecordingButton.test.tsx
describe('RecordingButton', () => {
  it('renders idle state correctly', () => {
    render(<RecordingButton isRecording={false} />);
    expect(screen.getByRole('button')).toHaveClass('bg-indigo-500');
  });

  it('shows recording state when active', () => {
    render(<RecordingButton isRecording={true} />);
    expect(screen.getByRole('button')).toHaveClass('bg-red-500');
  });

  it('calls onStart when clicked in idle state', () => {
    const onStart = vi.fn();
    render(<RecordingButton isRecording={false} onStart={onStart} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onStart).toHaveBeenCalled();
  });
});
```

### Integration Tests (Playwright)

```typescript
// Example: recording-flow.spec.ts
test.describe('Recording Flow', () => {
  test('completes full recording cycle', async ({ page }) => {
    await page.goto('/recording');
    
    // Start recording
    await page.click('[data-testid="record-button"]');
    await expect(page.locator('[data-testid="timer"]')).toBeVisible();
    
    // Wait 3 seconds
    await page.waitForTimeout(3000);
    
    // Add timestamp
    await page.click('[data-testid="action-item-btn"]');
    await expect(page.locator('[data-testid="timestamp-list"]')).toContainText('Action Item');
    
    // Stop recording
    await page.click('[data-testid="stop-button"]');
    
    // Should navigate to processing
    await expect(page).toHaveURL(/\/processing\/.*/);
  });
});
```

### API Tests (Supertest)

```typescript
// Example: meetings.test.ts
describe('Meetings API', () => {
  it('POST /api/meetings creates a new meeting', async () => {
    const response = await request(app)
      .post('/api/meetings')
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        title: 'Test Meeting',
        type: 'DAILY'
      });
    
    expect(response.status).toBe(201);
    expect(response.body.data.title).toBe('Test Meeting');
  });
});
```

---

## 🔒 Security Considerations

### Authentication
- ✅ Passwords hashed with bcrypt (cost factor 12)
- ✅ JWT tokens with short expiration (7 days)
- ✅ Secure HTTP-only cookies for token storage (alternative)
- ✅ Rate limiting on auth endpoints (5 requests/minute)

### Data Protection
- ✅ HTTPS enforced in production
- ✅ CORS configured for specific origins
- ✅ Content Security Policy headers
- ✅ XSS protection with input sanitization
- ✅ SQL injection prevention via Prisma ORM

### File Upload Security
- ✅ File type validation (WAV, WebM only)
- ✅ File size limit (100MB)
- ✅ Secure filename generation
- ✅ Files stored outside web root

### API Security
- ✅ Helmet middleware for security headers
- ✅ Request body size limits
- ✅ Parameter validation with Zod
- ✅ Error messages don't leak internal details

---

## ⚡ Performance Optimization

### Frontend
- [ ] Code splitting with React.lazy()
- [ ] Image optimization
- [ ] Service worker for offline support
- [ ] Memoization with React.memo and useMemo
- [ ] Virtual scrolling for long lists
- [ ] Bundle size analysis and optimization

### Backend
- [ ] Database query optimization with indexes
- [ ] Connection pooling
- [ ] Response compression (gzip)
- [ ] Redis caching for frequent queries
- [ ] Background job processing for transcription

### Audio Processing
- [ ] Stream upload for large files
- [ ] Chunked transcription for long audio
- [ ] WebSocket for real-time status updates

---

## 🚀 Future Enhancements

### V1.1 - Collaboration
- [ ] Multi-user meeting support
- [ ] Shared meeting links
- [ ] Real-time collaborative editing
- [ ] Comments on report sections

### V1.2 - Intelligence
- [ ] Multiple language support
- [ ] Speaker diarization
- [ ] Sentiment analysis
- [ ] Topic extraction

### V1.3 - Integrations
- [ ] Slack integration
- [ ] Google Calendar sync
- [ ] Notion export
- [ ] Zapier webhooks

### V2.0 - Advanced Features
- [ ] Audio playback with transcript sync
- [ ] AI-powered search across meetings
- [ ] Custom report templates
- [ ] Team analytics dashboard

---

## 📝 Development Checklist

### Before Starting
- [x] Project Bible created
- [ ] Environment set up
- [ ] Dependencies installed
- [ ] Database running

### During Development
- [ ] Follow component specifications
- [ ] Match design system colors
- [ ] Implement proper TypeScript types
- [ ] Add loading states
- [ ] Add error handling
- [ ] Write tests as you go

### Before Deployment
- [ ] All tests passing
- [ ] Mobile responsive
- [ ] Cross-browser tested
- [ ] Performance optimized
- [ ] Security review completed
- [ ] Environment variables secured

---

## 🆘 Troubleshooting

### Common Issues

**Audio Recording Not Working**
- Check browser permissions for microphone
- Ensure HTTPS in production
- Verify MediaRecorder API support

**OpenAI API Errors**
- Verify API key is valid
- Check rate limits
- Ensure audio format is supported (WAV, WebM)

**Database Connection Issues**
- Verify DATABASE_URL format
- Check PostgreSQL is running
- Ensure network connectivity

**JWT Token Issues**
- Verify JWT_SECRET is set
- Check token expiration
- Clear browser storage and re-login

---

> **📌 Note for Antigravity:** This document is your single source of truth. Follow the implementation phases in order, reference component specifications for consistency, and check off items as you complete them. When in doubt, refer back to this bible.

---

*End of Project Bible - Meeting Transcriptor Pro v1.0.0*
