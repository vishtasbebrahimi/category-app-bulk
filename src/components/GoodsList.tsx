import { useMemo, useState } from 'react'
import { NodeMap, TreeNode, TreeRoots, buildTree, findPathToRoot, isLeaf } from '../lib/tree'
import * as XLSX from 'xlsx-js-style'
import { Download, RefreshCw, CheckCircle2 } from 'lucide-react'
type Good = { name: string }
type Assign = { id: string, path: TreeNode[] }
function optionsAtLevel(level: number, selection: (string|null)[], roots: TreeRoots, map: NodeMap): TreeNode[] {
  if (level === 0) return roots
  const parentId = selection[level - 1]
  if (!parentId) return []
  const parent = map.get(parentId)
  if (!parent) return []
  return parent.children.map(id => map.get(id)!).filter(Boolean)
}
export function GoodsList({ goods, rows }:{ goods: Good[], rows: any[] }){
  const { map, roots } = useMemo(() => buildTree(rows), [rows])
  const [selections, setSelections] = useState<Record<number, (string|null)[]>>({})
  const [assigned, setAssigned] = useState<Record<number, Assign|undefined>>({})
  const setLevel = (rowIndex:number, level:number, id:string|null) => {
    const prev = selections[rowIndex] || []
    const next = prev.slice(0, level); next[level] = id
    setSelections(s => ({ ...s, [rowIndex]: next }))
  }
  const selectedNode = (rowIndex:number): TreeNode|null => {
    const sel = selections[rowIndex] || []
    const last = sel.filter(Boolean).at(-1) as string | undefined
    if (!last) return null
    return map.get(last) ?? null
  }
  const canAssign = (rowIndex:number) => { const n = selectedNode(rowIndex); return !!(n && isLeaf(n)) }
  const doAssign = (rowIndex:number) => {
    const n = selectedNode(rowIndex); if (!n || !isLeaf(n)) return
    const path = findPathToRoot(n, map); setAssigned(a => ({ ...a, [rowIndex]: { id: n.id, path } }))
  }
  const exportExcel = () => {
    const data = goods.map((g, i) => ({ "نام کالا": g.name, "مسیر": assigned[i]?.path?.map(p => p.titleFa).join(" / ") || "", "digikala_id": assigned[i]?.id || "" }))
    const ws = XLSX.utils.json_to_sheet(data); const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, "goods_map"); XLSX.writeFile(wb, "goods-mapped.xlsx")
  }
  const resetAll = () => { setSelections({}); setAssigned({}); location.reload() }
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm text-slate-600">تعداد کالا: {goods.length}</div>
        <div className="flex items-center gap-2">
          <button className="btn" onClick={exportExcel}><Download className="w-4 h-4" /> خروجی اکسل</button>
          <button className="btn" onClick={resetAll}><RefreshCw className="w-4 h-4" /> رفرش</button>
        </div>
      </div>
      <div className="space-y-3 max-h-[70vh] overflow-auto pr-1">
        {goods.map((g, i) => {
          const sel = selections[i] || []; const node = selectedNode(i); const isOk = assigned[i] != null
          return (
            <div key={i} className="border rounded-xl p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="font-medium">{g.name}</div>
                {isOk && <span className="inline-flex items-center gap-1 text-emerald-700 text-sm"><CheckCircle2 className="w-4 h-4" /> ثبت شد</span>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-2">
                {Array.from({length: 6}).map((_, level) => {
                  const opts = optionsAtLevel(level, sel, roots, map); const hasNext = opts.length > 0 || level === 0
                  if (!hasNext && level > 0 && !sel[level-1]) return null
                  return (
                    <select key={level} className="w-full border border-slate-300 rounded-xl px-3 py-2 bg-white"
                      value={sel[level] ?? ''} onChange={e => setLevel(i, level, e.target.value || null)} disabled={isOk}>
                      <option value="">{`سطح ${level+1} — انتخاب`}</option>
                      {(level===0 ? roots : opts).map(n => (<option key={n.id} value={n.id}>{n.titleFa} — {n.code} — {n.id}</option>))}
                    </select>
                  )
                })}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <button className="btn-primary disabled:opacity-50" onClick={() => doAssign(i)} disabled={!canAssign(i) || isOk} title="ثبت برگ نهایی برای این کالا">ثبت</button>
                {assigned[i] && (<div className="text-sm text-slate-600"><div>مسیر: {assigned[i]!.path.map(p => p.titleFa).join(' / ')}</div><div>کد نهایی: <span className="badge">{assigned[i]!.id}</span></div></div>)}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
