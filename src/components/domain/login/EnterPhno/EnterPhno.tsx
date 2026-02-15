import { Image, StyleSheet, View } from 'react-native'
import React from 'react'
import { useTheme } from '../../../../theme/ThemeProvider'
import { useStyles } from './EnterPhno.styles';
import { SwTextInput as TextInput } from '../../../common/SwTextInput/SwTextInput';
import { SwText as Text } from '../../../common/SwText/SwText';
import { ImageSource } from '../../../../constants/images';

const EnterPhno = () => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  return (
    <View style={styles.inputContainer}>
      <TextInput title={"Enter your number"} isPhno={true} />
      <TextInput title={"Enter your number"} isPhno={false} />
      <View style={styles.checkBoxAndConditionContainer}>
        <Image source={ImageSource.greenCheckbox} style={styles.checkbox} />
        <Text>I agree to share my Personally identifiable Information like name,email,mobile number , etc. I agree to the Terms of service and Privacy Policy of swapride app</Text>
      </View>
      <View style={styles.spacer} />
      <Text varient='bold' style={styles.linkText}>Login using Password</Text>
    </View>
  )
}

export default EnterPhno

const styles = StyleSheet.create({})