// export interface IPlaceAutofill {
//   id: string
//   title: string
//   subtitle: string
//   iconSource: number
//   latitude: number
//   longitude: number
// }

import { ImageSourcePropType } from "react-native";


export type SwLocationSearchItem = {
  id: string;
  title: string;
  subtitle?: string;
  iconSource?: ImageSourcePropType;
  latitude?: number;
  longitude?: number;
};