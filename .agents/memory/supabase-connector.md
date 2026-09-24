---
name: Supabase connector access
description: The connected Supabase project uses the authenticated connector proxy and may expose only anon-key PostgREST access.
---

The Supabase connector should be called through the authenticated proxy rather than embedding project keys. PostgREST table reads and writes depend on the project's RLS policies; the root schema endpoint may require a service-role key and is not a reliable availability check.

**Why:** An attached Supabase connection can still return an API-key error for schema discovery when its credential is anon-scoped, while permitted table endpoints remain usable.

**How to apply:** Target known tables through the connector proxy, handle RLS/permission errors explicitly, and define the required tables and policies in Supabase before relying on writes in production.