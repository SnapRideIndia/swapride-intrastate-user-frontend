import { Image, StyleSheet, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '../../../../theme/ThemeProvider'
import { useStyles } from './PrimaryHeader.styles'
import { ImageSource } from '../../../../constants/images'
import { SwText as Text } from '../../SwText/SwText'

interface IHeaderProps{
    title: string,
    showBackButton?: boolean,
    onBackPress?: ()=>void,
}

const PrimaryHeader = ({title}:IHeaderProps) => {
    const {colors} = useTheme();
    const styles = useStyles(colors);
  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
        <View style={styles.headerInnerContainer}>
            <Image source={ImageSource.leftArrow} style={styles.backArrow} />
           <Text>{title}</Text>
        </View>
    </SafeAreaView>
  )
}

export default PrimaryHeader

const styles = StyleSheet.create({})