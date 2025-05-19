import FontAwesome from '@expo/vector-icons/FontAwesome';
import { forwardRef } from 'react';
import { Pressable, StyleSheet } from 'react-native';

export const HeaderButton = forwardRef<typeof Pressable, { onPress?: () => void }>(
  ({ onPress }, ref) => {
    return (
      <Pressable onPress={onPress}>
        {({ pressed }) => (
          <FontAwesome
            name="arrow-left"
            size={25}
            color="white"
            style={[
              styles.headerRight,
              {
                opacity: pressed ? 0.5 : 1,
              },
            ]}
          />
        )}
      </Pressable>
    );
  }
);

export const styles = StyleSheet.create({
  headerRight: {
    marginRight: 15,
  },
});
