import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'

export default function ListingsModerationPage() {
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['admin-listings'],
    queryFn: async () => (await api.get('/api/admin/listings')).data,
  })

  const mutateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) =>
      (await api.patch(`/api/admin/listings/${id}/status`, { status })).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-listings'] }),
  })

  if (isLoading) return <div className="p-6">Chargement...</div>
  return (
    <div className="p-6 space-y-3">
      <h1 className="text-2xl font-semibold">Modération des annonces</h1>
      <div className="grid gap-3">
        {data.items?.map((it: any) => (
          <div key={it._id} className="border rounded p-3 flex items-center gap-3">
            <div className="flex-1">
              <div className="font-semibold">{it.title}</div>
              <div className="text-sm text-slate-600">{it.status}</div>
            </div>
            <button className="px-3 py-1 rounded border" onClick={() => mutateStatus.mutate({ id: it._id, status: 'active' })}>Publier</button>
            <button className="px-3 py-1 rounded border" onClick={() => mutateStatus.mutate({ id: it._id, status: 'inactive' })}>Masquer</button>
          </div>
        ))}
      </div>
    </div>
  )
}

