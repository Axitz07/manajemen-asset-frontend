const GRID_SIZE = 21

const hashValue = (value = '') =>
  String(value)
    .split('')
    .reduce((acc, char, index) => acc + char.charCodeAt(0) * (index + 1), 0)

const isFinderCell = (row, col) => {
  const inTopLeft = row < 7 && col < 7
  const inTopRight = row < 7 && col >= GRID_SIZE - 7
  const inBottomLeft = row >= GRID_SIZE - 7 && col < 7
  return inTopLeft || inTopRight || inBottomLeft
}

const finderFill = (row, col) => {
  const localRow = row < 7 ? row : row - (GRID_SIZE - 7)
  const localCol = col < 7 ? col : col - (GRID_SIZE - 7)
  const outer = localRow === 0 || localRow === 6 || localCol === 0 || localCol === 6
  const inner = localRow >= 2 && localRow <= 4 && localCol >= 2 && localCol <= 4
  return outer || inner
}

export function createQrSvgDataUri(value = 'QR-ASSET') {
  const seed = hashValue(value)
  const cells = []

  for (let row = 0; row < GRID_SIZE; row += 1) {
    for (let col = 0; col < GRID_SIZE; col += 1) {
      let fill = false

      if (isFinderCell(row, col)) {
        fill = finderFill(row, col)
      } else {
        fill = ((seed + row * 17 + col * 31 + row * col) % 5) < 2
      }

      if (fill) {
        cells.push(`<rect x="${col}" y="${row}" width="1" height="1" rx="0.08" fill="#111827" />`)
      }
    }
  }

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 25 25" shape-rendering="crispEdges">
      <rect x="-2" y="-2" width="25" height="25" rx="2.5" fill="#ffffff" />
      ${cells.join('')}
    </svg>
  `.trim()

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}
