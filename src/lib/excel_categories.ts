import * as XLSX from 'xlsx-js-style'
export type CatRow = { idRaw: string, code: string, digikalaId: string, parentId: string|null, titleFa: string }
export async function parseCategories(file: File): Promise<CatRow[]> {
  const ab = await file.arrayBuffer()
  const wb = XLSX.read(ab, { type: 'array' })
  const sheet = wb.Sheets[wb.SheetNames[0]]
  const json: any[] = XLSX.utils.sheet_to_json(sheet, { defval: '' })
  const req = ['ID','code','digikala_id','parent_id','title_fa']
  const first = json[0] || {}
  for (const c of req) if (!(c in first)) throw new Error('ستون‌های موردنیاز در فایل کتگوری یافت نشد.')
  return json.map(r => ({
    idRaw: String(r['ID'] ?? ''),
    code: String(r['code'] ?? ''),
    digikalaId: String(r['digikala_id'] ?? ''),
    parentId: r['parent_id'] === '' || r['parent_id'] === null ? null : String(r['parent_id']),
    titleFa: String(r['title_fa'] ?? ''),
  }))
}
