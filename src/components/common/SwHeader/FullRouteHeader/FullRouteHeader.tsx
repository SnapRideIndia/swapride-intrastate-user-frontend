import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../../theme/ThemeProvider';
import { ImageSource } from '../../../../constants/images';
import { SwText as Text } from '../../SwText/SwText';
import { useStyles } from './FullRouteHeader.styles';

type Props = {
  title: string;
  onClose?: () => void;
};

const FullRouteHeader = ({ title, onClose }: Props) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const navigation = useNavigation();

  const handleClose = () => {
    if (onClose) return onClose();
    navigation.goBack();
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.inner}>
        <Text varient="medium" style={styles.title}>
          {title}
        </Text>
        <TouchableOpacity onPress={handleClose} hitSlop={10} activeOpacity={0.7}>
          <Image source={ImageSource.cross} style={styles.closeIcon} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default FullRouteHeader;

