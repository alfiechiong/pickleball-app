import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import theme from '../styles/theme';

const { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } = theme;

interface SegmentedControlProps {
  values: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
  tintColor?: string;
  textColor?: string;
  activeTextColor?: string;
  backgroundColor?: string;
}

const SegmentedControl: React.FC<SegmentedControlProps> = ({
  values,
  selectedIndex,
  onChange,
  tintColor = COLORS.primary,
  textColor = COLORS.textSecondary,
  activeTextColor = COLORS.white,
  backgroundColor = COLORS.backgroundLight,
}) => {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      {values.map((value, index) => {
        const isSelected = selectedIndex === index;
        return (
          <TouchableOpacity
            key={index}
            style={[styles.segment, isSelected && { backgroundColor: tintColor }]}
            onPress={() => onChange(index)}
            activeOpacity={0.8}
          >
            <Text style={[styles.segmentText, { color: isSelected ? activeTextColor : textColor }]}>
              {value}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    height: 40,
  },
  segment: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.sm,
  },
  segmentText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
});

export default SegmentedControl;
