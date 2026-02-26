import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '../../../../theme/ThemeProvider'
import { useStyles } from './PrimaryHeader.styles'
import { ImageSource } from '../../../../constants/images'
import { SwText as Text } from '../../SwText/SwText'
import { useNavigation } from '@react-navigation/native'

interface IHeaderProps{
    title: string,
    showBackButton?: boolean,
    onBackPress?: ()=>void,
    onBackBtnPress?: ()=>void,
    onEdit?:()=>void
}

const PrimaryHeader = ({title, onBackBtnPress, onEdit}:IHeaderProps) => {
    const {colors} = useTheme();
    const styles = useStyles(colors);
    const navigation = useNavigation();

    const handleBackPress = ()=>{
      navigation.goBack();
    }

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
        <View style={styles.headerInnerContainer}>
          <TouchableOpacity onPress={onBackBtnPress ?? handleBackPress}>
              <Image source={ImageSource.leftArrow} style={styles.backArrow} />
          </TouchableOpacity>
           <Text varient='medium' style={styles.title}>{title}</Text>
        </View>

        <View style={styles.iconContainer}>
          {
            onEdit && <TouchableOpacity onPress={onEdit}>
            <Image source={ImageSource.edit} style={styles.editIcon}/>
            </TouchableOpacity>
          }
        </View>
    </SafeAreaView>
  )
}

export default PrimaryHeader

const styles = StyleSheet.create({})