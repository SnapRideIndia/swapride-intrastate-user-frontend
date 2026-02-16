import { Image, StyleSheet, View } from 'react-native'
import React from 'react'
import { useTheme } from '../../../../../theme/ThemeProvider'
import { useStyles } from './OptionCard.styles';
import { ImageSource } from '../../../../../constants/images';
import { SwText as Text } from '../../../../common/SwText/SwText';

const OptionCard = () => {
    const {colors} = useTheme();
    const styles = useStyles(colors);
  return (
    <View style={styles.container}>
     <Image source={ImageSource.shuttel} style={styles.icon} />
     <Text>Shuttle</Text>
    </View>
  )
}

export default OptionCard

const styles = StyleSheet.create({})