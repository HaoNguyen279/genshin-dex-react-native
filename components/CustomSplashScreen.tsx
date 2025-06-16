import React from 'react';
import { View, Image, Text, ActivityIndicator, StyleSheet } from 'react-native';

const CustomSplashScreen = () => (
  <View style={styles.container}>
    <Image
      source={require('../assets/gi_dex_icon.png')}
      style={styles.logo}
      resizeMode='contain'
    />
    <Text style={styles.text}>Loading...</Text>
    <ActivityIndicator size="large" color="#00fdff" />
    <Text style={{width:200, color:"white",textAlign:"center"}}>The process may take a while for first-time users!</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1c2e46',
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  text: {
    marginBottom: 20,
    fontSize: 16,
    color: 'white',
  },
});

export default CustomSplashScreen;
