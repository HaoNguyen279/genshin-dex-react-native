import React,  {  useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import * as ScreenOrientation from 'expo-screen-orientation';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { BASE_URL,H_API_KEY } from '@env';
const WelcomeScreen = () => {
    const navigation : NavigationProp<RootStackParamList> = useNavigation();
    const [name,setName] = useState('');
    useEffect(() => {
        const unsubcribe = navigation.addListener('focus', async () =>{
            await ScreenOrientation.getOrientationAsync()
                .then(async (orientation) =>{
                    console.log("Current orientation: ", orientation);
                    if((orientation === 1 || orientation === 2)) return;
                    await ScreenOrientation.unlockAsync();
                    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);  
                    console.log("Current orientation: ", orientation);
                });
        })
        return unsubcribe;
    }, [navigation]);

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
                <Text>{name}</Text>
                <Text style={{fontSize:30}}>↓↓↓</Text>
            </View>
        </View>
    );
    };

const globalFont = StyleSheet.create({
  fonts: {
    fontFamily: "genshin_font"
  }
});

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