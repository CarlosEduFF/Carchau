import React, { } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Image, Text, TouchableOpacity } from "react-native";

import images from "~/constants/images";
import { router } from "expo-router";
import { routes } from "~/constants/routes";
import App from './screens/AppScreen/App';
const index = () => {

  return (
    <>
      <SafeAreaProvider>


    <App/>
      </SafeAreaProvider>
    </>
  );
}



export default index;
