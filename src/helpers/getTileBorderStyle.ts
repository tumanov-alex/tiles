import {getAdjacentSides} from './matrixShared.ts';

const sideToBorderWidth: Record<string, keyof ContainerStyle> = {
  Top: 'borderTopWidth',
  Bottom: 'borderBottomWidth',
  Left: 'borderLeftWidth',
  Right: 'borderRightWidth',
};

interface ContainerStyle {
  borderLeftWidth: number;
  borderRightWidth: number;
  borderTopWidth: number;
  borderBottomWidth: number;
  borderColor: string;
}

export const getTileBorderStyle = (
  position: number,
  emptyTilePosition: number,
  borderColor: string,
) => {
  const styles: ContainerStyle = {
    borderColor,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderTopWidth: 1,
  };

  if (position === 0 || position === 3 || position === 6) {
    styles.borderLeftWidth = 2;
  }

  if (position === 2 || position === 5 || position === 8) {
    styles.borderRightWidth = 2;
  }

  if (position < 3) {
    styles.borderTopWidth = 2;
  }

  if (position > 5) {
    styles.borderBottomWidth = 2;
  }

  const sides = getAdjacentSides(position, emptyTilePosition);

  sides.forEach(side => {
    const borderSide = sideToBorderWidth[side];

    if (borderSide) {
      (styles as any)[borderSide] = 2;
    }
  });

  return styles;
};
