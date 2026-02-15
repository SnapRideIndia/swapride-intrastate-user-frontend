import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useStyles } from './HomeScreen.styles'
import { useTheme } from '../../../theme/ThemeProvider';

const HomeScreen = () => {
    const {colors} = useTheme();
    const styles = useStyles(colors);
  return (
    <View>
      <Text>HomeScreen</Text>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({})