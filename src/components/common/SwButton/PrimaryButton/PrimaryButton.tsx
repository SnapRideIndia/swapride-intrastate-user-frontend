import { StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native'
import React, { ReactNode } from 'react'
import { SwText } from '../../SwText/SwText'
import { useTheme } from '../../../../theme/ThemeProvider'
import { useStyles } from './PrimaryButton.styles'

interface IButtonProps {
  title: string,
  onPress?: () => void,
  disabled?: boolean,
  btnStyle?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
  renderLeftIcon?: () => ReactNode
  renderRightIcon?: () => ReactNode
}

const PrimaryButton = ({ title, onPress, disabled, btnStyle, textStyle, renderLeftIcon, renderRightIcon }: IButtonProps) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  return (
    <TouchableOpacity style={[styles.button, btnStyle]} onPress={onPress} disabled={disabled} activeOpacity={disabled ? 1 : 0.7}>
      {
        renderLeftIcon?.()
      }
      <SwText style={[styles.title, textStyle]} varient='semi-bold'>{title}</SwText>
      {
        renderRightIcon?.()
      }
    </TouchableOpacity>
  )
}

export default PrimaryButton

const styles = StyleSheet.create({})