import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import LoginPage from './pages/Login'
import RegisterPage from './pages/Register'
import ListingsPage from './pages/Listings'
import CreateListingPage from './pages/CreateListing'
import './App.css'

function HomePage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">N'SIYO LOCATION</h1>
      <p className="text-slate-600 mt-2">Trouvez et publiez des locations en Côte d'Ivoire</p>
    </div>
  )
}

function ListingsPage() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold">Annonces</h2>
      <p className="text-slate-600 mt-2">Bientôt disponible...</p>
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
            <Link className="font-semibold" to="/">Accueil</Link>
            <Link to="/listings">Annonces</Link>
            <div className="ml-auto flex gap-4">
              <Link to="/login">Connexion</Link>
              <Link to="/register">Inscription</Link>
              <Link className="bg-sky-600 text-white px-3 py-1 rounded" to="/create-listing">Publier</Link>
            </div>
          </nav>
        </header>
        <main className="max-w-5xl mx-auto">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/listings" element={<ListingsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/create-listing" element={<CreateListingPage />} />
          </Routes>
        </main>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
