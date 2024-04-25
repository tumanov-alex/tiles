import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';

export const Confetti = () => (
  <View style={styles.confetti}>
    <ConfettiCannon
      autoStart
      count={200}
      fallSpeed={10000}
      origin={{x: -10, y: 0}}
    />
  </View>
);

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  confetti: {
    zIndex: 10000,
    position: 'absolute',
    height: windowHeight,
    width: windowWidth,
  },
});
