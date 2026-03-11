import { Image, View } from 'react-native'
import React, { useEffect } from 'react'
import LottieView from 'lottie-react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '../../theme/ThemeProvider'
import { useStyles } from './SplashScreen.styles'
import { ImageSource } from '../../constants/images'
import { useNavigation } from '@react-navigation/native'
import { storage } from '../../utils/store'
import { StorageKeys } from '../../constants/storage/storageKeys'
import { ScreenNames } from '../../navigation/constant'

const SplashScreen = () => {
    const {colors} = useTheme();
    const styles = useStyles(colors);
    const navigation = useNavigation();
  useEffect(() => {
    const token = storage.getString(StorageKeys.ACCESS_TOKEN);

    setTimeout(() => {
      if (token) {
        navigation.replace(ScreenNames.DASHBOARD_SCREEN as never);
      } else {
        navigation.replace(ScreenNames.LOGIN_SCREEN as never);
      }
    }, 1500);
  }, []);
  return (
    <SafeAreaView edges={["bottom", "top", "left", "right"]} style={styles.container}>
        <View style={{justifyContent: "center", alignItems: "center", flex:1}}>
            <Image source={ImageSource.splashLogo} style={styles.spalshLogo}/>
        </View>
        <View style={{flex:1, justifyContent: "center", alignItems: "center"}}>
            
        </View>
    </SafeAreaView>
  )
}

export default SplashScreen