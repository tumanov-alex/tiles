// import React, {useCallback} from 'react';
// import {StyleSheet, Text} from 'react-native';
// import {GestureDetector, Gesture} from 'react-native-gesture-handler';
// import Animated, {
//   AnimatedStyle,
//   useAnimatedStyle,
//   useSharedValue,
// } from 'react-native-reanimated';
//
// import type {TileType} from '../hooks/useTiles';
// import {
//   isAxisX,
//   isAxisY,
//   isMovableDown,
//   isMovableLeft,
//   isMovableRight,
//   isMovableUp,
// } from '../helpers/matrixShared.ts';
// import {OnTileMove} from '../screens/App.tsx';
//
// export const tileSize = 100;
// const tileMoveThreshold = tileSize / 2;
//
// let absoluteTX;
// let absoluteTY;
// let x;
// let y;
// let isDoingForbiddenMoveHorizontally: boolean;
// let isDoingForbiddenMoveVertically: boolean;
// let isMovedLeft;
// let isMovedRight;
// let isMovedUp;
// let isMovedDown;
// let isMovedHorizontally;
// let isTileBeenMoved;
//
// interface Props {
//   tile: TileType;
//   onTileMove: OnTileMove;
//   position: number;
//   emptyTilePosition: number;
//   isGameFinished: boolean;
// }
//
// export const Tile = ({
//   tile,
//   onTileMove,
//   position,
//   emptyTilePosition,
//   isGameFinished,
// }: Props) => {
//   const isPressed = useSharedValue(false);
//   const offset = useSharedValue({x: 0, y: 0});
//   const isHorizontalWithEmptyTile = isAxisX(position, emptyTilePosition);
//   const isVerticalWithEmptyTile = isAxisY(position, emptyTilePosition);
//   const canMoveTile =
//     !isGameFinished && (isHorizontalWithEmptyTile || isVerticalWithEmptyTile);
//   const canMoveTileRight = isMovableRight(position, emptyTilePosition);
//   const canMoveTileLeft = isMovableLeft(position, emptyTilePosition);
//   const canMoveTileUp = isMovableUp(position, emptyTilePosition);
//   const canMoveTileDown = isMovableDown(position, emptyTilePosition);
//
//   const animatedStyles = useAnimatedStyle(() => {
//     const style: AnimatedStyle = {
//       backgroundColor: isPressed.value ? 'hotpink' : 'white',
//       zIndex: isPressed.value ? 1 : 0,
//     };
//
//     if (canMoveTile) {
//       style.transform = [
//         {translateX: offset.value.x},
//         {translateY: offset.value.y},
//       ];
//     }
//
//     return style;
//   }, [isPressed.value, offset.value, canMoveTile]);
//
//   const onTileMoveSuccess = useCallback(() => {
//     // todo: make position1 an array? In that way onTimeMove can handle the "move two as one" case
//     onTileMove(position, emptyTilePosition, () => {
//       offset.value = {x: 0, y: 0};
//     });
//   }, [emptyTilePosition, offset, onTileMove, position]);
//
//   const gesture = Gesture.Pan()
//     .runOnJS(true) // need it for onTileMoveSuccess and requestAnimationFrame
//     .onBegin(() => {
//       isPressed.value = true;
//     })
//     .onUpdate(e => {
//       x = e.translationX;
//       y = e.translationY;
//
//       isMovedLeft = x < 0;
//       isMovedRight = x > 0;
//       isMovedUp = y < 0;
//       isMovedDown = y > 0;
//
//       isDoingForbiddenMoveHorizontally =
//         (!canMoveTileLeft && isMovedLeft) ||
//         (!canMoveTileRight && isMovedRight);
//       isDoingForbiddenMoveVertically =
//         (!canMoveTileUp && isMovedUp) || (!canMoveTileDown && isMovedDown);
//
//       if (isHorizontalWithEmptyTile && !isDoingForbiddenMoveHorizontally) {
//         offset.value = {
//           x:
//             Math.abs(e.translationX) > tileSize // if moving further than one tile
//               ? Math.sign(e.translationX) * tileSize // then limit to one tile
//               : x, // else move to an actual value
//           y: 0,
//         };
//       } else if (isVerticalWithEmptyTile && !isDoingForbiddenMoveVertically) {
//         offset.value = {
//           x: 0,
//           y:
//             Math.abs(e.translationY) > tileSize // if moving further than one tile
//               ? Math.sign(e.translationY) * tileSize // then limit to one tile
//               : y, // else move to an actual value
//         };
//       }
//     })
//     .onEnd(e => {
//       absoluteTX = Math.abs(e.translationX);
//       absoluteTY = Math.abs(e.translationY);
//       isTileBeenMoved =
//         absoluteTX > tileMoveThreshold || absoluteTY > tileMoveThreshold;
//
//       if (canMoveTile && isTileBeenMoved) {
//         isMovedHorizontally = absoluteTX > absoluteTY;
//
//         offset.value = {x: 0, y: 0}; // todo: remove?
//
//         if (isMovedHorizontally) {
//           isMovedLeft = e.translationX < 0;
//           isMovedRight = e.translationX > 0;
//
//           isDoingForbiddenMoveHorizontally =
//             (!canMoveTileLeft && isMovedLeft) ||
//             (!canMoveTileRight && isMovedRight);
//
//           if (isDoingForbiddenMoveHorizontally) {
//             offset.value = {x: 0, y: 0}; // if tile is being put back to the starting position and touch is interrupted before finish, then put it back to the starting point;
//           } else {
//             onTileMoveSuccess();
//           }
//         } else {
//           isMovedUp = e.translationY < 0;
//           isMovedDown = e.translationY > 0;
//
//           isDoingForbiddenMoveVertically =
//             (!canMoveTileUp && isMovedUp) || (!canMoveTileDown && isMovedDown);
//
//           if (isDoingForbiddenMoveVertically) {
//             offset.value = {x: 0, y: 0}; // if tile is being put back to the starting position and touch is interrupted before finish, then put it back to the starting point;
//           } else {
//             onTileMoveSuccess();
//           }
//         }
//       } else {
//         offset.value = {x: 0, y: 0};
//       }
//     })
//     .onFinalize(() => {
//       isPressed.value = false;
//     });
//
//   return (
//     <GestureDetector gesture={gesture}>
//       <Animated.View style={[styles.container, animatedStyles]}>
//         <Text>{tile}</Text>
//       </Animated.View>
//     </GestureDetector>
//   );
// };
//
// const styles = StyleSheet.create({
//   container: {
//     width: tileSize,
//     height: tileSize,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderStyle: 'solid',
//     borderWidth: 1,
//     borderColor: 'black',
//   },
// });
