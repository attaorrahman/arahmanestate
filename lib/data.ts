// SERVER ONLY — Supabase-backed data layer. Do not import from client components.
import { supabaseServer } from './supabase-server';

export async function readTable<T>(table: string, orderBy?: string, ascending?: boolean): Promise<T[]> {
  let query = supabaseServer.from(table).select('*');
  if (orderBy) {
    query = query.order(orderBy, { ascending: ascending ?? false });
  }
  const { data, error } = await query;
  if (error) throw new Error(`Failed to read ${table}: ${error.message}`);
  return (data ?? []) as T[];
}

export async function insertRow<T>(table: string, row: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabaseServer.from(table).insert(row).select().single();
  if (error) throw new Error(`Failed to insert into ${table}: ${error.message}`);
  return data as T;
}

export async function updateRow<T>(table: string, id: string, updates: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabaseServer.from(table).update(updates).eq('id', id).select().single();
  if (error) throw new Error(`Failed to update ${table}: ${error.message}`);
  return data as T;
}

export async function deleteRow(table: string, id: string): Promise<void> {
  const { error } = await supabaseServer.from(table).delete().eq('id', id);
  if (error) throw new Error(`Failed to delete from ${table}: ${error.message}`);
}
