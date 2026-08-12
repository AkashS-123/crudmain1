# The Daily Dispatch — Fetch API + CRUD Mini Project

Task 4: a React + Vite + TypeScript app that performs full **CRUD**
(Create, Read, Update, Delete) against a local mock REST API, styled as a
newspaper-style "dispatch" board.

## What it does

- **Read** — fetches all posts from a local [json-server](https://github.com/typicode/json-server)
  mock API using the native **Fetch API**.
- **Create** — files a new dispatch via a form (`POST`).
- **Update** — edits an existing dispatch in place (`PUT`).
- **Delete** — removes a dispatch permanently (`DELETE`), with a per-card
  "Removing..." state while the request is in flight.
- Shows a **loading** message while the initial fetch is in flight.
- Shows a **friendly error message with a retry button** if a request fails,
  using `try...catch` throughout.

## Tech stack

- React 19 + TypeScript
- Vite
- [json-server](https://github.com/typicode/json-server) — a real mock REST API backed by `db.json`
- Plain CSS (custom design tokens, no framework)

## Project structure

```
db.json                      # json-server's mock database
src/
├── api/
│   └── posts.ts             # fetchPosts / createPost / updatePost / deletePost
├── components/
│   ├── Header.tsx            # Masthead / page title
│   ├── PostForm.tsx           # Create + edit form (shared)
│   ├── PostCard.tsx            # Single post, with Edit / Delete actions
│   ├── PostList.tsx             # Grid of PostCard
│   └── StatusMessage.tsx        # Loading / error UI
├── types/
│   └── post.ts                  # Post interface
├── App.tsx                      # Orchestrates all CRUD state
├── App.css                      # Component styles
└── index.css                    # Design tokens, fonts, global resets
```

## How each operation is implemented

```ts
// src/api/posts.ts
export async function fetchPosts(): Promise<Post[]> {
  const response = await fetch(`${BASE_URL}/posts`);
  return handleResponse<Post[]>(response);
}

export async function createPost(post: NewPost): Promise<Post> {
  const response = await fetch(`${BASE_URL}/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post),
  });
  return handleResponse<Post>(response);
}

export async function updatePost(id: string, post: NewPost): Promise<Post> {
  const response = await fetch(`${BASE_URL}/posts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post),
  });
  return handleResponse<Post>(response);
}

export async function deletePost(id: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/posts/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
}
```

Every call site in `App.tsx` wraps its API call in `try...catch` and updates
local state optimistically on success (no full refetch needed):

```tsx
const handleDelete = async (id: string) => {
  setDeletingId(id);
  try {
    await deletePost(id);
    setPosts((prev) => prev.filter((p) => p.id !== id));
  } catch (error) {
    setActionError(error instanceof Error ? error.message : "Could not delete that dispatch.");
  } finally {
    setDeletingId(null);
  }
};
```

## Getting started

This project needs **two servers**: the mock API (json-server) and the Vite
dev server. The easiest way is to run both together:

```bash
npm install
npm start          # runs json-server (port 3001) and Vite (port 5173) together
```

Or run them separately in two terminals:

```bash
npm run server      # json-server on http://localhost:3001
npm run dev          # Vite dev server on http://localhost:5173
```

Other scripts:

```bash
npm run build       # production build (also runs the TypeScript check)
npm run preview      # preview the production build locally
```

> Note: `npm run build` only builds the React app. The mock API
> (`json-server`) still needs to be running (`npm run server`) for the app
> to have data to fetch — this mirrors how a real frontend talks to a real
> backend. For a production deployment you'd point `BASE_URL` in
> `src/api/posts.ts` at a real hosted API instead of `localhost:3001`.

## Notes for review

- `db.json` is the "database" — editing it directly (or watching it while
  the app is running) shows how json-server persists changes to disk.
- json-server generates its own random string IDs on `POST`, so `Post.id`
  is typed as `string`, and the UI shows a short "Ref." code instead of a
  sequential number.
- State is modeled with a single `status` union (`loading | success | error`)
  for the initial load, instead of separate booleans, to avoid impossible
  in-between states. Create/Update/Delete have their own lightweight
  `submitting` / `deletingId` / `actionError` state so they don't disturb
  the main list view.
- `PostForm` is reused for both **Create** and **Update** — passing an
  `editingPost` prop switches its label and submit behavior.
