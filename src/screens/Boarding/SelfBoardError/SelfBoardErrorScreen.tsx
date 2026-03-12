import React from 'react';
import { View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../theme/ThemeProvider';
import { useStyles } from './SelfBoardErrorScreen.styles';
import PrimaryHeader from '../../../components/common/SwHeader/PrimaryHeader/PrimaryHeader';
import { SwText as Text } from '../../../components/common/SwText/SwText';
import PrimaryButton from '../../../components/common/SwButton/PrimaryButton/PrimaryButton';
import { ImageSource } from '../../../constants/images';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { RootStackParamList } from '../../../navigation/types';
import { ScreenNames } from '../../../navigation/constant';

type ErrorRoute = RouteProp<RootStackParamList, typeof ScreenNames.SELF_BOARD_ERROR>;

const SelfBoardErrorScreen: React.FC = () => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const navigation = useNavigation<any>();
  const route = useRoute<ErrorRoute>();
  const { ticketId, message } = route.params;

  const handleTryAgain = () => {
    navigation.replace(ScreenNames.SELF_BOARD_SCANNER, { ticketId });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const displayMessage =
    message || 'We could not confirm your boarding. Please check the bus QR and try again.';

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <PrimaryHeader title="" />
      <View style={styles.content}>
        <View style={styles.iconWrapper}>
          <Image source={ImageSource.cross} style={styles.icon} />
        </View>
        <Text variant="bold" style={styles.title}>
          Unable to confirm boarding
        </Text>
        <Text style={styles.subtitle}>{displayMessage}</Text>
      </View>

      <View style={styles.footer}>
        <PrimaryButton title="Try again" onPress={handleTryAgain} btnStyle={styles.primaryBtn} />
        <PrimaryButton
          title="Back"
          onPress={handleBack}
          btnStyle={styles.secondaryBtn}
          textStyle={styles.secondaryBtnText}
        />
      </View>
    </SafeAreaView>
  );
};

export default SelfBoardErrorScreen;
