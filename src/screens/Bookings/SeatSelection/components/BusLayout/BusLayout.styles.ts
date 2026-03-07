import { StyleSheet } from 'react-native';

export const useStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background_primary,
      borderRadius: 24,
      width: '94%',
      alignSelf: 'center',
      marginTop: 20,
      paddingTop: 0,
      paddingBottom: 24,
      elevation: 2,
      overflow: 'hidden',
    },
    headerRow: {
      flexDirection: 'row',
      backgroundColor: colors.background_gray,
      paddingVertical: 4,
      paddingLeft: 32,
      paddingRight: 0,
      width: '100%',
      marginBottom: 16,
    },
    headerLabel: {
      fontSize: 12,
      color: colors.contentSecondary,
      flex: 1,
      textAlign: 'center',
    },
    grid: {
      width: '100%',
      paddingLeft: 32,
      paddingRight: 0,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    column: {
      flex: 1,
      alignItems: 'center',
      paddingBottom: 8,
    },
    aisle: {
      maxWidth: 20,
    },
    sideIndicatorContainer: {
      position: 'absolute',
      right: 0,
      top: 120,
      bottom: 24,
      width: 24,
      backgroundColor: colors.background_gray,
      borderTopLeftRadius: 16,
      borderBottomLeftRadius: 16,
      zIndex: -1,
    },
    sideIndicator: {
      width: 24,
      alignSelf: 'stretch',
      alignItems: 'center',
      justifyContent: 'center',
    },
    sideIndicatorText: {
      fontSize: 11,
      color: colors.contentSecondary,
    },
  });
