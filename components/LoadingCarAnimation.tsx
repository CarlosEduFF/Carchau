import React, { useEffect, useRef } from 'react';
import { Animated, Image, Text, View, StyleSheet } from 'react-native';
import images from '~/constants/images';
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

const styles = StyleSheet.create({
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999, // Garante que estará acima dos outros elementos
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#022036', // cor azul escura, totalmente opaca
  },
  carlogo: {
    width: 50, 
    height: 50, 
  },
});

