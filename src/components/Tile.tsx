import React, {useCallback} from 'react';
import {StyleSheet, Text} from 'react-native';
import {GestureDetector, Gesture} from 'react-native-gesture-handler';
import Animated, {
  AnimatedStyle,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import type {TileType} from '../hooks/useTiles';
import {
  isAxisX,
  isAxisY,
  isMovableDown,
  isMovableLeft,
  isMovableRight,
  isMovableUp,
} from '../helpers/matrixShared.ts';
import {OnTileMove} from '../screens/App.tsx';

export const tileSize = 100;
const tileMoveThreshold = tileSize / 2;

let absoluteTX;
let absoluteTY;
let x;
let y;
let isDoingForbiddenMoveHorizontally: boolean;
let isDoingForbiddenMoveVertically: boolean;
let isMovedLeft;
let isMovedRight;
let isMovedUp;
let isMovedDown;
let isMovedHorizontally;
let isTileBeenMoved;

interface Props {
  tile: TileType;
  onTileMove: OnTileMove;
  position: number;
  emptyTilePosition: number;
  isGameOver: boolean;
}

export const Tile = ({
  tile,
  onTileMove,
  position,
  emptyTilePosition,
  isGameOver,
}: Props) => {
  const isPressed = useSharedValue(false);
  const offset = useSharedValue({x: 0, y: 0});
  const isHorizontalWithEmptyTile = isAxisX(position, emptyTilePosition);
  const isVerticalWithEmptyTile = isAxisY(position, emptyTilePosition);
  const canMoveTile =
    !isGameOver && (isHorizontalWithEmptyTile || isVerticalWithEmptyTile);
  const canMoveTileRight = isMovableRight(position, emptyTilePosition);
  const canMoveTileLeft = isMovableLeft(position, emptyTilePosition);
  const canMoveTileUp = isMovableUp(position, emptyTilePosition);
  const canMoveTileDown = isMovableDown(position, emptyTilePosition);

  const animatedStyles = useAnimatedStyle(() => {
    const style: AnimatedStyle = {
      backgroundColor: isPressed.value ? 'hotpink' : 'white',
      zIndex: isPressed.value ? 1 : 0,
    };

    if (canMoveTile) {
      style.transform = [
        {translateX: offset.value.x},
        {translateY: offset.value.y},
      ];
    }

    return style;
  }, [isPressed.value, offset.value, canMoveTile]);

  const onTileMoveSuccess = useCallback(() => {
    // todo: make position an array? In that way onTimeMove can handle the "move two as one" case
    onTileMove(position, emptyTilePosition);
  }, [emptyTilePosition, onTileMove, position]);

  const gesture = Gesture.Pan()
    .runOnJS(true) // need it for onTileMoveSuccess and requestAnimationFrame
    .onBegin(() => {
      isPressed.value = true;
    })
    .onUpdate(e => {
      x = e.translationX;
      y = e.translationY;

      isMovedLeft = x < 0;
      isMovedRight = x > 0;
      isMovedUp = y < 0;
      isMovedDown = y > 0;

      isDoingForbiddenMoveHorizontally =
        (!canMoveTileLeft && isMovedLeft) ||
        (!canMoveTileRight && isMovedRight);
      isDoingForbiddenMoveVertically =
        (!canMoveTileUp && isMovedUp) || (!canMoveTileDown && isMovedDown);

      if (isHorizontalWithEmptyTile && !isDoingForbiddenMoveHorizontally) {
        offset.value = {
          x:
            Math.abs(e.translationX) > tileSize // if moving further than one tile
              ? Math.sign(e.translationX) * tileSize // then limit to one tile
              : x, // else move to an actual value
          y: 0,
        };
      } else if (isVerticalWithEmptyTile && !isDoingForbiddenMoveVertically) {
        offset.value = {
          x: 0,
          y:
            Math.abs(e.translationY) > tileSize // if moving further than one tile
              ? Math.sign(e.translationY) * tileSize // then limit to one tile
              : y, // else move to an actual value
        };
      }
    })
    .onEnd(e => {
      offset.value = {x: 0, y: 0}; // move tile back to initial place before re-render maybe puts it on a new position

      absoluteTX = Math.abs(e.translationX);
      absoluteTY = Math.abs(e.translationY);
      isTileBeenMoved =
        absoluteTX > tileMoveThreshold || absoluteTY > tileMoveThreshold;
      const isTileMovedCorrectly = canMoveTile && isTileBeenMoved;
      isMovedHorizontally = absoluteTX > absoluteTY;
      const isMovedVertically = absoluteTX < absoluteTY;
      isMovedLeft = e.translationX < 0;
      isMovedRight = e.translationX > 0;
      isMovedUp = e.translationY < 0;
      isMovedDown = e.translationY > 0;
      isDoingForbiddenMoveHorizontally =
        (!canMoveTileLeft && isMovedLeft) ||
        (!canMoveTileRight && isMovedRight);
      isDoingForbiddenMoveVertically =
        (!canMoveTileUp && isMovedUp) || (!canMoveTileDown && isMovedDown);

      if (
        isTileMovedCorrectly &&
        ((isMovedHorizontally && !isDoingForbiddenMoveHorizontally) ||
          (isMovedVertically && !isDoingForbiddenMoveVertically))
      ) {
        onTileMoveSuccess();
      } else {
        offset.value = {x: 0, y: 0}; // if tile is being put back to the starting position and touch is interrupted before finish, then put it back to the starting point;
      }
    })
    .onFinalize(() => {
      isPressed.value = false;
    });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.container, animatedStyles]}>
        <Text>{tile}</Text>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    width: tileSize,
    height: tileSize,
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: 'black',
  },
});
