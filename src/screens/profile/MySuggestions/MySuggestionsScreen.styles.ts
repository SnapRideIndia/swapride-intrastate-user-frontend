import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../constants/ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background_primary,
    },
    scrollWrap: {
      flex: 1,
      minHeight: 0,
    },
    scrollView: {
      flex: 1,
    },
    contentContainer: {
      flexGrow: 1,
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 24,
    },
    card: {
      backgroundColor: colors.background_primary,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border_2,
      paddingHorizontal: 18,
      paddingVertical: 14,
      marginBottom: 14,
      elevation: 1,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 3,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    routeWrap: {
      flex: 1,
      marginRight: 8,
      flexDirection: 'row',
    },
    routeDotsColumn: {
      alignItems: 'center',
      marginRight: 8,
      paddingVertical: 2,
    },
    routeTextColumn: {
      flex: 1,
      justifyContent: 'space-between',
      gap: 8,
    },
    routeDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.primaryLight,
    },
    routeConnector: {
      width: 2,
      flex: 1,
      marginVertical: 2,
      borderRadius: 1,
      backgroundColor: colors.border_2,
    },
    routeDotEnd: {
      backgroundColor: colors.secondary,
    },
    routeText: {
      fontSize: 14,
      color: colors.contentPrimary,
      flex: 1,
    },
    deleteButton: {
      padding: 4,
    },
    deleteButtonText: {
      fontSize: 13,
      color: colors.contentRed,
      fontWeight: '600',
    },
    metaRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border_2,
    },
    metaChip: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
      backgroundColor: colors.background_secondary,
    },
    metaChipText: {
      fontSize: 12,
      color: colors.contentSecondary,
      marginLeft: 4,
    },
    statusChip: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
      alignSelf: 'flex-start',
    },
    statusPending: {
      backgroundColor: colors.background_lightBlue,
    },
    statusReviewed: {
      backgroundColor: colors.background_lightBlue,
    },
    statusImplemented: {
      backgroundColor: colors.background_success_light,
    },
    statusRejected: {
      backgroundColor: '#FEE2E2',
    },
    statusText: {
      fontSize: 12,
      fontWeight: '600',
    },
    descriptionContainer: {
      marginTop: 10,
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 12,
      backgroundColor: colors.background_gray,
    },
    descriptionText: {
      fontSize: 13,
      color: colors.contentSecondary,
      fontStyle: 'italic',
    },
    cardButtonsRow: {
      flexDirection: 'row',
      gap: 8,
      marginTop: 12,
    },
    cardButton: {
      flex: 1,
      height: 45,
      borderRadius: 12,
      elevation: 1,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 2,
    },
    cardDeleteButton: {
      backgroundColor: '#FEE2E2',
    },
    cardDeleteButtonText: {
      color: '#B91C1C',
    },
    cardViewMapButton: {
      backgroundColor: colors.primaryLight,
    },
    cardViewMapButtonText: {
      color: colors.primaryCtaText,
    },
    deleteModalContent: {
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
    },
    deleteModalMessage: {
      fontSize: 14,
      color: colors.contentSecondary,
      textAlign: 'center',
      lineHeight: 20,
      marginTop: 8,
      marginBottom: 24,
    },
    deleteModalButtonRow: {
      flexDirection: 'row',
      gap: 8,
      justifyContent: 'center',
      alignSelf: 'stretch',
      marginTop: 4,
    },
    deleteModalCancelButton: {
      flex: 1,
      height: 44,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.primaryLight,
      backgroundColor: colors.background_primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    deleteModalCancelText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.primaryLight,
    },
    deleteModalDeleteButton: {
      flex: 1,
      height: 44,
      borderRadius: 12,
      backgroundColor: '#EF4444',
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 2,
      shadowColor: '#000',
      shadowOpacity: 0.15,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
    },
    deleteModalDeleteText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
    },
  });
