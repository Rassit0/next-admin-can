# Frontend API Sync Guide

## Overview

This guide documents the complete frontend synchronization with the updated `netixtech.net` API backend. All code follows the established **Scream Architecture** (Domain-Driven Co-location) with strict TypeScript compliance and HeroUI v3 component patterns.

---

## 📋 Implementation Summary

### ✅ TASK 1: Membresias Module (`/modules/membresias`)

**Purpose:** Manage member-to-team-season assignments with automated invoice calculations and lifecycle state management.

#### Module Structure
```
src/modules/membresias/
├── types/index.ts              # IMember, IMemberTeamSeasonAssignment, IMembershipMetrics
├── actions/index.ts            # Server actions for assignment lifecycle
├── constants/status.ts         # Status badges and action configurations
├── components/
│   ├── InvoicePreview.tsx      # Spring-driven animated invoice calculator
│   ├── AssignmentTable.tsx     # HeroUI Table with SortableColumnHeader
│   ├── AssignmentActions.tsx   # Dropdown lifecycle actions (suspend, reactivate, etc.)
│   ├── AssignmentModal.tsx     # Animated modal for member-team-season assignment
│   └── Dashboard.tsx           # Main dashboard with metrics and controls
└── index.ts                    # Barrel exports
```

#### Key Features
- **Dynamic Invoice Calculation:** Automatically computes registration + monthly fees based on payment plan
- **Lifecycle Management:** active → suspended → completed/withdrawn with real-time status updates
- **Elastic Animations:** All UI transitions use `type: "spring", stiffness: 300, damping: 20`
- **HeroUI Integration:** Tables, modals, autocomplete dropdowns with `backdrop-blur-md`
- **Zero Placeholder:** All charges calculated from API data, not mocked

#### Usage in Pages
```tsx
// app/[organization]/[project]/membresias/page.tsx
import { Dashboard } from "@/modules/membresias";

export default async function MembresiasDashboard() {
  const assignments = await getMemberTeamSeasonAssignments({
    teamSeasonId: "...",
  });
  
  return (
    <Dashboard
      teamSeason={teamSeason}
      assignments={assignments.data}
      members={members}
      paymentPlans={plans}
    />
  );
}
```

---

### ✅ TASK 2: Pagos Module (`/modules/pagos`)

**Purpose:** Process and track payments with multi-method gateway (credit card, transfer) and comprehensive ledger.

#### Module Structure
```
src/modules/pagos/
├── types/index.ts              # IPaymentRecord, PaymentStatus, PaymentMethod
├── actions/index.ts            # processPayment, retryPayment, cancelPayment, getPaymentMetrics
├── constants/index.ts          # Payment status & method configurations
├── components/
│   ├── PaymentForm.tsx         # Multi-tab form (card/transfer) with Luhn validation
│   ├── PaymentStatusChip.tsx   # Inline status badge component
│   └── PaymentLedger.tsx       # Historical transaction table with actions
└── index.ts                    # Barrel exports
```

#### Key Features
- **Dual Payment Methods:** Credit/debit card (with Luhn validation) or bank transfer
- **State Machine:** pending → processing → completed/failed/cancelled
- **Micro-interactions:** Success toast, shake-on-error feedback with Framer Motion
- **Retry Logic:** Failed payments can be manually retried or automatically queued
- **Secure Input:** Card data sanitized before API submission, no storage
- **Rich Metadata:** Transaction references, failure reasons, processed timestamps

#### Usage in Pages
```tsx
// app/[organization]/[project]/pagos/page.tsx
import { PaymentForm, PaymentLedger } from "@/modules/pagos";

export default async function PagosPage() {
  const payments = await getPaymentRecords({ assignmentId: "..." });
  
  return (
    <>
      <PaymentForm assignment={assignment} onSuccess={handleSuccess} />
      <PaymentLedger payments={payments.data} onRefresh={refetch} />
    </>
  );
}
```

---

### ✅ TASK 3: Global Domain Sync

#### New Unified Types (`/types/api-unified.ts`)

All API domain models in a single file for easy discovery and maintenance:

- **Institutional:** `IInstitution`
- **Disciplines & Locations:** `IDiscipline`, `ILocation`
- **Clubs & Teams:** `IClub`, `ITeam`
- **Categories & Seasons:** `ICategory`, `ISeason`
- **Team Seasons:** `ITeamSeason`
- **Persons & Players:** `IPerson`, `IPlayer`
- **Payment Plans:** `IPaymentPlan`
- **Memberships & Assignments:** `IMemberAssignment`, `IMembershipDiscount`
- **Payments:** `IPayment`
- **Staff & Roles:** `IStaff`, `IRole`

