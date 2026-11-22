# Security Specification — PyPath Firestore Rules

## Data Invariants
1. Every document under `/users/{userId}` and its subcollections (`notes`, `submissions`, `roadmaps`) is strictly private to the verified authenticated owner (`request.auth.uid == userId && request.auth.token.email_verified == true`).
2. No subcollection record (`notes`, `submissions`, `roadmaps`) can be created unless the parent `/users/{userId}` document exists (Master Gate).
3. All document IDs (`userId`, `noteId`, `problemId`, `roadmapId`) must match `^[a-zA-Z0-9_\-]+$` and stay within 128 characters.
4. No PII (email, phone, physical address) is stored in Firestore documents.
5. `userId` and `createdAt` are immutable after creation; `createdAt` and `updatedAt` must equal `request.time`.
6. Every string and list enforces explicit upper bounds matching `firebase-blueprint.json`.

## Dirty Dozen Adversarial Payloads (Must All Be Denied)
1. **Cross-User Read**: User B attempts `get` on `/users/userA`.
2. **Unverified Email Write**: Authenticated user with `email_verified: false` creates `/users/{uid}`.
3. **Identity Spoofing on Create**: User A writes `/users/userA/notes/n1` with `userId: "userB"`.
4. **Shadow Field Injection**: User A updates `/users/userA` injecting `{ isAdmin: true }`.
5. **Orphaned Subcollection Write**: User A creates `/users/userA/notes/n1` before `/users/userA` exists.
6. **Immutable Timestamp Tampering**: User A updates `/users/userA/notes/n1` changing `createdAt`.
7. **Client Clock Forgery**: User A creates `/users/userA` with a client timestamp `updatedAt != request.time`.
8. **ID Poisoning**: User A writes `/users/userA/notes/invalid$$id` or a 200-char ID.
9. **Oversized Note Content**: User A writes a 5,000-character note (`> 4000` maxLength).
10. **Unbounded Array Abuse**: User A writes 35 items into `completedModuleIds` (`> 30` max).
11. **Invalid Theme Enum**: User A updates `/users/userA` setting `theme: "neon-pink"`.
12. **Cross-User List Scraping**: User B queries `list` on `/users/userA/notes`.
