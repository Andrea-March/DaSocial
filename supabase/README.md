# Supabase setup

This folder documents the database structure used by **DaSocial**.

It is **not** a full database dump.  
The files here are meant to explain and reproduce the schema, policies and logic
in a new Supabase project.

---

## Structure

supabase/
├─ schema.sql # Tables, indexes and full-text search (TSV)
├─ functions.sql # RPC functions, triggers and helpers
├─ policies.sql # Row Level Security (RLS) policies
├─ storage.sql # Storage buckets
└─ README.md


> ⚠️ Some functions rely on `auth.uid()`  
> Make sure authentication is enabled in your Supabase project.

---

## Notes on design choices

### Row Level Security (RLS)
All tables are protected by RLS.

General principles:
- Public read for posts, comments, broadcasts and market items
- Insert / update / delete only allowed to the owning user
- Broadcast creation and moderation restricted to admins or representatives

---

### Storage
Storage buckets are **public** to allow simple image access from the frontend.

Security is enforced through RLS policies on `storage.objects`:
- Anyone can read images
- Only authenticated users can upload
- Users can update or delete only their own files

Buckets used:
- `avatars`
- `posts`
- `broadcasts`
- `market_books`
- `market_items`

---

### Full-text search
`market_books` and `market_items` include a `tsv` column with:
- GIN index
- automatic updates via triggers
- Italian language dictionary

This allows fast and efficient full-text search.

---

## Important

This folder does **not** include:
- API keys
- secrets
- real user data
- migrations tied to a specific Supabase project

You are expected to create your own Supabase project when running DaSocial locally.

---

## License

The database schema and SQL files follow the same MIT license
as the rest of the project.
