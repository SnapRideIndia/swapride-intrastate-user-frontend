import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../theme/ThemeProvider';
import FullRouteHeader from '../../../components/common/SwHeader/FullRouteHeader/FullRouteHeader';
import RouteAccordionItem, {
  RouteAccordionStep,
} from '../../../components/domain/fullRoute/RouteAccordionItem/RouteAccordionItem';
import { useStyles } from './FullRouteScreen.styles';

const FullRouteScreen = () => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const navigation = useNavigation();

  const steps: RouteAccordionStep[] = useMemo(
    () => [
      { id: 's1', kind: 'normal', title: 'Wokoli' },
      { id: 's2', kind: 'walk', title: 'Wakal' },
      { id: 's3', kind: 'normal', title: 'Wakal' },
      {
        id: 's4',
        kind: 'pickup',
        label: 'Pickup Stop',
        title: 'Peninsula Corporate Park',
        subtitle: '',
      },
      { id: 's5', kind: 'normal', title: 'Wakal' },
      {
        id: 's6',
        kind: 'dropoff',
        label: 'Dropoff Stop',
        title: 'Peninsula Corporate Park',
        showDirectionsCta: true,
        description:
          'in front of Mini eStore, under the fly over',
        previewCardsCount: 2,
      },
      { id: 's7', kind: 'normal', title: 'Wokoli' },
      { id: 's8', kind: 'normal', title: 'Wokoli' },
    ],
    []
  );

  const [openId, setOpenId] = useState<string>('s6');

  useEffect(() => {
    const renderHeader = () => <FullRouteHeader title="Full Route" />;
    navigation.setOptions({
      headerShown: true,
      header: renderHeader,
    });
  }, [navigation]);

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.list}>
          {steps.map((step, index) => (
            <RouteAccordionItem
              key={step.id}
              step={step}
              isOpen={openId === step.id}
              isFirst={index === 0}
              isLast={index === steps.length - 1}
              onToggle={() => setOpenId((prev) => (prev === step.id ? '' : step.id))}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FullRouteScreen;

