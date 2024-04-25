import React from 'react';
import {Button, StyleSheet, View} from 'react-native';
import type {GestureResponderEvent} from 'react-native';

import {useColors} from '../hooks/useColors';

type Props = Readonly<{
  onReset: (event: GestureResponderEvent) => void;
  onShuffle: (event: GestureResponderEvent) => void;
}>;

export function Buttons({onReset, onShuffle}: Props) {
  const colors = useColors();

  return (
    <View style={styles.container}>
      <Button onPress={onReset} title="Reset" color={colors.secondary} />
      <Button onPress={onShuffle} title="Shuffle" color={colors.secondary} />
    </View>
  );
}

const styles = StyleSheet.create<any>({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    zIndex: 10001,
  },
});
