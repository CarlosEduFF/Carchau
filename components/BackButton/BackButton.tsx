import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';

interface BackButtonProps {
  onPress?: () => void;
  color?: string;
  label?: string;
  showLabel?: boolean;
}

const BackButton: React.FC<BackButtonProps> = ({ 
  onPress, 
  color = colors.amareloClaro, 
  label = 'Voltar',
  showLabel = true 
}) => {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      if (router.canGoBack()) {
        router.back();
      } else {
        // Fallback to home if there's no history (though with my fixes there should be)
        router.replace('/(tabs)/home');
      }
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Ionicons name="chevron-back" size={28} color={color} />
      {showLabel && <Text style={[styles.label, { color }]}>{label}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    zIndex: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: -4,
  },
});

export default BackButton;
