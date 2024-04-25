import {useColorScheme} from 'react-native';

import {useIsDevtoolsOpened} from './useIsDevtoolsOpened';

export const useIsDarkMode = (): boolean => {
  const isDevtoolsOpened = useIsDevtoolsOpened();

  const colorScheme = useColorScheme();
  // todo: make it actually react to a device theme
  return colorScheme === (isDevtoolsOpened ? 'light' : 'dark');
  // return Appearance.getColorScheme() === 'dark';
};