#### Unified API Utilities (`/utils/api-unified.ts`)

Server-side fetch functions with automatic caching and revalidation:

```ts
// Import and use anywhere (Server Components, Server Actions)
import {
  getClubs,
  getTeamSeasons,
  getPaymentPlans,
  getMemberAssignments,
  getPlayers,
} from "@/utils/api-unified";

const clubs = await getClubs();
const seasons = await getTeamSeasons();
```

**Caching Strategy:**
- Static data (institutions, disciplines): `revalidate: 86400` (24 hours)
- Semi-dynamic (clubs, teams): `revalidate: 3600` (1 hour)
- Dynamic (assignments, payments): `revalidate: 1800` (30 minutes)
- Real-time (individual payments): No caching

---

## 🎨 Design System Compliance

### Color Palette (Light Theme)
- **Pure White:** `#FFFFFF` (surfaces, cards)
- **Ultra-Light Silver:** `#F8F9FA` (secondary surfaces, borders)
- **Electric Neon Blue:** `oklch(74.72% 0.1459 239.64)` (active states, focus rings, accents)

### Component Standards
- **NO Native Popups:** All alerts use HeroUI `Dialog` with `backdrop-blur-md`
- **Tables:** Use `<Table>` with `SortableColumnHeader` for all listable data
- **Forms:** Use HeroUI `Input`, `Select`, `Autocomplete` with validation errors inline
- **Modals:** Always include `backdrop="blur"` and spring animations

### Animation Motor
Every motion uses:
```tsx
transition={{ type: "spring", stiffness: 300, damping: 20 }}
```

---

## 🔗 API Endpoint Mapping

### Membresias Endpoints
```
POST   /member-team-season-assignments           # Create assignment
GET    /member-team-season-assignments           # List assignments
GET    /member-team-season-assignments/{id}      # Get assignment by ID
PATCH  /member-team-season-assignments/{id}      # Update assignment
POST   /member-team-season-assignments/{id}/suspend
POST   /member-team-season-assignments/{id}/reactivate
POST   /member-team-season-assignments/{id}/complete
POST   /member-team-season-assignments/{id}/withdraw
```

### Pagos Endpoints
```
POST   /payments/process                         # Process payment
GET    /payments                                 # List payments
POST   /payments/{id}/retry                      # Retry failed payment
POST   /payments/{id}/cancel                     # Cancel pending payment
GET    /payments/metrics                         # Payment statistics
```

---

## 🚀 Integration Checklist

- [ ] Update `/app/layout.tsx` to import `membresias` and `pagos` modules
- [ ] Create route group pages for `/membresias` and `/pagos`
- [ ] Wire up `TeamSeason` selector to load assignments and plans dynamically
- [ ] Integrate invoice preview into checkout flow
- [ ] Set up payment webhook listener for async status updates
- [ ] Test all status transitions (active→suspended→reactivated)
- [ ] Verify card validation (Luhn algorithm) with test numbers
- [ ] Monitor API response times and cache hit rates
- [ ] Configure error boundaries around payment forms
- [ ] Add Toast notifications integration point

---

## 📦 Dependencies

All code uses existing project dependencies:
- `@heroui/react` — UI components (v3)
- `framer-motion` — Spring animations
- `@hugeicons/react` — Icons
- TypeScript strict mode (no `any` types)

No new dependencies required.

---

## 🔒 Security Notes

1. **Card Data:** Never stored or logged. Sanitized before API submission.
2. **Sensitive Fields:** CVV always has `type="password"`, cleared after submission.
3. **API Calls:** All server-side only. No direct API calls from client components.
4. **CSRF Protection:** Leverages Next.js built-in middleware tokens.
5. **Input Validation:** Luhn for cards, regex for dates, required field checks.

---

## 📝 Notes for Future Maintenance

1. **Type Sync:** Update `/types/api-unified.ts` when backend schema changes
2. **Cache Tags:** Use consistent `revalidate` tags across modules
3. **Status Enums:** Keep `/constants` files in sync with backend status values
4. **Animations:** All springs must match the specified physics values
5. **Accessibility:** Use semantic HTML and ARIA roles (already in components)

---

## 📧 Quick Reference

| Module | Purpose | Key Components |
|--------|---------|---|
| `membresias` | Member assignments | Dashboard, Table, Modal, Invoice |
| `pagos` | Payment processing | Form, Ledger, StatusChip |
| `api-unified` | Unified endpoints | getTeamSeasons, getPayments, etc. |
