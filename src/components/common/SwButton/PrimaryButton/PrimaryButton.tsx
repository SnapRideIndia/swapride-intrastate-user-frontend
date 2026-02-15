import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { SwText } from '../../SwText/SwText'
import { useTheme } from '../../../../theme/ThemeProvider'
import { useStyles } from './PrimaryButton.styles'

interface IButtonProps{
    title: string,
    onPress?: ()=>void
}

const PrimaryButton = ({title, onPress}: IButtonProps) => {
    const {colors} = useTheme();
    const styles = useStyles(colors);
  return (
   <TouchableOpacity style={styles.button}>
    <SwText style={styles.title} varient='semi-bold'>{title}</SwText>
   </TouchableOpacity>
  )
}

export default PrimaryButton

const styles = StyleSheet.create({})