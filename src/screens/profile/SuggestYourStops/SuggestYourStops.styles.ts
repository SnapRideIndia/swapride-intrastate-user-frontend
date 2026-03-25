import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../constants/ui/colors/colors.types';

const SCREEN_BG_YELLOW = '#FFFBEB';

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background_primary,
    },
    contentContainerStyle: {
      paddingVertical: 24,
      paddingHorizontal: 16,
      backgroundColor: colors.background_primary,
    },
    keyboardAwareScrollContainer: {
      flexGrow: 1,
      paddingVertical: 24,
      paddingHorizontal: 16,
      backgroundColor: colors.background_primary,
    },
    cardContainer: {
      paddingVertical: 24,
      paddingHorizontal: 24,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border_2,
      backgroundColor: colors.background_primary,
      elevation: 1,
    },
    rowGap10: {
      flexDirection: 'row',
      gap: 10,
    },
    flex1Gap16: {
      flex: 1,
      gap: 20,
    },
    sectionTop24: {
      marginTop: 24,
    },
    slotRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 36,
      marginTop: 16,
    },
    reachingTimeWrap: {
      marginTop: 24,
    },
    reachingTimeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    reachingTimeTitle: {
      color: colors.contentPrimary,
      fontSize: 14,
      fontWeight: '600',
    },
    reachingTimeInput: {
      marginTop: 8,
      paddingBottom: 4,
      borderBottomWidth: 1,
      borderColor: colors.border_2,
      alignSelf: 'flex-start',
      minWidth: 100,
    },
    reachingTimeValue: {
      color: colors.contentPrimary,
      fontSize: 14,
    },
    reachingTimeValuePlaceholder: {
      color: colors.contenttertiary,
      fontSize: 14,
    },
    checkboxRow: {
      marginTop: 24,
      flexDirection: 'row',
      width: 284,
      gap: 10,
    },
    descriptionWrap: {
      marginTop: 28,
    },
    submitWrap: {
      marginTop: 48,
    },
    selectShiftText: {
      color: colors.contentPrimary,
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    optionText: {
      color: colors.contentPrimary,
    },
    checkCircle: {
      width: 18,
      height: 18,
    },
    clockIcon: {
      width: 13,
      height: 13,
    },
    checkSquare: {
      width: 18,
      height: 18,
      marginTop: 5,
      tintColor: '#2B6D1C',
    },
    descriptionInput: {
      borderWidth: 1,
      height: 162,
      borderRadius: 15,
      paddingHorizontal: 24,
      paddingVertical: 20,
      textAlignVertical: 'top',
      backgroundColor: colors.background_primary,
      borderColor: colors.border_2,
      color: colors.contentPrimary,
    },
    submitButton: {
      height: 45,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius: 4,
    },
    viewMySuggestionsWrap: {
      marginTop: 24,
      marginBottom: 24,
    },
    viewMySuggestionsButton: {
      height: 45,
      backgroundColor: colors.primaryLight,
      elevation: 1,
    },
    viewMySuggestionsButtonText: {
      color: colors.primaryCtaText,
      
    },
  });
