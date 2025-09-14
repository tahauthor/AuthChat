import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../store/auth'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register, loading } = useAuth()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'owner' | 'tenant'>('tenant')
  const [error, setError] = useState('')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    try {
      await register(fullName, email, password, role)
      navigate('/')
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erreur d'inscription")
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Inscription</h1>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full border rounded p-2" placeholder="Nom complet" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        <input className="w-full border rounded p-2" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full border rounded p-2" placeholder="Mot de passe" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <select className="w-full border rounded p-2" value={role} onChange={(e) => setRole(e.target.value as 'owner' | 'tenant')}>
          <option value="tenant">Locataire</option>
          <option value="owner">Propriétaire</option>
        </select>
        <button disabled={loading} className="w-full bg-sky-600 text-white rounded p-2">{loading ? '...' : "S'inscrire"}</button>
      </form>
    </div>
  )
}

