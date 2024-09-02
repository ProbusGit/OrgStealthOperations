import React, { useEffect } from 'react';
import {StyleSheet, useColorScheme} from 'react-native';
import {
  Drawer,
  MD3LightTheme,
  MD3Theme,
  PaperProvider,
} from 'react-native-paper';
import theme, {useAppTheme} from './src/theme';
import RootNavigator from './src/navigation/rootNavigator/RootNavigator';
import {Provider} from 'react-redux';
import {store} from './src/redux/store/store';
import {dark, light} from './src/theme/themes';
import {SafeAreaView} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';



function App(): React.JSX.Element {
  const systemColorScheme = useColorScheme();
  const appTheme = {
    ...theme,
    colors: {
      ...theme.colors,
      // ...(systemColorScheme === 'dark' ? dark.colors : light.colors),
      ...light.colors,
    },
  };

  // const appTheme = {...theme, ...(systemColorScheme === 'dark' ? dark : light)};
  return (
    <Provider store={store}>
      <PaperProvider theme={appTheme}>
        <SafeAreaView
          style={{flex: 1, backgroundColor: appTheme.colors.surface}}>
          <GestureHandlerRootView style={{flex: 1}}>
            <RootNavigator />
          </GestureHandlerRootView>
        </SafeAreaView>
      </PaperProvider>
       </Provider>
 
  );
}

const styles = StyleSheet.create({});

export default App;

