import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import { useStyles } from './HomeScreen.styles'
import { useTheme } from '../../../theme/ThemeProvider';
import HomeScreenHeader from '../../../components/domain/home/SwHeader/HomeScreenHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SwText, SwText as Text } from '../../../components/common/SwText/SwText';
import { useNavigation } from '@react-navigation/native';
import { ImageSource } from '../../../constants/images';
import OptionCard from '../../../components/domain/home/card/OptionCard/OptionCard';

const HomeScreen = () => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const navigation = useNavigation();
  useEffect(() => {
    const renderHeader = () => <HomeScreenHeader />;
    navigation.setOptions({
      headerShown: true,
      header: renderHeader,
    });
  }, [navigation]);
  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
     <View style={{ backgroundColor: colors.primaryLight, paddingHorizontal: 24, paddingBottom: 19}}>
      <SwText style={styles.title}>Choose your commute options</SwText>
      <OptionCard />
     </View>
     <View style={{flex:1, backgroundColor: colors.background_primary, borderTopRightRadius: 30, borderTopLeftRadius: 30}}></View>

    </SafeAreaView>
  )
}

export default HomeScreen

const styles = StyleSheet.create({})