import { Image, View } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '../../theme/ThemeProvider'
import { useStyles } from './SplashScreen.styles'
import { ImageSource } from '../../constants/images'

const SplashScreen = () => {
    const {colors} = useTheme();
    const styles = useStyles(colors);
  return (
    <SafeAreaView edges={["bottom", "top", "left", "right"]} style={styles.container}>
        <View style={{justifyContent: "center", alignItems: "center", flex:1}}>
            <Image source={ImageSource.splashLogo} style={styles.spalshLogo}/>
        </View>
        <View style={{flex:1, justifyContent: "center", alignItems: "center"}}>
            {/* <LottieView
              source={require('../../assets/images/metro.lottie')}
              autoPlay
              loop
              style={styles.metroGIF}
            /> */}
            <Image source={ImageSource.metroGIF} style={styles.metroGIF} />
        </View>
    </SafeAreaView>
  )
}

export default SplashScreen