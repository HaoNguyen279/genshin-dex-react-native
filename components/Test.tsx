import React, { useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';

const PARTICLE_COLOR = '#c55bda';

interface PulseParticlesProps {
  isActive?: boolean;
  particleCount?: number;
}

const PulseParticles: React.FC<PulseParticlesProps> = ({ 
  isActive = true, 
  particleCount = 8
}) => {
  const particles = useRef(
    Array.from({ length: particleCount }, (_, index) => {
      const translateX = useSharedValue(0);
      const translateY = useSharedValue(0);
      const opacity = useSharedValue(0);
      const scale = useSharedValue(0);

      return {
        id: index,
        translateX,
        translateY,
        opacity,
        scale,
        angle: (360 / particleCount) * index, // Phân bố đều theo vòng tròn
        animatedStyle: useAnimatedStyle(() => ({
          transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { scale: scale.value },
          ],
          opacity: opacity.value,
        })),
      };
    })
  ).current;

  const animateWave = useCallback(() => {
    particles.forEach((particle, index) => {
      const delay = index * 150; // Delay giữa các particle
      const distance = 60 + Math.random() * 40;
      const duration = 2000;

      const endX = Math.cos(particle.angle * Math.PI / 180) * distance;
      const endY = Math.sin(particle.angle * Math.PI / 180) * distance;

      // Reset
      particle.translateX.value = 0;
      particle.translateY.value = 0;
      particle.opacity.value = 0;
      particle.scale.value = 0;

      // Animate out
      particle.opacity.value = withDelay(delay, 
        withSequence(
          withTiming(1, { duration: 400, easing: Easing.out(Easing.quad) }),
          withTiming(0, { duration: 1600, easing: Easing.in(Easing.quad) })
        )
      );

      particle.scale.value = withDelay(delay,
        withSequence(
          withTiming(1.2, { duration: 300, easing: Easing.out(Easing.back(1.2)) }),
          withTiming(0.8, { duration: 1700, easing: Easing.in(Easing.quad) })
        )
      );

      particle.translateX.value = withDelay(delay,
        withTiming(endX, { duration: duration, easing: Easing.out(Easing.quad) })
      );

      particle.translateY.value = withDelay(delay,
        withTiming(endY, { duration: duration, easing: Easing.out(Easing.quad) })
      );
    });
  }, []);

  useEffect(() => {
    if (!isActive) return;

    const startLoop = () => {
      animateWave();
      return setInterval(animateWave, 3000); // Lặp mỗi 3 giây
    };

    const intervalId = startLoop();

    return () => {
      clearInterval(intervalId);
    };
  }, [isActive, animateWave]);

  if (!isActive) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {particles.map((particle) => (
        <Animated.View
          key={particle.id}
          style={[
            styles.particle,
            { backgroundColor: PARTICLE_COLOR },
            particle.animatedStyle,
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  particle: {
    position: 'absolute',
    width: 5,
    height: 5,
    borderRadius: 2.5,
    shadowColor: PARTICLE_COLOR,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 3,
    elevation: 8,
  },
});

export default PulseParticles;