import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { label: 'Dashboard',  path: '/admin/dashboard',  dot: '#6366f1' },
  { label: 'Projects',   path: '/admin/projects',   dot: '#06b6d4' },
  { label: 'Skills',     path: '/admin/skills',     dot: '#a855f7' },
  { label: 'Experience', path: '/admin/experience', dot: '#10b981' },
  { label: 'Education',  path: '/admin/education',  dot: '#f59e0b' },
  { label: 'Messages',   path: '/admin/messages',   dot: '#ec4899' },
]

function AdminLayout() {
  const { username, logout } = useAuth()
  const navigate             = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">

      {/* Sidebar */}
      <aside className="w-52 flex-shrink-0 border-r border-white/[0.06] flex flex-col">

        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/[0.06]">
          <div className="text-indigo-400 font-bold text-lg">
            Admin <span className="text-cyan-400">Panel</span>
          </div>
          <div className="text-white/20 text-xs mt-0.5">Portfolio CMS</div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                transition-all duration-200
                ${isActive
                  ? 'bg-indigo-500/10 border border-indigo-500/30 text-indigo-300'
                  : 'text-white/40 hover:text-white/70 hover:bg-white/[0.03]'
                }
              `}
            >
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: item.dot }}
              />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User info + logout */}
        <div className="p-4 border-t border-white/[0.06]">
          <div className="text-white/20 text-xs mb-0.5">Logged in as</div>
          <div className="text-white/60 text-sm mb-3">{username}</div>
          <button
            onClick={handleLogout}
            className="w-full text-xs border border-red-500/30 text-red-400 py-2 rounded-lg hover:bg-red-500/10 transition-all duration-300"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <main className="flex-1 overflow-auto p-8">
        <Outlet />
      </main>

    </div>
  )
}

export default AdminLayout