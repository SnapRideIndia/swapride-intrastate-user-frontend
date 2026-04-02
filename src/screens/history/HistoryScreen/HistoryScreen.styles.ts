import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../constants/ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background_primary,
    },
    contentContainerStyle: {
      flexGrow: 1,
      paddingHorizontal: 16,
      paddingBottom: 16,
      gap: 16,
    },
    searchRow: {
      paddingHorizontal: 16,
      marginTop: 16,
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    searchInputContainer: {
      flex: 1,
    },
    searchInput: {
      height: 48,
     
      borderColor: colors.border_2,
    },
    dateButton: {
      width: 48,
      height: 48,
  
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border_2,
    },
    dateIcon: {
      width: 22,
      height: 22,
      tintColor: colors.contentPrimary,
    },
  });
