import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../../constants/ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      paddingVertical: 16,
      paddingHorizontal: 0,
      backgroundColor: colors.background_primary,
    },
    caption: {
      fontSize: 18,
      color: colors.primary,
      marginBottom: 16,
      paddingHorizontal: 16,
    },
    profileRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
      paddingHorizontal: 16,
    },
    avatarPlaceholder: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: colors.border_3,
      marginRight: 16,
    },
    infoContainer: {
      flex: 1,
    },
    namePlateRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    nameText: {
      fontSize: 16,
      color: colors.contentPrimary,
    },
    dotSeparator: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.contentPrimary,
      marginHorizontal: 8,
    },
    plateText: {
      fontSize: 16,
      color: colors.contentPrimary,
    },
    badgesRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.contentDisabled,
      borderRadius: 12,
      paddingHorizontal: 8,
      paddingVertical: 4,
      gap: 6,
    },
    badgeIcon: {
      width: 16,
      height: 16,
      tintColor: colors.contentSecondary,
    },
    badgeText: {
      fontSize: 12,
      color: colors.contentSecondary,
    },
    aboutSection: {
      marginTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border_2,
    },
    aboutContent: {
      paddingTop: 16,
      paddingHorizontal: 16,
    },
    aboutTitle: {
      fontSize: 14,
      color: colors.primary,
      marginBottom: 8,
    },
    aboutDescription: {
      fontSize: 14,
      color: colors.contentSecondary,
      lineHeight: 20,
    },
  });
