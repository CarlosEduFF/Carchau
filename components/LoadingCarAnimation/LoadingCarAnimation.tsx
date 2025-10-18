import React, { useEffect, useRef } from 'react';
import { Animated, Image, Text, View, StyleSheet } from 'react-native';
import images from '~/constants/images';
import styles from './styles';
type Props = {
  loading: boolean;
  loading2?: boolean; // opcional, caso nem sempre use loading2
};

const LoadingCarAnimation: React.FC<Props> = ({ loading, loading2 = false }) => {
  const translateX = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(translateX, {
          toValue: 100,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: -100,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );

    if (loading || loading2) {
      animation.start();
    }

    return () => {
      animation.stop();
    };
  }, [loading, loading2, translateX]);

  if (!loading && !loading2) return null;

  return (
    <View style={styles.loadingContainer}>
      <Animated.View style={{ transform: [{ translateX }] }}>
        <Image
          style={styles.carlogo}
          source={images.carLogo}
        />
      </Animated.View>
      <Text style={{ color: 'white' }}>Carregando...</Text>
    </View>
  );
};

export default LoadingCarAnimation;

