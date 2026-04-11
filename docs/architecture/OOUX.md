# OOUX — Object-Oriented UX Map

## Core Objects

### 1. User
| Attribute       | Type     | Source        |
|-----------------|----------|---------------|
| id              | uuid     | Supabase Auth |
| email           | string   | Supabase Auth |
| full_name       | string   | Supabase Auth metadata / profiles |
| avatar_url      | string?  | profiles table |
| created_at      | datetime | Supabase Auth |

**Actions:** Sign up, Sign in, Sign out, Update profile, Delete account

**Relationships:**
- User → has many → Reviews
- User → has one → Profile (Supabase)

---

### 2. Review
| Attribute            | Type     | Source       |
|----------------------|----------|--------------|
| id                   | string   | Generated    |
| name                 | string   | AI-derived   |
| initials             | string   | Derived      |
| date                 | string   | Client time  |
| focus                | string   | User input   |
| pageType             | string   | User input   |
| overall              | number   | GPT-4o       |
| competitivePosition  | string   | GPT-4o       |
| summary              | string   | GPT-4o       |
| strengths            | string[] | GPT-4o       |
| improvements         | string[] | GPT-4o       |
| criticalGaps         | string[] | GPT-4o       |
| categories           | string[] | Derived      |

**Actions:** Create (upload), View, Search, Filter, Sort, Delete

**Relationships:**
- Review → has one → Scores
- Review → has many → Pages
- Review → has many → Recommendations
- Review → has one? → LevelAssessment
- Review → has one? → PositioningRewrite

**Storage:** localStorage (client-only, max 50)

---

### 3. Scores
| Attribute        | Type   | Range |
|------------------|--------|-------|
| positioning      | number | 0–10  |
| caseStudy        | number | 0–10  |
| visualDesign     | number | 0–10  |
| strategicDepth   | number | 0–10  |
| aiTools          | number | 0–10  |
| personality      | number | 0–10  |
| infoArchitecture | number | 0–10  |
| copywriting      | number | 0–10  |
| accessibility    | number | 0–10  |

**Color coding:** >= 7 acid (good), 4–6 warning (fair), < 4 error (poor)

---

### 4. Page (Review sub-object)
| Attribute | Type           |
|-----------|----------------|
| id        | string         |
| name      | string         |
| score     | number (0–10)  |
| feedback  | FeedbackItem[] |

**FeedbackItem:** `{ text: string, severity: "strong" | "improve" | "issue" }`

---

### 5. Recommendation
| Attribute   | Type   |
|-------------|--------|
| priority    | number |
| title       | string |
| description | string |
| category    | string |

---

### 6. PositioningRewrite
| Attribute | Type   |
|-----------|--------|
| safe      | string |
| bold      | string |

---

### 7. LevelAssessment
| Attribute | Type   |
|-----------|--------|
| apparent  | string |
| matches   | string |
| advice    | string |

---

## Object Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   ┌──────────┐                                                  │
│   │   User   │                                                  │
│   │──────────│                                                  │
│   │ id       │                                                  │
│   │ email    │                                                  │
│   │ name     │                                                  │
│   └────┬─────┘                                                  │
│        │ 1:N                                                    │
│        ▼                                                        │
│   ┌──────────────┐                                              │
│   │    Review     │                                             │
│   │──────────────│                                              │
│   │ id           │                                              │
│   │ name         │                                              │
│   │ date         │                                              │
│   │ overall      │                                              │
│   │ focus        │                                              │
│   │ summary      │                                              │
│   │ strengths[]  │                                              │
│   │ improvements[]│                                             │
│   │ criticalGaps[]│                                             │
│   └──┬───┬───┬───┘                                              │
│      │   │   │                                                  │
│      │   │   └──────────────────┐                               │
│      │   │                      │                               │
│      ▼   ▼                      ▼                               │
│  ┌────────┐  ┌──────────┐  ┌────────────────┐                  │
│  │ Scores │  │  Page[]  │  │Recommendation[]│                  │
│  │────────│  │──────────│  │────────────────│                  │
│  │ 9 dims │  │ name     │  │ priority       │                  │
│  │ 0–10   │  │ score    │  │ title          │                  │
│  └────────┘  │ feedback[]│  │ description    │                  │
│              └──────────┘  │ category       │                  │
│                            └────────────────┘                  │
│                                                                 │
│   Optional:                                                     │
│   ┌───────────────────┐  ┌─────────────────┐                   │
│   │PositioningRewrite │  │ LevelAssessment │                   │
│   │───────────────────│  │─────────────────│                   │
│   │ safe              │  │ apparent        │                   │
│   │ bold              │  │ matches         │                   │
│   └───────────────────┘  │ advice          │                   │
│                          └─────────────────┘                   │
└─────────────────────────────────────────────────────────────────┘
```
