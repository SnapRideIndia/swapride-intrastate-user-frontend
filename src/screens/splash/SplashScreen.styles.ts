import { StyleSheet } from 'react-native';
import { ColorsType } from '../../constants/ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: colors.primaryLight
    },
      spalshLogo:{
        width: 196,
        height: 83
      },
      metroGIF:{
        width: 177,
        height: 106,
        color: colors.primaryLight
      },
      cloud:{
        width: 27.75,
        height: 14.8
      },
      customCloud:{
        marginRight: 20
      },
      metro:{
        width: 177,
        height: 106
      }
  });