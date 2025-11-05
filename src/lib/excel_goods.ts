import * as XLSX from 'xlsx-js-style'
export type GoodsRow = { name: string }
export async function parseGoods(file: File): Promise<GoodsRow[]> {
  const ab = await file.arrayBuffer()
  const wb = XLSX.read(ab, { type: 'array' })
  const sheet = wb.Sheets[wb.SheetNames[0]]
  const json: any[] = XLSX.utils.sheet_to_json(sheet, { defval: '' })
  if (json.length === 0) return []
  const keys = Object.keys(json[0])
  const possible = ['نام کالا','name','goods','title','item']
  const col = possible.find(p => keys.includes(p)) || keys[0]
  return json.map((r:any) => ({ name: String(r[col] ?? '').trim() })).filter(x => x.name)
}
