import { ReplitConnectors } from "@replit/connectors-sdk";

const connectors = new ReplitConnectors();

type SupabaseRequestInit = {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
};

export async function supabaseProxy(
  path: string,
  init?: SupabaseRequestInit,
): Promise<Response> {
  return connectors.proxy("supabase", path, init);
}