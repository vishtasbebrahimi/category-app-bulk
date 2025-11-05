import { useState } from 'react'
import { UploadDual } from './components/UploadDual'
import { GoodsList } from './components/GoodsList'
import { CatRow } from './lib/excel_categories'
import { Toast, useToast } from './components/Toast'
export default function App(){
  const { toasts, removeToast } = useToast()
  const [cats, setCats] = useState<CatRow[]|null>(null)
  const [goods, setGoods] = useState<{name:string}[]|null>(null)
  const onData = (cats:CatRow[], goods:{name:string}[]) => { setCats(cats); setGoods(goods) }
  return (
    <div className="max-w-7xl mx-auto p-4 rtl-text">
      <header className="mb-4"><h1 className="text-2xl font-bold">تخصیص کتگوری به کالاها (Bulk)</h1></header>
      <UploadDual onData={onData} />
      {cats && goods && (<div className="mt-4"><GoodsList goods={goods} rows={cats} /></div>)}
      <Toast toasts={toasts} onClose={removeToast} />
    </div>
  )
}
