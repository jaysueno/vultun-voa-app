export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Login</h1>
      <input type="email" placeholder="Email" className="mb-2 p-2 border rounded" />
      <input type="password" placeholder="Password" className="mb-4 p-2 border rounded" />
      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Sign In
      </button>
    </div>
  )
}
