export function normalizeText(s: string): string {
  const map: Record<string,string> = { 'ي':'ی', 'ك':'ک', 'ة':'ه', 'ۀ':'ه', 'ؤ':'و', '‌':' ' }
  let t = (s || '').toLowerCase().trim()
  t = t.replace(/[\u064B-\u065F]/g, '')
  t = t.replace(/[\u200c\u200f]/g, ' ')
  t = t.replace(/[.,/\\()\-_|+\[\]{}:;"'!?]/g, ' ')
  t = t.replace(/\s+/g, ' ')
  t = t.replace(/[\u0621-\u064A]/g, ch => map[ch] ?? ch)
  return t
}
