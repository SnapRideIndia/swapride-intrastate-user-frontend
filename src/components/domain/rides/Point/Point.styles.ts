import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../../constants/ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      paddingVertical: 6,
      paddingHorizontal: 0,
    },
    indicatorColumn: {
      alignItems: 'center',
      marginLeft: 16,
      marginRight: 10,
      width: 10,
    },
    dot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.yellow,
      zIndex: 1,
    },
    dashedLine: {
      flex: 1,
      width: 1,
      borderWidth: 1,
      borderColor: colors.contentDisabled,
      borderStyle: 'dashed',
      marginTop: -2,
    },
    contentColumn: {
      flex: 1,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
      paddingRight: 16,
    },
    timeText: {
      fontSize: 16,
      color: colors.primary,
    },
    directionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.primary,
      borderRadius: 20,
      paddingHorizontal: 12,
      paddingVertical: 4,
      gap: 6,
    },
    directionIcon: {
      width: 16,
      height: 16,
      tintColor: colors.primary,
    },
    directionText: {
      fontSize: 14,
      color: colors.primary,
    },
    title: {
      fontSize: 18,
      color: colors.contentPrimary,
      marginBottom: 20,
      paddingRight: 16,
    },
    description: {
      fontSize: 14,
      color: colors.contentSecondary,
      marginBottom: 16,
      lineHeight: 20,
      paddingRight: 16,
    },
    imagesContainer: {
      flexDirection: 'row',
      gap: 12,
      paddingRight: 16,
    },
    placeholderImage: {
      width: 200,
      height: 140,
      backgroundColor: colors.border_2,
      borderRadius: 16,
    },
  });
