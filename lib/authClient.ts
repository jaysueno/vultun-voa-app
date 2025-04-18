import { supabase } from './supabaseClient'
import { signIn } from './auth'

export async function signInWithEmail(email: string, password: string) {
  try {
    const data = await signIn(email, password)
    return { data, error: null }
  } catch (error: any) {
    return { data: null, error }
  }
}

export async function getSession() {
  const { data } = await supabase.auth.getSession()
  return data.session
}

export async function signOut() {
  await supabase.auth.signOut()
}
