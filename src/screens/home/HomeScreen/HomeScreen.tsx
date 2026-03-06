import { ScrollView, View } from 'react-native';
import React, { useEffect } from 'react';
import { useStyles } from './HomeScreen.styles';
import { useTheme } from '../../../theme/ThemeProvider';
import HomeScreenHeader from '../../../components/domain/home/SwHeader/HomeScreenHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SwText as Text } from '../../../components/common/SwText/SwText';
import { useNavigation } from '@react-navigation/native';
import OptionCard from '../../../components/domain/home/card/OptionCard/OptionCard';
import { ImageSource } from '../../../constants/images';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { ScreenNames } from '../../../navigation/constant';

const HomeScreen = () => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const navigation = useNavigation();
  const { profileData } = useSelector((store: RootState) => store.profile);

  console.log("this is profile data ===>", profileData);


  const handlePressOptionCard = (type: 'shuttel' | 'wallet' | 'ticket') => {
    switch (type) {
      case 'shuttel':
        navigation.navigate(ScreenNames.SET_COMMUTE as never);
        break;

      case 'wallet':
        navigation.navigate(ScreenNames.WALLET_SCREEN as never);
        break;

      default:
        navigation.navigate(ScreenNames.TICKET_DETAIL_SCREEN as never);
        break;
    }
  };

  useEffect(() => {
    const renderHeader = () => <HomeScreenHeader />;
    navigation.setOptions({
      headerShown: true,
      header: renderHeader,
    });
  }, [navigation]);

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainerStyle}>
        <View style={styles.upperSection}>
          <Text style={styles.title}>Choose your commute options</Text>
          <OptionCard imgUri={ImageSource.shuttel} title="Shuttle" onPress={() => handlePressOptionCard('shuttel')} />
        </View>
        <View style={styles.lowerSection}>
          <Text style={styles.optionCardContainerTitle} varient="semi-bold">
            Your Active Wallet
          </Text>
          <View style={styles.optionCardContainer}>
            <OptionCard imgUri={ImageSource.ticket} title="Tickets" onPress={() => handlePressOptionCard('ticket')} />
            <OptionCard imgUri={ImageSource.wallet} title="Wallet" onPress={() => handlePressOptionCard('wallet')} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
