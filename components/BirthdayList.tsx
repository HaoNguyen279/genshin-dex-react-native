import React,  {  useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import * as ScreenOrientation from 'expo-screen-orientation';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { BASE_URL,H_API_KEY } from '@env';
const BirthdayList = () => {
    const navigation : NavigationProp<RootStackParamList> = useNavigation();
    

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{position:'absolute',zIndex:1}}> 
                <Text style={[{fontFamily: 'genshin_font',color:"white",fontSize:18,padding:15}]}> ﹤Back</Text>
            </TouchableOpacity>
            <Text style={styles.welcomeText}>Welcome to</Text>
            <Text style={styles.welcomeText}>Birthday List</Text>
            <Text style={styles.welcomeText}>Test</Text>
            <Text style={styles.welcomeText}>test</Text>
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
    }
});

export default BirthdayList;