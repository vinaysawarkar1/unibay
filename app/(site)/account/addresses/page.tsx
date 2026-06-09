'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
  Plus,
  Pencil,
  Trash2,
  Home,
  Star,
  Loader2,
  MapPin,
  X,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type Address = {
  id: string
  label?: string | null
  fullName: string
  phone: string
  line1: string
  line2?: string | null
  city: string
  state?: string | null
  postcode: string
  country: string
  isDefault: boolean
}

type FormData = Omit<Address, 'id' | 'isDefault'> & { id?: string; isDefault?: boolean }

const EMPTY_FORM: FormData = {
  label: '',
  fullName: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  postcode: '',
  country: 'United Kingdom',
  isDefault: false,
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<FormData | null>(null)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/user/addresses')
      const data = await res.json()
      setAddresses(data.addresses || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  function openCreate() { setEditing({ ...EMPTY_FORM }) }
  function openEdit(a: Address) { setEditing({ ...a }) }
  function closeForm() { setEditing(null) }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!editing) return
    setSaving(true)
    try {
      const method = editing.id ? 'PUT' : 'POST'
      const url = editing.id ? `/api/user/addresses/${editing.id}` : '/api/user/addresses'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Failed to save address')
      } else {
        toast.success(editing.id ? 'Address updated' : 'Address added')
        closeForm()
        await load()
      }
    } catch {
      toast.error('Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this address?')) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/user/addresses/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Address deleted')
        await load()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to delete')
      }
    } finally {
      setDeletingId(null)
    }
  }

  async function handleSetDefault(id: string) {
    try {
      const res = await fetch(`/api/user/addresses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isDefault: true }),
      })
      if (res.ok) {
        toast.success('Default address updated')
        await load()
      }
    } catch { toast.error('Failed to set default') }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold">Your addresses</h2>
          <p className="text-sm text-muted-foreground">Manage delivery addresses for faster checkout.</p>
        </div>
        <Button onClick={openCreate} className="glow-cyan">
          <Plus className="w-4 h-4 mr-2" /> Add new address
        </Button>
      </div>

      {loading ? (
        <Card className="p-8 flex items-center gap-3 text-muted-foreground"><Loader2 className="w-5 h-5 animate-spin" /> Loading…</Card>
      ) : addresses.length === 0 ? (
        <Card className="p-12 text-center">
          <MapPin className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="font-medium mb-1">No saved addresses</p>
          <p className="text-sm text-muted-foreground mb-6">Add an address to speed up checkout next time.</p>
          <Button onClick={openCreate} className="glow-cyan">
            <Plus className="w-4 h-4 mr-2" /> Add your first address
          </Button>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {addresses.map((a) => (
            <Card key={a.id} className={`p-5 relative ${a.isDefault ? 'border-primary/50' : ''}`}>
              {a.isDefault && (
                <span className="absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/20 text-primary">
                  <Star className="w-3 h-3 fill-primary" /> Default
                </span>
              )}
              <div className="flex items-start gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <Home className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  {a.label && <p className="text-xs uppercase tracking-wide text-muted-foreground mb-0.5">{a.label}</p>}
                  <p className="font-semibold">{a.fullName}</p>
                  <p className="text-xs text-muted-foreground">{a.phone}</p>
                </div>
              </div>
              <div className="text-sm text-muted-foreground space-y-0.5 mb-4">
                <p>{a.line1}</p>
                {a.line2 && <p>{a.line2}</p>}
                <p>{a.city}{a.state ? `, ${a.state}` : ''} {a.postcode}</p>
                <p>{a.country}</p>
              </div>
              <div className="flex items-center gap-2 pt-3 border-t border-border">
                <Button variant="ghost" size="sm" onClick={() => openEdit(a)}>
                  <Pencil className="w-3.5 h-3.5 mr-1.5" /> Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(a.id)}
                  disabled={deletingId === a.id}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  {deletingId === a.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete</>}
                </Button>
                {!a.isDefault && (
                  <Button variant="ghost" size="sm" onClick={() => handleSetDefault(a.id)} className="ml-auto">
                    Set as default
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Edit/Create modal */}
      {editing && (
        <AddressFormModal
          form={editing}
          setForm={setEditing}
          saving={saving}
          onSave={handleSave}
          onClose={closeForm}
          isFirst={addresses.length === 0}
        />
      )}
    </div>
  )
}

function AddressFormModal({
  form,
  setForm,
  saving,
  onSave,
  onClose,
  isFirst,
}: {
  form: FormData
  setForm: (f: FormData) => void
  saving: boolean
  onSave: (e: React.FormEvent) => void
  onClose: () => void
  isFirst: boolean
}) {
  const update = (k: keyof FormData, v: any) => setForm({ ...form, [k]: v })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <Card
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <h3 className="text-lg font-bold">{form.id ? 'Edit address' : 'Add new address'}</h3>
            <p className="text-xs text-muted-foreground">UK delivery addresses only.</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="w-4 h-4" /></Button>
        </div>

        <form onSubmit={onSave} className="space-y-4">
          <div>
            <Label htmlFor="label">Label (optional)</Label>
            <Input id="label" value={form.label || ''} onChange={(e) => update('label', e.target.value)} placeholder="Home, Work, etc." className="mt-1.5" />
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="fullName">Full name *</Label>
              <Input id="fullName" value={form.fullName} onChange={(e) => update('fullName', e.target.value)} required className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="phone">Phone *</Label>
              <Input id="phone" type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} required className="mt-1.5" />
            </div>
          </div>

          <div>
            <Label htmlFor="line1">Address line 1 *</Label>
            <Input id="line1" value={form.line1} onChange={(e) => update('line1', e.target.value)} required className="mt-1.5" placeholder="House number and street" />
          </div>
          <div>
            <Label htmlFor="line2">Address line 2</Label>
            <Input id="line2" value={form.line2 || ''} onChange={(e) => update('line2', e.target.value)} className="mt-1.5" placeholder="Apartment, suite, etc." />
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <Label htmlFor="city">Town / city *</Label>
              <Input id="city" value={form.city} onChange={(e) => update('city', e.target.value)} required className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="postcode">Postcode *</Label>
              <Input id="postcode" value={form.postcode} onChange={(e) => update('postcode', e.target.value.toUpperCase())} required className="mt-1.5" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="state">County / state</Label>
              <Input id="state" value={form.state || ''} onChange={(e) => update('state', e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <Input id="country" value={form.country} onChange={(e) => update('country', e.target.value)} className="mt-1.5" />
            </div>
          </div>

          {!isFirst && (
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={!!form.isDefault}
                onChange={(e) => update('isDefault', e.target.checked)}
                className="w-4 h-4"
              />
              Set as default address
            </label>
          )}

          <div className="flex gap-2 pt-4 border-t border-border">
            <Button type="button" variant="ghost" onClick={onClose} className="flex-1">Cancel</Button>
            <Button type="submit" disabled={saving} className="flex-1 glow-cyan">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : (form.id ? 'Save changes' : 'Add address')}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
