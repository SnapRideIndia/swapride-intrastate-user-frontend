import { StyleSheet, TextInput, TextInputProps, View } from 'react-native'
import React, { ReactNode } from 'react'
import { useTheme } from '../../../theme/ThemeProvider'
import { useStyles } from './SwTextInput.styles';
import { SwText as Text } from '../SwText/SwText';

interface IInputProps extends TextInputProps{
    title: string,
    isPhno?: boolean,
    renderRightIcon?:()=>ReactNode,
    renderTitleIcon?:()=>ReactNode,
}

export const SwTextInput = (props:IInputProps) => {
    const {colors} = useTheme();
    const styles = useStyles(colors);
  return (
    <View style={styles.inputOuterContainer}>
      <View style={styles.iconWithTitle}>
        {
            props.renderTitleIcon?.()
        }
          <Text varient='semi-bold' style={styles.title}>{props.title}</Text>
      </View>
        <View style={[styles.inputInnerContainer, props.isPhno && styles.phNoStyle]}>
            {
                props.isPhno && <Text>+91 | </Text>
            }
            <TextInput style={styles.inputStyle}  {...props} />
            {
                props.renderRightIcon?.()
            }
        </View>
    </View>
  )
};

const styles = StyleSheet.create({})