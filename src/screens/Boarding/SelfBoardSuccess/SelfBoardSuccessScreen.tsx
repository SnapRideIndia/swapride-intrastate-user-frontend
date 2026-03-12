import React from 'react';
import { View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../theme/ThemeProvider';
import { useStyles } from './SelfBoardSuccessScreen.styles';
import PrimaryHeader from '../../../components/common/SwHeader/PrimaryHeader/PrimaryHeader';
import { SwText as Text } from '../../../components/common/SwText/SwText';
import PrimaryButton from '../../../components/common/SwButton/PrimaryButton/PrimaryButton';
import { ImageSource } from '../../../constants/images';
import { RouteProp, useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import type { RootStackParamList } from '../../../navigation/types';
import { ScreenNames } from '../../../navigation/constant';

type SuccessRoute = RouteProp<RootStackParamList, typeof ScreenNames.SELF_BOARD_SUCCESS>;

const SelfBoardSuccessScreen: React.FC = () => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const navigation = useNavigation<any>();
  const route = useRoute<SuccessRoute>();
  const { ticketId, boardingInfo } = route.params;

  const handleViewRide = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          { name: ScreenNames.DASHBOARD_SCREEN },
          { name: ScreenNames.TRACK_RIDE_SCREEN, params: { ticketId } },
        ],
      }),
    );
  };

  const handleBackToTickets = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          { name: ScreenNames.DASHBOARD_SCREEN },
          { name: ScreenNames.TICKETS_SCREEN },
        ],
      }),
    );
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <PrimaryHeader title="" />
      <View style={styles.content}>
        <Image source={ImageSource.checkCircle} style={styles.icon} />
        <Text variant="bold" style={styles.title}>
          Boarding confirmed
        </Text>
        <Text style={styles.subtitle}>
          {boardingInfo?.message || 'You have successfully self-boarded this ride. Have a safe journey!'}
        </Text>
      </View>

      <View style={styles.footer}>
        <PrimaryButton title="View ride" onPress={handleViewRide} btnStyle={styles.primaryBtn} />
        <PrimaryButton
          title="Back to tickets"
          onPress={handleBackToTickets}
          btnStyle={styles.secondaryBtn}
          textStyle={styles.secondaryBtnText}
        />
      </View>
    </SafeAreaView>
  );
};

export default SelfBoardSuccessScreen;
