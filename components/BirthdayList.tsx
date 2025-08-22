import React,  {  use, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, SectionList } from 'react-native';
import { Image } from 'expo-image';
import * as ScreenOrientation from 'expo-screen-orientation';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { BASE_URL,H_API_KEY } from '@env';
import { getBirthDayListSortedByDay } from '../utils/utils';
import data from '../assets/data/character.json';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const listData = getBirthDayListSortedByDay(data);
const {width , height} = Dimensions.get('window');

const BirthdayList = () => {
    const navigation : NavigationProp<RootStackParamList> = useNavigation();
    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{position:'absolute',zIndex:1}}> 
                        <Text style={[{fontFamily: 'genshin_font',color:"white",fontSize:18,padding:15}]}> ﹤Back</Text>
                    </TouchableOpacity>
                    <Text style={styles.welcomeText}>Birthday List</Text>
                    <SectionList
                        sections={listData}
                        renderItem={({ item }) => (
                            <View style={styles.card_container}>
                                <View style={{marginHorizontal:10}}>
                                    <Text style={{ fontFamily: "genshin_font", color: '#455252ff', fontSize: 18 }}>{item.name}</Text>
                                    <Text style={{ fontFamily: "genshin_font", color: '#455252ff', fontSize: 14 }}>{item.birthday}</Text>
                                </View>
                                <View>
                                    <Image source={{ uri: item.url_icon }} style={{ width: 50, height: 50, marginRight:10}} />
                                </View>
                            </View>
                        )}
                        renderSectionHeader={({ section: { month } }) => (
                            <Text style={styles.sectionHeader}>{month}</Text>
                        )}
                    />
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
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
        fontFamily: "genshin_font",
        color: '#455252ff',
        marginBottom: 30,
        textAlign: 'center',
        marginVertical:5
    },
    sectionHeader:{
        fontSize: 24,
        fontFamily: "genshin_font",
        color: '#1b2727ff',
        marginBottom: 10,
        textAlign: 'left',
        marginVertical:5,
        width: width - 50,
    },
    card_container:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        width: width - 50,
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    }
});

export default BirthdayList;