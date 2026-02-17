import { ScrollView, StyleSheet, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '../../../theme/ThemeProvider'
import { useStyles } from './WalletScreen.styles'
import { SwText as Text } from '../../../components/common/SwText/SwText'

const WalletScreen = () => {
    const {colors} = useTheme();
    const styles = useStyles(colors);
  return (
  <SafeAreaView edges={["bottom"]} style={styles.container}>
    <ScrollView showsVerticalScrollIndicator={false} style={styles.contentContainerStyle}>
        <Text>Wallet Screen</Text>
    </ScrollView>
  </SafeAreaView>
  )
}

export default WalletScreen

const styles = StyleSheet.create({})