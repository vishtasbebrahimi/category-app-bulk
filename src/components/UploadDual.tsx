import { useRef, useState } from 'react'
import { Upload } from 'lucide-react'
import { parseCategories, CatRow } from '../lib/excel_categories'
import { parseGoods, GoodsRow } from '../lib/excel_goods'
export function UploadDual({ onData }:{ onData: (cats:CatRow[], goods:GoodsRow[])=>void }){
  const catRef = useRef<HTMLInputElement|null>(null)
  const goodsRef = useRef<HTMLInputElement|null>(null)
  const [busy, setBusy] = useState(false)
  const [catName, setCatName] = useState<string>('')
  const [goodsName, setGoodsName] = useState<string>('')
  const handle = async () => {
    const catFile = catRef.current?.files?.[0]
    const goodsFile = goodsRef.current?.files?.[0]
    if(!catFile || !goodsFile){ alert('هر دو فایل را انتخاب کنید.'); return }
    setBusy(true)
    try{
      const [cats, goods] = await Promise.all([parseCategories(catFile), parseGoods(goodsFile)])
      onData(cats, goods)
    }catch(e:any){ alert(e?.message || 'خطا در خواندن فایل‌ها') }
    finally{ setBusy(false) }
  }
  return (
    <div className="card p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end">
        <div className="flex-1">
          <label className="text-sm text-slate-600 block mb-1">فایل اکسل کتگوری‌ها</label>
          <input ref={catRef} type="file" accept=".xlsx,.xls,.csv" className="block w-full" onChange={e => setCatName(e.target.files?.[0]?.name || '')} />
          {catName && <div className="text-xs text-slate-500 mt-1">{catName}</div>}
        </div>
        <div className="flex-1">
          <label className="text-sm text-slate-600 block mb-1">فایل اکسل نام کالاها</label>
          <input ref={goodsRef} type="file" accept=".xlsx,.xls,.csv" className="block w-full" onChange={e => setGoodsName(e.target.files?.[0]?.name || '')} />
          {goodsName && <div className="text-xs text-slate-500 mt-1">{goodsName}</div>}
        </div>
        <div>
          <button onClick={handle} className="btn-primary" disabled={busy}><Upload className="w-4 h-4" /> {busy?'در حال پردازش...':'بارگذاری و پردازش'}</button>
        </div>
      </div>
    </div>
  )
}
