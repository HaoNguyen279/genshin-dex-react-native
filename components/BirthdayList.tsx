import React,  {  use, useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, SectionList, TextInput } from 'react-native';
import { Image } from 'expo-image';
import { NavigationProp, StackActions, useNavigation } from '@react-navigation/native';
import { getBirthDayListSortedByDay } from '../utils/utils';
import data from '../assets/data/character.json';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';


const listData = getBirthDayListSortedByDay(data).groupedArray;
const listCharacterBirthDayData = getBirthDayListSortedByDay(data).mappedArray;

const {width , height} = Dimensions.get('window');

interface DataListProp {
    month: string;
    data: {
        name: string;
        birthday: string;
        url_icon: string;
    }[];
}
interface CharacterBirthdayProp {
    name: string;
     birthday: string;
    url_icon: string;
}

const BirthdayList = () => {
    const navigation : NavigationProp<RootStackParamList> = useNavigation();
    const [searchText, setSearchText] = useState('');
    const [isShowingDefaultSectionList, setIsShowingDefaultSectionList] = useState(true);
    const [filteredData, setFilteredData] = useState<CharacterBirthdayProp[]>([]);
    const [isWaiting, setIsWaiting] = useState(false);
    const [characterListFiltered, setcharacterListFiltered] = useState(listCharacterBirthDayData);

    const handleSearch = useCallback(() =>{
        if(searchText === ""){
            setIsShowingDefaultSectionList(true);
            return;
        }

        const filtered = characterListFiltered.filter(item => item.name.toLowerCase().includes(searchText.toLowerCase()));
        setFilteredData(filtered);
        var time;
        
        if(!isWaiting){
            setIsWaiting(true);
            time = setTimeout(() => {
                setIsShowingDefaultSectionList(false);
            }, 2000);
        }
    },[searchText,isWaiting,characterListFiltered]);
    useEffect(() => {
        setFilteredData(characterListFiltered);  
        
    }, []);
    // Nguyên đoạn củ L này thay bằng popToTopOnBlur: true của react stack screen + navigatiọn
    // useEffect(() =>{
    //     const unsubscribe = navigation.addListener('blur', () => {
    //         navigation.dispatch(
    //             StackActions.replace('Welcome')
    //         );
    //     });
    //     return unsubscribe;
    // },[navigation])
    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{zIndex:1, position:"absolute", top:0, left:0, padding:10}}> 
                        <Text style={[{fontFamily: 'genshin_font',color:"rgba(97, 97, 97, 1)",fontSize:18,padding:5}]}> ﹤Back</Text>
                    </TouchableOpacity>
                    <View style={{ padding: 15 }}>
                        <View style={{flexDirection:"row", alignItems:"center", justifyContent:"center", alignContent:"center",marginVertical:5}}>

                            <Text style={styles.welcomeText}>Birthday List</Text>
                        </View>
                        <TextInput 
                            value={searchText}
                            onChangeText={text => {
                                setSearchText(text);
                                handleSearch();
                            }}
                            placeholder='Search'
                            style={styles.search_input}
                        />
                    </View>
                    {isShowingDefaultSectionList ? (
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
                    ) : (
                        <View>
                            <Text>Search result: {searchText}</Text>
                            <FlatList
                                data={filteredData}
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
                            />
                        </View>
                    )}
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
        fontSize: 20,
        fontFamily: "genshin_font",
        color: '#455252ff',
        textAlign: 'center',
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
    search_input:{
        borderWidth:1,
        borderColor:'#ccc',
        borderRadius:8,
        padding:10, 
        fontFamily:'genshin_font', 
        color:'#455252ff',
        width: width - width*0.2 
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