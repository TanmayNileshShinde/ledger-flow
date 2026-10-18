# System Architecture — LedgerFlow

This document details the multi-workspace financial data partitioning, Firestore real-time listener architecture, and financial projection engine.

## Architecture Overview

```text
[ Client (React 18 + Vite) ]
        |
        +---> [ Firebase Auth (Google OAuth 2.0) ]
        |
        +---> [ Cloud Firestore (NoSQL) ]
                   |
                   +--- /users/{userId}/workspaces/
                   |          |
                   |          +--- /installments/
                   |          +--- /milestones/
                   |
        +---> [ Reactive Aggregate Calculator Engine ]
                   |
                   +---> [ Chart.js Canvas Renderers ]
```

### Invariants
1. **Multi-Tenant Isolation:** All document reads and mutations enforce `request.auth.uid == resource.data.userId` via Firestore Security Rules.
2. **Deterministic Financial Math:** Clamping routines ensure round-off errors never accumulate across compound installments.
