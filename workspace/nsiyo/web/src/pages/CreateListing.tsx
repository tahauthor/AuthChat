import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { useAuth } from '../store/auth'

export default function CreateListingPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<'housing' | 'hotel' | 'event_space'>('housing')
  const [propertyType, setPropertyType] = useState('apartment')
  const [city, setCity] = useState('Abidjan')
  const [amount, setAmount] = useState(20000)
  const [per, setPer] = useState<'night' | 'day' | 'hour' | 'event'>('night')
  const [error, setError] = useState('')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    try {
      await api.post('/api/listings', {
        title,
        description,
        category,
        propertyType,
        address: { city },
        price: { amount: Number(amount), currency: 'XOF', per },
      })
      navigate('/listings')
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erreur lors de la création')
    }
  }

  if (!user) {
    return <div className="p-6">Veuillez vous connecter</div>
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Créer une annonce</h1>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full border rounded p-2" placeholder="Titre" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea className="w-full border rounded p-2" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <select className="w-full border rounded p-2" value={category} onChange={(e) => setCategory(e.target.value as any)}>
          <option value="housing">Logement</option>
          <option value="hotel">Hôtel</option>
          <option value="event_space">Salle événementielle</option>
        </select>
        <select className="w-full border rounded p-2" value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
          <option value="apartment">Appartement</option>
          <option value="house">Maison</option>
          <option value="studio">Studio</option>
          <option value="hotel_room">Chambre d'hôtel</option>
          <option value="villa">Villa</option>
          <option value="hall">Salle</option>
          <option value="conference_room">Salle de conférence</option>
          <option value="outdoor">Extérieur</option>
          <option value="other">Autre</option>
        </select>
        <input className="w-full border rounded p-2" placeholder="Ville" value={city} onChange={(e) => setCity(e.target.value)} />
        <div className="flex gap-2">
          <input className="w-full border rounded p-2" type="number" placeholder="Prix" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
          <select className="border rounded p-2" value={per} onChange={(e) => setPer(e.target.value as any)}>
            <option value="night">nuit</option>
            <option value="day">jour</option>
            <option value="hour">heure</option>
            <option value="event">événement</option>
          </select>
        </div>
        <button className="w-full bg-sky-600 text-white rounded p-2">Publier</button>
      </form>
    </div>
  )
}

