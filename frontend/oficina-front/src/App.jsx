import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AccessDenied from './pages/AccessDenied'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import AlunoList from './pages/alunos/AlunoList'
import AlunoForm from './pages/alunos/AlunoForm'
import OficinaList from './pages/oficinas/OficinaList'
import OficinaForm from './pages/oficinas/OficinaForm'
import EncontroList from './pages/encontros/EncontroList.jsx'
import EncontroForm from './pages/encontros/EncontroForm'
import MatriculaList from './pages/matriculas/MatriculaList'
import MatriculaForm from './pages/matriculas/MatriculaForm'
import FrequenciaList from './pages/frequencias/FrequenciaList'
import FrequenciaForm from './pages/frequencias/FrequenciaForm'
import UsuarioList from './pages/usuarios/UsuarioList'
import UsuarioForm from './pages/usuarios/UsuarioForm'
import RoleList from './pages/roles/RoleList'
import RoleForm from './pages/roles/RoleForm'
import CertificadoList from './pages/certificados/CertificadoList'
import CertificadoForm from './pages/certificados/CertificadoForm'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/acesso-negado" element={<AccessDenied />} />

          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

          <Route path="/alunos" element={<ProtectedRoute permission="READ_ALUNO"><AlunoList /></ProtectedRoute>} />
          <Route path="/alunos/novo" element={<ProtectedRoute permission="CREATE_ALUNO"><AlunoForm /></ProtectedRoute>} />
          <Route path="/alunos/:id/editar" element={<ProtectedRoute permission="UPDATE_ALUNO"><AlunoForm /></ProtectedRoute>} />

          <Route path="/oficinas" element={<ProtectedRoute permission="READ_OFICINA"><OficinaList /></ProtectedRoute>} />
          <Route path="/oficinas/novo" element={<ProtectedRoute permission="CREATE_OFICINA"><OficinaForm /></ProtectedRoute>} />
          <Route path="/oficinas/:id/editar" element={<ProtectedRoute permission="UPDATE_OFICINA"><OficinaForm /></ProtectedRoute>} />

          <Route path="/encontros" element={<ProtectedRoute permission="READ_ENCONTRO"><EncontroList /></ProtectedRoute>} />
          <Route path="/encontros/novo" element={<ProtectedRoute permission="CREATE_ENCONTRO"><EncontroForm /></ProtectedRoute>} />
          <Route path="/encontros/:id/editar" element={<ProtectedRoute permission="UPDATE_ENCONTRO"><EncontroForm /></ProtectedRoute>} />

          <Route path="/matriculas" element={<ProtectedRoute permission="READ_MATRICULA"><MatriculaList /></ProtectedRoute>} />
          <Route path="/matriculas/novo" element={<ProtectedRoute permission="CREATE_MATRICULA"><MatriculaForm /></ProtectedRoute>} />
          <Route path="/matriculas/:id/editar" element={<ProtectedRoute permission="UPDATE_MATRICULA"><MatriculaForm /></ProtectedRoute>} />

          <Route path="/frequencias" element={<ProtectedRoute permission="READ_FREQUENCIA"><FrequenciaList /></ProtectedRoute>} />
          <Route path="/frequencias/novo" element={<ProtectedRoute permission="CREATE_FREQUENCIA"><FrequenciaForm /></ProtectedRoute>} />
          <Route path="/frequencias/:id/editar" element={<ProtectedRoute permission="UPDATE_FREQUENCIA"><FrequenciaForm /></ProtectedRoute>} />

          <Route path="/usuarios" element={<ProtectedRoute permission="READ_USUARIO"><UsuarioList /></ProtectedRoute>} />
          <Route path="/usuarios/novo" element={<ProtectedRoute permission="CREATE_USUARIO"><UsuarioForm /></ProtectedRoute>} />
          <Route path="/usuarios/:id/editar" element={<ProtectedRoute permission="UPDATE_USUARIO"><UsuarioForm /></ProtectedRoute>} />

          <Route path="/roles" element={<ProtectedRoute permission="READ_ROLE"><RoleList /></ProtectedRoute>} />
          <Route path="/roles/novo" element={<ProtectedRoute permission="CREATE_ROLE"><RoleForm /></ProtectedRoute>} />
          <Route path="/roles/:id/editar" element={<ProtectedRoute permission="UPDATE_ROLE"><RoleForm /></ProtectedRoute>} />

          <Route path="/certificados" element={<ProtectedRoute permission="READ_CERTIFICADO"><CertificadoList /></ProtectedRoute>} />
          <Route path="/certificados/novo" element={<ProtectedRoute permission="CREATE_CERTIFICADO"><CertificadoForm /></ProtectedRoute>} />
          <Route path="/certificados/:id/editar" element={<ProtectedRoute permission="UPDATE_CERTIFICADO"><CertificadoForm /></ProtectedRoute>} />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}