import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from './supabaseClient'

export function useUser(protectedRoute = true) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession()
      const session = data.session
      setUser(session?.user || null)
      setLoading(false)

      if (protectedRoute && !session?.user) {
        router.push('/login')
      }
    }

    getSession()
  }, [protectedRoute, router])

  return { user, loading }
}
