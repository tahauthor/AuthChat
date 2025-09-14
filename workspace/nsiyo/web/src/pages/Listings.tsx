import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'

export default function ListingsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['listings'],
    queryFn: async () => (await api.get('/api/listings')).data,
  })

  if (isLoading) return <div className="p-6">Chargement...</div>
  if (error) return <div className="p-6 text-red-600">Erreur de chargement</div>

  return (
    <div className="p-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data.items?.map((it: any) => (
        <article key={it._id} className="border rounded p-3">
          <h3 className="font-semibold">{it.title}</h3>
          <p className="text-slate-600 line-clamp-2">{it.description}</p>
          <p className="mt-2 text-sm">{it.address?.city || ''}</p>
          <p className="mt-1 font-medium">{it.price?.amount} {it.price?.currency} / {it.price?.per}</p>
        </article>
      ))}
    </div>
  )
}

