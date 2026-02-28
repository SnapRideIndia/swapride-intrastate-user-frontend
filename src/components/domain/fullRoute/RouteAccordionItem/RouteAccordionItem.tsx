import React, { useMemo } from 'react';
import { Image, ScrollView, TouchableOpacity, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from 'react-native-reanimated';
import { useTheme } from '../../../../theme/ThemeProvider';
import { SwText as Text } from '../../../common/SwText/SwText';
import { ImageSource } from '../../../../constants/images';
import { useStyles } from './RouteAccordionItem.styles';

export type RouteStepKind = 'normal' | 'walk' | 'pickup' | 'dropoff';

export type RouteAccordionStep = {
  id: string;
  kind: RouteStepKind;
  title: string;
  subtitle?: string;
  label?: string; // e.g. "Pickup Stop"
  description?: string;
  showDirectionsCta?: boolean;
  previewCardsCount?: number; // grey placeholders in figma
};

type Props = {
  step: RouteAccordionStep;
  isOpen: boolean;
  isFirst: boolean;
  isLast: boolean;
  onToggle: () => void;
};

const RouteAccordionItem = ({ step, isOpen, isFirst, isLast, onToggle }: Props) => {
  const { colors } = useTheme();
  const styles = useStyles(colors, step.kind);

  const hasBody = Boolean(step.description || step.previewCardsCount);

  const chevronStyle = useMemo(
    () => [styles.chevron, isOpen && styles.chevronOpen],
    [isOpen, styles.chevron, styles.chevronOpen]
  );

  return (
    <Animated.View style={styles.container} layout={LinearTransition.duration(180)}>
      <View style={styles.timeline}>
        {!isFirst && <View style={styles.upperConnector} />}
        {!isLast && <View style={styles.lowerConnector} />}
        <View style={styles.dot} />
      </View>

      <View style={styles.content}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={hasBody ? onToggle : undefined}
          style={styles.headerRow}
        >
          <View style={styles.headerTextCol}>
            {step.label ? (
              <Text varient="semi-bold" style={styles.label}>
                {step.label}
              </Text>
            ) : null}
            <View style={{ flexDirection: "row", alignItems: "center", gap: 21 }}>
              <Text varient="medium" style={styles.title} numberOfLines={1}>
                {step.title}
              </Text>

              {step.showDirectionsCta && isOpen ? (
                <TouchableOpacity activeOpacity={0.85} style={styles.directionsBtn}>
                  <Image source={ImageSource.direction} style={styles.directionsIcon} />
                  <Text varient="medium" style={styles.directionsText}>
                    Directions
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
            {step.subtitle ? (
              <Text varient="medium" style={styles.subtitle} numberOfLines={1}>
                {step.subtitle}
              </Text>
            ) : null}
          </View>

          <View style={styles.headerRightCol}>


            <Image source={ImageSource.downArrow} style={chevronStyle as any} />
          </View>
        </TouchableOpacity>

        {isOpen && hasBody ? (
          <Animated.View
            entering={FadeIn.duration(120)}
            exiting={FadeOut.duration(120)}
            style={styles.body}
          >
            {step.description ? (
              <Text varient="medium" style={styles.description}>
                {step.description}
              </Text>
            ) : null}

            {step.previewCardsCount ? (
              <ScrollView contentContainerStyle={{flexGrow: 1, flexDirection: "row", gap: 20}} style={styles.previewRow} showsHorizontalScrollIndicator={false}>
                {Array.from({ length: step.previewCardsCount }).map((_, idx) => (
                  <View key={`${step.id}-preview-${idx}`} style={styles.previewCard} />
                ))}
              </ScrollView>
            ) : null}
          </Animated.View>
        ) : null}
      </View>
    </Animated.View>
  );
};

export default RouteAccordionItem;

