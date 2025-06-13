import React, { useState, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, TouchableOpacity, Text, Platform } from 'react-native';
import DrawerMenu from './DrawerMenu';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.7;
const HEADER_HEIGHT = Platform.OS === 'ios' ? 80 : 60;

export default function DrawerLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const translateX = useRef(new Animated.Value(0)).current;

  const openDrawer = () => {
    setOpen(true);
    Animated.timing(translateX, {
      toValue: DRAWER_WIDTH,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };

  const closeDrawer = () => {
    Animated.timing(translateX, {
      toValue: 0,
      duration: 250,
      useNativeDriver: false,
    }).start(() => setOpen(false));
  };

  // Gesture için eklemeler
  const { PanResponder, PanResponderGestureState } = require('react-native');
  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_: any, gestureState: typeof PanResponderGestureState) => {
        // Sadece drawer açıkken, drawer'ın üstünde ve sağdan sola kaydırma olduğunda tetiklenir
        return (
          open &&
          gestureState.moveX <= DRAWER_WIDTH &&
          gestureState.dx < -10 &&
          Math.abs(gestureState.dy) < 30
        );
      },
      onPanResponderMove: (_: any, gestureState: typeof PanResponderGestureState) => {
        // Drawer'ı parmakla birlikte hareket ettir
        if (gestureState.dx < 0 && gestureState.moveX <= DRAWER_WIDTH) {
          translateX.setValue(DRAWER_WIDTH + gestureState.dx);
        }
      },
      onPanResponderRelease: (_: any, gestureState: typeof PanResponderGestureState) => {
        if (gestureState.dx < -DRAWER_WIDTH / 3) {
          closeDrawer();
        } else {
          // Drawer'ı tekrar açık konuma getir
          Animated.timing(translateX, {
            toValue: DRAWER_WIDTH,
            duration: 200,
            useNativeDriver: false,
          }).start();
        }
      },
      onPanResponderTerminate: () => {
        // Kullanıcı swipe'ı bırakırsa drawer'ı tekrar açık konuma getir
        Animated.timing(translateX, {
          toValue: DRAWER_WIDTH,
          duration: 200,
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  return (
    <View style={{ flex: 1, backgroundColor: '#0d1b2a' }}>
      {/* Drawer */}
      <Animated.View style={[styles.drawer, { left: 0, transform: [{ translateX: Animated.subtract(translateX, DRAWER_WIDTH) }] }]} {...(open ? panResponder.panHandlers : {})}>
        <DrawerMenu onClose={closeDrawer} />
      </Animated.View>
      {/* Overlay: Drawer açıkken arka plana tıklanınca kapansın */}
      {open && (
        <TouchableOpacity
          style={{ position: 'absolute', left: DRAWER_WIDTH, top: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.15)', zIndex: 1 }}
          activeOpacity={1}
          onPress={closeDrawer}
        />
      )}
      {/* Main content with header and page */}
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={open ? closeDrawer : openDrawer} style={styles.menuButton}>
            <View style={styles.menuBar} />
            <View style={styles.menuBar} />
            <View style={styles.menuBar} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Futbolum</Text>
        </View>
        <View style={{ flex: 1 }}>
          {children}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: '#0d1b2a',
    zIndex: 2,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  headerBar: {
    height: 56,
    backgroundColor: '#22223b',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 44 : 24,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ffd700',
    zIndex: 10,
  },
  menuButton: {
    width: 38,
    height: 38,
    backgroundColor: '#ffd700',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuBar: {
    width: 26,
    height: 3,
    backgroundColor: '#22223b',
    marginVertical: 2,
    borderRadius: 2,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#ffd700',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginRight: 38, // To balance hamburger width
  },
});
