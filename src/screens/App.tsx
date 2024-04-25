import React, {useCallback, useEffect, useRef} from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {emptyTile, tilesInOrder, TileType, useTiles} from '../hooks/useTiles';
import {Tile, tileSize} from '../components/Tile.tsx';
import {Buttons} from '../components/Buttons.tsx';
import {Field} from '../components/Field.tsx';
import {useMoveCount} from '../hooks/useMoveCount.ts';
import {useIsGameOver} from '../hooks/useIsGameOver.ts';
import {swap} from '../helpers/swap.ts';
import {Confetti} from '../components/Confetti.tsx';
import {shuffleTiles} from '../helpers/shuffleArray.ts';

export type OnTileMove = (position1: number, position2: number) => void;

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const {tiles, setTiles} = useTiles();
  const {isGameOver, setIsGameOver} = useIsGameOver(tiles);
  const emptyTilePosition = tiles.indexOf(emptyTile);
  const {moveCount, bestMoveCount, incrementMoveCount, resetMoveCount} =
    useMoveCount(tiles);
  const isResetting = useRef(false);
  const isEndGameMessageShownRef = useRef(false);

  const onTileMove: OnTileMove = useCallback(
    (position1, position2) => {
      incrementMoveCount();
      setTiles(swap(tiles, position1, position2));
    },
    [incrementMoveCount, setTiles, tiles],
  );

  const onReset = useCallback(() => {
    isResetting.current = true;
    const timeout = setTimeout(() => {
      isResetting.current = false;
      clearTimeout(timeout); // todo: is this needed?
    }, 10000); // todo: make it work without setTimeout
    setTiles(tilesInOrder);
    resetMoveCount();
  }, [resetMoveCount, setTiles]);

  const onShuffle = useCallback(() => {
    setIsGameOver(false);
    setTiles(shuffleTiles(tilesInOrder));
    resetMoveCount();
  }, [resetMoveCount, setIsGameOver, setTiles]);

  useEffect(() => {
    const isNotResettingOrShowingResult =
      !isResetting.current && !isEndGameMessageShownRef.current;
    const isEndGameState =
      isGameOver &&
      moveCount > 0 &&
      moveCount !== bestMoveCount &&
      bestMoveCount < Infinity;
    const isOkToShowEndGameMessage =
      isNotResettingOrShowingResult && isEndGameState;

    if (isOkToShowEndGameMessage) {
      Alert.alert(
        `Your score is ${moveCount.toString()}`,
        `Your best score is ${bestMoveCount.toString()}`,
      );

      isEndGameMessageShownRef.current = true;
      const timeout = setTimeout(() => {
        isEndGameMessageShownRef.current = false;
        clearTimeout(timeout);
      }, 5000);
    }
  }, [isGameOver, moveCount, bestMoveCount, setIsGameOver]);

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={[backgroundStyle, styles.container]}>
        {isGameOver && <Confetti />}

        <Buttons onReset={onReset} onShuffle={onShuffle} />
        <Field>
          {tiles.map((tile: TileType, i: number) =>
            tile ? (
              <Tile
                tile={tile}
                onTileMove={onTileMove}
                position={i}
                emptyTilePosition={emptyTilePosition}
                isGameOver={isGameOver}
                key={`${tile}`}
              />
            ) : (
              <View key="empty" style={styles.empty} />
            ),
          )}
        </Field>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    width: tileSize,
    height: tileSize,
    zIndex: -1,
  },
});

export default App;
