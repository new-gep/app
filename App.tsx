
import Route from './src/navigation/Route';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Provider } from 'react-redux'
import store from './src/redux/store';
import React from 'react';
import { View, Text, Platform } from 'react-native';
import { COLORS } from './src/constants/theme';
export default function App() {
  

  // const { colors } : {colors : any} = theme;

  const [loaded] = useFonts({
    PoppinsBold: require('./src/assets/fonts/Poppins-Bold.ttf'),
    PoppinsSemiBold: require('./src/assets/fonts/Poppins-SemiBold.ttf'),
    PoppinsLight : require('./src/assets/fonts/Poppins-Light.ttf'),
    PoppinsMedium : require('./src/assets/fonts/Poppins-Medium.ttf'),
    PoppinsRegular : require('./src/assets/fonts/Poppins-Regular.ttf'),
    PoppinsExtraLight : require('./src/assets/fonts/Poppins-ExtraLight.ttf'),
  });  

  if(!loaded){
    return null;
  }

  return (
    <SafeAreaProvider>
        <SafeAreaView
          style={{
            flex: 1,
            paddingTop: Platform.OS === 'android' ? 25 : 0,
            backgroundColor:COLORS.primary ,
          }}>
            <StatusBar style="dark" />
            <Provider store={store}>
                <Route/>
            </Provider>
        </SafeAreaView>
    </SafeAreaProvider>
  );
}
