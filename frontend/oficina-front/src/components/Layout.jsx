import Sidebar from './Sidebar'
import Navbar from './Navbar'

export default function Layout({ children, title }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f4f6f9' }}>
      <Sidebar />
      <Navbar title={title} />
      <main className="ml-64 pt-14">
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}