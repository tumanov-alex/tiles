// todo: add support for matrices bigger than 3

const gameFieldSize = 3;
const totalFieldSize = gameFieldSize ** 2;

export const isAxisY = (position1: number, position2: number) => {
  'worklet';
  const upTwo = position1 - gameFieldSize * 2;
  const upOne = position1 - gameFieldSize;
  const downTwo = position1 + gameFieldSize * 2;
  const downOne = position1 + gameFieldSize;

  return (
    position2 === upTwo ||
    position2 === upOne ||
    position2 === downTwo ||
    position2 === downOne
  );
};

export const isAxisX = (position1: number, position2: number) => {
  'worklet';
  switch (position1) {
    case 0:
    case 1:
    case 2: {
      return position2 === 0 || position2 === 1 || position2 === 2;
    }
    case 3:
    case 4:
    case 5: {
      return position2 === 3 || position2 === 4 || position2 === 5;
    }
    case 6:
    case 7:
    case 8: {
      return position2 === 6 || position2 === 7 || position2 === 8;
    }
    default:
      return false;
  }
};

const getRightRowPositions = () => {
  const positions = [];

  for (let i = gameFieldSize - 1; i < totalFieldSize; i += gameFieldSize) {
    positions.push(i);
  }

  return positions;
};

const rightRowPositions = getRightRowPositions();

export const isMovableUp = (
  position: number,
  emptyTilePosition: number,
): boolean => {
  'worklet';
  const isOnTopRow = position < gameFieldSize;
  const isTopTileEmpty = emptyTilePosition === position - gameFieldSize;

  return !isOnTopRow && isTopTileEmpty;
};

export const isMovableDown = (
  position: number,
  emptyTilePosition: number,
): boolean => {
  'worklet';
  const bottomRightTilePosition = totalFieldSize - 1;
  const bottomLeftTilePosition = totalFieldSize - gameFieldSize;
  const isOnBottomRow =
    position >= bottomLeftTilePosition && position <= bottomRightTilePosition;
  const isBottomTileEmpty = emptyTilePosition === position + gameFieldSize;

  return !isOnBottomRow && isBottomTileEmpty;
};

export const isMovableLeft = (
  position: number,
  emptyTilePosition: number,
): boolean => {
  'worklet';
  const isOnLeftRow = position % gameFieldSize === 0;
  const isLeftTileEmpty = emptyTilePosition === position - 1;

  return !isOnLeftRow && isLeftTileEmpty;
};

export const isMovableRight = (
  position: number,
  emptyTilePosition: number,
): boolean => {
  'worklet';
  const isOnRightRow = rightRowPositions.includes(position);
  const isRightTileEmpty = emptyTilePosition === position + 1;

  return !isOnRightRow && isRightTileEmpty;
};

export const getAdjacentSides = (
  tilePosition: number,
  emptyTilePosition: number,
) => {
  const res = [];

  // Check if the tile is above the empty tile
  if (tilePosition - gameFieldSize === emptyTilePosition) {
    res.push('Top');
  }

  // Check if the tile is below the empty tile
  if (tilePosition + gameFieldSize === emptyTilePosition) {
    res.push('Bottom');
  }

  // Check if the tile is to the left of the empty tile
  if (
    tilePosition - 1 === emptyTilePosition &&
    tilePosition % gameFieldSize !== 0
  ) {
    res.push('Left');
  }

  // Check if the tile is to the right of the empty tile
  if (
    tilePosition + 1 === emptyTilePosition &&
    (tilePosition + 1) % gameFieldSize !== 0
  ) {
    res.push('Right');
  }

  // If none of the above conditions are met, the tile is not adjacent to the empty tile
  return res;
};
