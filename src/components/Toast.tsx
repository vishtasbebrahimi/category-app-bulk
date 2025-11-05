import { create } from 'zustand'
import { CheckCircle2, AlertTriangle, XCircle, X } from 'lucide-react'
type ToastItem = { id: string, type: 'success'|'warning'|'error', message: string }
type ToastStore = { toasts: ToastItem[], pushToast: (t: Omit<ToastItem,'id'>) => void, removeToast: (id: string) => void }
export const useToast = create<ToastStore>((set) => ({
  toasts: [],
  pushToast: (t) => set(s => ({ toasts: [...s.toasts, { ...t, id: Math.random().toString(36).slice(2) }] })),
  removeToast: (id) => set(s => ({ toasts: s.toasts.filter(x => x.id !== id) })),
}))
export function Toast({ toasts, onClose }:{ toasts: ToastItem[], onClose: (id:string)=>void }) {
  const icon = (t: ToastItem) => t.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> :
    t.type === 'warning' ? <AlertTriangle className="w-5 h-5 text-amber-600" /> :
    <XCircle className="w-5 h-5 text-red-600" />
  return (<div className="fixed left-4 bottom-4 space-y-2 z-50">
    {toasts.map(t => (<div key={t.id} className="card px-3 py-2 flex items-start gap-2 min-w-64">{icon(t)}<div className="text-sm">{t.message}</div>
      <button className="ml-auto text-slate-500 hover:text-slate-700" onClick={() => onClose(t.id)}><X className="w-4 h-4" /></button></div>))}
  </div>)
}
