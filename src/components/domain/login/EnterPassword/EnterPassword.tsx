import { Image, StyleSheet, View } from 'react-native'
import React from 'react'
import { useTheme } from '../../../../theme/ThemeProvider'
import { useStyles } from './EnterPassword.styles';
import { SwTextInput as TextInput } from '../../../common/SwTextInput/SwTextInput';
import { ImageSource } from '../../../../constants/images';
import { SwText as Text } from '../../../common/SwText/SwText';

const EnterPassword = () => {
    const { colors } = useTheme();
    const styles = useStyles(colors);

    const handleRenderRightIcon = ()=>{
        return <Image source={ImageSource.eyeOff} style={styles.eyeOff} />
    }
    return (
        <View style={styles.container}>
            <TextInput title={"Full Name"} isPhno={false} />
            <TextInput title={"Email Address"} isPhno={false} renderRightIcon={handleRenderRightIcon} />
          <View>
              <TextInput title={"Set Password"} isPhno={false}  />
              <Text style={styles.forgotPassword} varient='bold' >Forgot Password?</Text>
          </View>
          <View style={styles.spacer} />

          <Text style={styles.loginPhno} varient='bold'>Login using phone number</Text>
        </View>
    )
}

export default EnterPassword

const styles = StyleSheet.create({})