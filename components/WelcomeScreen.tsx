import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet  } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { Image } from 'expo-image';

// Source nay generate boi Claude, lam bieng lam welcome vl =))

const globalFont = StyleSheet.create({
  fonts: {
    fontFamily: "genshin_font"
  }
});

const WelcomeScreen = () => {

  const [loaded, error] = useFonts({
			'genshin_font': require('../assets/fonts/genshin_font.ttf'),
		});
  useEffect(() =>{
    SplashScreen.preventAutoHideAsync();
  }, []);


	useEffect(() => {
		const hide = async() =>{
			if (loaded === true) {
        await console.log("Loaded successfully");
				await SplashScreen.hideAsync();
        
			}
      else{
        console.log("Loaded failed");
      }
		};
		hide();
		console.log("Loading fonts");
	}, [loaded,error]);

  if(!loaded)
    return null;


  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to</Text>
      <Image 
        source={require("../assets/gi_dex_icon.png")}
        style={styles.image}
      />
      <Text style={styles.authorText}>by Hao Nguyen</Text>
      <Text style={styles.techText}>using React Native - Expo</Text>
      <Image source={require("../assets/png/furina_sticker.webp")} style={{width:100,height:100,marginTop:20}}/>
      <View style={{alignItems:"center", position:"absolute", bottom:"5%"}}>
        <Text style={{marginTop:200}}>To use app, please choose tab below</Text>
        <Text style={{fontSize:30}}>↓↓↓</Text>
      </View>
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F7F0',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontFamily: globalFont.fonts.fontFamily,
    color: '#333333',
    marginBottom: 30,
    textAlign: 'center',
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 30,
    borderRadius: 10,
  },
  authorText: {
    fontSize: 18,
    fontFamily: globalFont.fonts.fontFamily,
    color: '#666666',
    marginBottom: 10,
    textAlign: 'center',
  },
  techText: {
    fontSize: 16,
    fontFamily: globalFont.fonts.fontFamily,
    color: '#888888',
    textAlign: 'center',
  },
});

export default WelcomeScreen;