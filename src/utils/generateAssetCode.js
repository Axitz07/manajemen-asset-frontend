export function generateAssetCode(id = 0) {
  return `AST-${String(id).padStart(3, '0')}`
}
