import {StyleSheet, View} from 'react-native';
import React, {PropsWithChildren} from 'react';
import {tileSize} from './Tile.tsx';
import {emptyTile} from '../hooks/useTiles.ts';

type Props = PropsWithChildren<{}>;

export const Field: React.FC<PropsWithChildren<{}>> = ({children}) => {
  return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    width: tileSize * 3,
    height: tileSize * 3,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 70,
  },
});
