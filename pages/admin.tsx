import { useEffect, useState } from 'react'

interface Booking {
  id: string
  customerName: string
  service: string
  date: string
  time: string
  status: string
}

const dummyBookings: Booking[] = [
  {
    id: '1',
    customerName: 'Jane Doe',
    service: 'Massage',
    date: '2025-04-17',
    time: '2:00 PM',
    status: 'Confirmed',
  },
  {
    id: '2',
    customerName: 'John Smith',
    service: 'Surf Lesson',
    date: '2025-04-18',
    time: '10:00 AM',
    status: 'Pending',
  },
]

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([])

  useEffect(() => {
    // For now, we'll just load dummy data
    // Later, replace this with an API call to your backend
    setBookings(dummyBookings)
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

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
