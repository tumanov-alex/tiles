import React, {useCallback} from 'react';
import {StyleSheet, Text, ViewStyle} from 'react-native';
import {GestureDetector, Gesture} from 'react-native-gesture-handler';
import Animated, {
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
import {getTileBorderStyle} from '../helpers/getTileBorderStyle.ts';
import {useColors} from '../hooks/useColors.ts';

export const tileSize = 100;
const tileMoveThreshold = tileSize / 2;

let absoluteTX;
let absoluteTY;
let x;
let y;
let isInvalidMoveOnX: boolean;
let isInvalidMoveOnY: boolean;
let isMovedLeft;
let isMovedRight;
let isMovedUp;
let isMovedDown;
let isMovedOnX;
let isMovedOnY;
let isTileBeenMoved;
let isTileMovedCorrectly;
let isMovedCorrectlyOnX;
let isMovedCorrectlyOnY;
let isMovedCorrectlyOnXY;

interface Props {
  tile: TileType;
  onTileMove: OnTileMove;
  position: number;
  emptyTilePosition: number;
  isGameOver: boolean;
}

type AnimatedStyles = {
  backgroundColor: string;
  zIndex: number;
  transform?: {translateX?: number; translateY?: number}[];
} & ViewStyle;

export const Tile = ({
  tile,
  onTileMove,
  position,
  emptyTilePosition,
  isGameOver,
}: Props) => {
  const colors = useColors();
  const isPressed = useSharedValue(false);
  const offset = useSharedValue({x: 0, y: 0});

  const isHorizontalWithEmptyTile = isAxisX(position, emptyTilePosition);
  const isVerticalWithEmptyTile = isAxisY(position, emptyTilePosition);
  const canMoveTileOnXY =
    !isGameOver && (isHorizontalWithEmptyTile || isVerticalWithEmptyTile);

  const canMoveTileRight = isMovableRight(position, emptyTilePosition);
  const canMoveTileLeft = isMovableLeft(position, emptyTilePosition);
  const canMoveTileUp = isMovableUp(position, emptyTilePosition);
  const canMoveTileDown = isMovableDown(position, emptyTilePosition);

  const animatedStyles = useAnimatedStyle<AnimatedStyles>(() => {
    const style: AnimatedStyles = {
      backgroundColor: isPressed.value ? 'hotpink' : 'white',
      zIndex: isPressed.value ? 1 : 0,
    };

    if (canMoveTileOnXY) {
      style.transform = [
        {translateX: offset.value.x},
        {translateY: offset.value.y},
      ];
    }

    return style;
  }, [isPressed.value, offset.value, canMoveTileOnXY]);

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

      isInvalidMoveOnX =
        (!canMoveTileLeft && isMovedLeft) ||
        (!canMoveTileRight && isMovedRight);
      isInvalidMoveOnY =
        (!canMoveTileUp && isMovedUp) || (!canMoveTileDown && isMovedDown);

      if (isHorizontalWithEmptyTile && !isInvalidMoveOnX) {
        offset.value = {
          x:
            Math.abs(e.translationX) > tileSize // if moving further than one tile
              ? Math.sign(e.translationX) * tileSize // then limit to one tile
              : x, // else move to an actual value
          y: 0,
        };
      } else if (isVerticalWithEmptyTile && !isInvalidMoveOnY) {
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
      absoluteTX = Math.abs(e.translationX);
      absoluteTY = Math.abs(e.translationY);

      isTileBeenMoved =
        absoluteTX > tileMoveThreshold || absoluteTY > tileMoveThreshold;
      isTileMovedCorrectly = canMoveTileOnXY && isTileBeenMoved;

      isMovedOnX = absoluteTX > absoluteTY;
      isMovedOnY = absoluteTX < absoluteTY;

      isMovedLeft = e.translationX < 0;
      isMovedRight = e.translationX > 0;
      isMovedUp = e.translationY < 0;
      isMovedDown = e.translationY > 0;

      isInvalidMoveOnX =
        (!canMoveTileLeft && isMovedLeft) ||
        (!canMoveTileRight && isMovedRight);
      isInvalidMoveOnY =
        (!canMoveTileUp && isMovedUp) || (!canMoveTileDown && isMovedDown);

      isMovedCorrectlyOnX = isMovedOnX && !isInvalidMoveOnX;
      isMovedCorrectlyOnY = isMovedOnY && !isInvalidMoveOnY;
      isMovedCorrectlyOnXY = isMovedCorrectlyOnX || isMovedCorrectlyOnY;

      offset.value = {x: 0, y: 0}; // move tile back to initial place before re-render maybe puts it on a new position

      if (isTileMovedCorrectly && isMovedCorrectlyOnXY) {
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
      <Animated.View
        style={[
          styles.container,
          getTileBorderStyle(position, emptyTilePosition, colors.secondary),
          animatedStyles,
        ]}>
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
