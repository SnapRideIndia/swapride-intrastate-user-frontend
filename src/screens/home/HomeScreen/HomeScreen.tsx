import { ScrollView, StyleSheet, View } from 'react-native'
import React, { useEffect } from 'react'
import { useStyles } from './HomeScreen.styles'
import { useTheme } from '../../../theme/ThemeProvider';
import HomeScreenHeader from '../../../components/domain/home/SwHeader/HomeScreenHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SwText as Text } from '../../../components/common/SwText/SwText';
import { useNavigation } from '@react-navigation/native';
import OptionCard from '../../../components/domain/home/card/OptionCard/OptionCard';
import { ImageSource } from '../../../constants/images';

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
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainerStyle}>
        <View style={styles.upperSection}>
          <Text style={styles.title}>Choose your commute options</Text>
          <OptionCard imgUri={ImageSource.shuttel} title='Shuttle' />
        </View>
        <View style={styles.lowerSection}>
          <Text style={styles.optionCardContainerTitle} varient='semi-bold'>Your Active Wallet</Text>
          <View style={styles.optionCardContainer}>
            <OptionCard imgUri={ImageSource.ticket} title='Tickets' />
            <OptionCard imgUri={ImageSource.wallet} title='Wallet' />
          </View>
        </View>
      </ScrollView>

    </SafeAreaView>
  )
}

export default HomeScreen;