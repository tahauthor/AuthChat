import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import LoginPage from './pages/Login'
import ListingsModerationPage from './pages/ListingsModeration'
import './App.css'

function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Admin - N'SIYO</h1>
      <p className="text-slate-600 mt-2">Tableau de bord</p>
    </div>
  )
}

function UsersPage() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold">Utilisateurs</h2>
      <p className="text-slate-600 mt-2">Modération à venir...</p>
    </div>
  )
}

function ListingsPage() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold">Annonces</h2>
      <p className="text-slate-600 mt-2">Modération à venir...</p>
    </div>
  )
}

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <header className="border-b">
          <nav className="max-w-5xl mx-auto flex items-center gap-6 p-4">
            <Link className="font-semibold" to="/">Dashboard</Link>
            <Link to="/users">Utilisateurs</Link>
            <Link to="/listings">Annonces</Link>
            <div className="ml-auto">
              <Link to="/login">Connexion</Link>
            </div>
          </nav>
        </header>
        <main className="max-w-5xl mx-auto">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/listings" element={<ListingsModerationPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </main>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
