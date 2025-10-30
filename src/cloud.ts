import { supabase } from "./supabaseClient";

/** Email magic-link sign-in */
export async function signIn(email: string) {
  const { error } = await supabase.auth.signInWithOtp({ email });
  if (error) throw error;
}
export async function signOut() {
  await supabase.auth.signOut();
}
export async function getUser() {
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

/** Create-or-get one “default” record for this user */
export async function ensureUserRanking(userId: string) {
  // Try to find existing record
  const { data: existing } = await supabase
    .from('user_rankings')
    .select('id')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existing) return existing.id;

  // Otherwise create a blank one
  const { data, error } = await supabase
    .from('user_rankings')
    .insert({
      user_id: userId,
      title: 'My Dental Ranking',
      data: { schools: [], criteria: [], weights: {}, rainbowMode: true }
    })
    .select('id')
    .single();

  if (error) throw error;
  return data.id;
}

/** Load/save JSON blob */
export async function loadData(id: string) {
  const { data } = await supabase
    .from('user_rankings')
    .select('data')
    .eq('id', id)
    .single();
  return (data?.data ?? null) as any;
}

export async function saveData(id: string, payload: any) {
  const { error } = await supabase
    .from('user_rankings')
    .update({ data: payload, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
}

