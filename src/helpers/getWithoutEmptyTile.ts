import { emptyTile, TileType } from '../hooks/useTiles';

// todo: remove any
export const getWithoutEmptyTile = (tiles: TileType[]): any[] =>
  tiles.filter((tile) => tile !== emptyTile);
