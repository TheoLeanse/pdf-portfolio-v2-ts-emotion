export const getCorners = ({ x, y, width, height }: Shape) => [[x, y], [x + width, y], [x, y + height], [x + width, y + height]]

export const pointIsInsideShape = ([pointX, pointY]: number[], { x: shapeX, y: shapeY, height, width }: Shape) => {
  const isInXRange = shapeX <= pointX && pointX <= shapeX + width
  const isInYRange = shapeY <= pointY && pointY <= shapeY + height
  return isInXRange && isInYRange
}

export const doesOverlap = (dimensionsA: Shape, dimensionsB: Shape) =>
  getCorners(dimensionsA).some(corner => pointIsInsideShape(corner, { ...dimensionsB }))

export const availablePosition = (
  itemDimensions: { height: number; width: number },
  pane: { height: number; width: number },
  placedItems: Shape[] = []
): any => {
  const x = parseInt(String(Math.random() * (pane.width - itemDimensions.width)), 10)
  const y = parseInt(String(Math.random() * (pane.height - itemDimensions.height)), 10)

  return placedItems.some(item => doesOverlap({ ...itemDimensions, x, y }, item))
    ? availablePosition(itemDimensions, pane, placedItems)
    : { ...itemDimensions, x, y }
}

export const positions = (count: number, size: { height: number; width: number }, paneDimensions: { height: number; width: number }) =>
  Array.from(Array(count)).reduce(acc => acc.concat(availablePosition(size, paneDimensions, acc)), [])

export const isOdd = (n: number) => n % 2 !== 0
