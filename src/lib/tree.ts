export type TreeNode = { id: string, titleFa: string, code: string, parentId: string|null, children: string[] }
export type NodeMap = Map<string, TreeNode>
export type TreeRoots = TreeNode[]
export function buildTree(rows: {digikalaId:string,titleFa:string,code:string,parentId:string|null}[]): { map: NodeMap, roots: TreeRoots } {
  const map: NodeMap = new Map()
  for (const r of rows) {
    if (!r.digikalaId) continue
    map.set(r.digikalaId, { id: r.digikalaId, titleFa: r.titleFa, code: r.code, parentId: r.parentId, children: [] })
  }
  for (const n of map.values()) if (n.parentId && map.has(n.parentId)) map.get(n.parentId)!.children.push(n.id)
  const roots: TreeNode[] = []
  for (const n of map.values()) if (!n.parentId || !map.has(n.parentId)) roots.push(n)
  return { map, roots }
}
export function isLeaf(n: TreeNode): boolean { return n.children.length === 0 }
export function findPathToRoot(node: TreeNode, map: NodeMap): TreeNode[] {
  const path: TreeNode[] = []; let cur: TreeNode | undefined = node
  while (cur) { path.unshift(cur); cur = cur.parentId ? map.get(cur.parentId) ?? undefined : undefined }
  return path
}
