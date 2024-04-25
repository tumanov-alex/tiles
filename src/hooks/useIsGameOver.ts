import {useEffect, useState, useRef} from 'react';

import {compareArrays} from '../helpers/compareArrays';
import {tilesInOrder, tileType} from './useTiles';

interface IsGameOver {
  last: boolean;
  previous: boolean;
}

export const useIsGameOver = (tiles: tileType[]) => {
  // const [isGameOver, setIsGameOver] = useState<IsGameOver>({
  //   last: false,
  //   previous: false,
  // });
  const [isGameOver, setIsGameOver] = useState(false);

  // console.log(isGameOver)
  // console.log('========= isGameOver  ==========')
  useEffect(() => {
    // console.log(isGameOver)
    // console.log('========= isGameOver  ==========')
    // todo: move into useTiles.ts
    const isTilesInOrder = compareArrays(tiles, tilesInOrder);
    // console.log(tiles)
    // console.log('========= tiles  ==========')

    if (!isGameOver && isTilesInOrder) {
      setIsGameOver(true);
      // setIsGameOver((prev) => ({
      //   previous: prev.last,
      //   last: true,
      // }));
    } else if (isGameOver && !isTilesInOrder) {
      setIsGameOver(false);
      // setIsGameOver((prev) => ({
      //   previous: prev.last,
      //   last: false,
      // }));
    }
  }, [isGameOver, tiles]);

  return {isGameOver, setIsGameOver};
};
