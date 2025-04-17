import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useUser } from '../lib/useUser'
import { signOut } from '../lib/authClient'

interface Booking {
  id: string
  customerName: string
  service: string
  date: string
  time: string
  status: string
}

export default function AdminDashboard() {
  const { user, loading } = useUser()
  const [bookings, setBookings] = useState<Booking[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('date', { ascending: false })

      if (error) {
        console.error('Supabase fetch error:', error.message)
        return
      }

      if (data) {
        const formatted = data.map((record) => {
          const dateObj = new Date(`${record.date}T${record.time}`)

          return {
            id: record.id,
            customerName: record.customer_name || '',
            service: record.service || '',
            date: dateObj.toLocaleDateString(),
            time: dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: record.status || '',
          }
        })

        setBookings(formatted)
      }
    }

    fetchData()
  }, [])

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button
          onClick={async () => {
            await signOut()
            window.location.href = '/login'
          }}
          className="text-sm bg-red-500 text-white px-4 py-2 rounded"
        >
          Log Out
        </button>
      </div>

      <p className="text-sm text-gray-500 mb-4">
        Logged in as: {user?.email}
      </p>

      {/* Bookings Table */}
      <table className="min-w-full border border-gray-300 rounded shadow-sm bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-2 border-b">Customer</th>
            <th className="text-left p-2 border-b">Service</th>
            <th className="text-left p-2 border-b">Date</th>
            <th className="text-left p-2 border-b">Time</th>
            <th className="text-left p-2 border-b">Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id} className="hover:bg-gray-50">
              <td className="p-2 border-b">{booking.customerName}</td>
              <td className="p-2 border-b">{booking.service}</td>
              <td className="p-2 border-b">{booking.date}</td>
              <td className="p-2 border-b">{booking.time}</td>
              <td className="p-2 border-b">{booking.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
