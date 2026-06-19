import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const menuItems = [
  { label: 'Dashboard', path: '/dashboard', permission: null },
  { label: 'Alunos', path: '/alunos', permission: 'READ_ALUNO' },
  { label: 'Oficinas', path: '/oficinas', permission: 'READ_OFICINA' },
  { label: 'Encontros', path: '/encontros', permission: 'READ_ENCONTRO' },
  { label: 'Matrículas', path: '/matriculas', permission: 'READ_MATRICULA' },
  { label: 'Frequências', path: '/frequencias', permission: 'READ_FREQUENCIA' },
  { label: 'Certificados', path: '/certificados', permission: 'READ_CERTIFICADO' },
  { label: 'Usuários', path: '/usuarios', permission: 'READ_USUARIO' },
  { label: 'Roles', path: '/roles', permission: 'READ_ROLE' },
]

export default function Sidebar() {
  const { hasPermission } = useAuth()
  const visible = menuItems.filter((i) => i.permission === null || hasPermission(i.permission))

  return (
    <aside className="fixed top-0 left-0 h-full w-64 flex flex-col z-30" style={{ backgroundColor: '#1e3a5f' }}>
      <div className="px-6 py-5 border-b border-white/10">
        <p className="text-white font-bold text-sm">ELLP</p>
        <p className="text-white/50 text-xs">Oficina Manager</p>
      </div>
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-0.5">
          {visible.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'bg-white/15 text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}