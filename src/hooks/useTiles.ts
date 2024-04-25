import {useCallback, useEffect, useState} from 'react';
import {useAsyncStorage} from '@react-native-async-storage/async-storage';
import {shuffleTiles} from '../helpers/shuffleArray.ts';

export const emptyTile = null;
export type TileType = number | null;
export const tilesInOrder: TileType[] = [1, 2, 3, 4, 5, 6, 7, 8, emptyTile];

export const useTiles = () => {
  const [tilesState, setTilesState] = useState<TileType[]>([]);
  const {getItem: getTilesStore, setItem: setTilesStore} =
    useAsyncStorage('@tiles');

  const setTiles = useCallback(
    (reorderedTiles: TileType[]) => {
      setTilesStore(JSON.stringify(reorderedTiles));
      setTilesState(reorderedTiles);
    },
    [setTilesStore],
  );

  const readFromAsyncStore = useCallback(async () => {
    try {
      const resJson = await getTilesStore();

      if (resJson !== null) {
        setTilesState(JSON.parse(resJson));
      } else {
        setTiles(shuffleTiles(tilesInOrder));
      }
    } catch (e) {
      console.error(e);
    }
  }, [getTilesStore, setTiles]);

  useEffect(() => {
    !tilesState.length && readFromAsyncStore();
  }, [readFromAsyncStore, tilesState.length]);

  return {tiles: tilesState, setTiles};
};
