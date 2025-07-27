import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { View, FlatList, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, TextInput, Pressable, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {Image} from "expo-image";

import CustomSplashScreen from "./splashscreen/CustomSplashScreen";
import data from '../assets/data/character.json';
import { scale, verticalScale } from "react-native-size-matters";
import { useFonts } from "expo-font";
const Tab = createBottomTabNavigator();

const preload_icon_list = data.map( item => item.url_icon);

type RenderListProps = {
    navigation : NavigationProp<RootStackParamList>;
    // data_render : NonNullable<RootStackParamList["Images"]>    
    search_text : string
}
const RenderList : React.FC<RenderListProps> = ({navigation,search_text})=>{
    return(
            <View style={styles.list}>
                    <FlatList 
                        data={data.filter(item => item.name.toLowerCase().includes(search_text.toLowerCase()))}   
                        numColumns={3}
                        renderItem={({item}) =>{
                            return(
                                <TouchableOpacity onPress={() => navigation.navigate("Images", item)}>
                                        <View style={[getBackgroundFrame(item.rarity).background,styles.box]}>
                                            <Image
                                                source={{uri:item.url_icon}}
                                                style={styles.icon}
                                                priority={"high"}
                                            />
                                            <Text style={[styles.text]}>{item.name}</Text>
                                        </View>
                                </TouchableOpacity>
                            )
                        }}
                        ListEmptyComponent={() =>(
                            <View style={{alignItems:"center", marginTop:200}}>
                                <Text>The world is wide, try to search something else</Text>
                                <Image source={require("../assets/png/qiqi_sticker.webp")} style={{width:100, height:100}}/>
                            </View>
                        )}
                        keyExtractor={ (item) => item.id.toString()}
                    >
                    </FlatList>
                </View>
    )
}

const getBackgroundFrame = (rarity :number) =>{
    return StyleSheet.create({
        background:{
            backgroundColor: rarity === 5 ? 'rgb(184, 133, 81)' : 'rgb(116, 98, 153)',
        }
    })
}


export function Home(){
    const navigation : NavigationProp<RootStackParamList> = useNavigation();
    const [searchText,setSearchText]  = useState("");
    const [loading,setLoading] = useState(true);
    const searchInputRef = useRef<TextInput>(null);
    const clearSearchText = () =>{
        if(searchInputRef != null)
            searchInputRef.current?.clear();
    }
    const [loaded,error] = useFonts({
        'montserrat': require("../assets/fonts/Montserrat-VariableFont_wght.ttf"),
    });
    const [fontsLoaded, setFontsLoaded] = useFonts({
        'montserrat-semi-bold': require('../assets/fonts/Montserrat-SemiBold.ttf'),
    });

    useEffect(() =>{
        const preload_url = async () =>{
            await Promise.all(preload_icon_list.map( url_icon => Image.prefetch(url_icon)))
            .then(() => console.log("Successfully preloaded url icon!"))
            .catch(err => console.warn("Failed to preload url icon :" + err))
            setLoading(false);
        }
        preload_url();
    })
    if(loading) return <CustomSplashScreen/>

    return(
        <SafeAreaView style={{backgroundColor:"#f4f4f4ff", flex:1}}>
            <View style={styles.search_bar}>
                <TextInput
                    ref={searchInputRef}
                    style= {styles.search_input}
                    placeholder='Search'
                    onChangeText={setSearchText}
                    keyboardType='default'
                /> 
                <Pressable
                    style={({pressed}) =>([styles.x_button, {backgroundColor : pressed ? "#e3e3e3" : "transparent"}])}
                    onPress={()=> { setSearchText("");  clearSearchText(); }}>
                    <Image
                        style={{width:30,height:30,margin:"auto"}}
                        source={require("../assets/png/search_icon.png")}
                        resizeMode="contain"/>
                </Pressable>
            </View>
            <RenderList
                navigation={navigation}
                search_text={searchText}>
            </RenderList>
        </SafeAreaView>
    )
}
const {width: wid, height: hei} = Dimensions.get("window");
const styles = StyleSheet.create({
    list :{
        display: "flex",
        flex: 1,
        paddingTop: 30,
        alignItems:"center",
    },
    icon:{
        width:wid/8*2,
        height:hei/8,
    },
    box:{
        width:wid/8*2,
        height:hei/7,
        display:"flex",
        alignItems:"center",
        marginBottom:20,
        marginHorizontal:10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#ffffffff",
    } ,
     search_bar:{
        display:"flex",
        flexDirection:"row",
        margin:"auto",
        marginTop:10
    },
    search_input:{
        width: wid - 100,
        borderWidth: 2,
        borderRadius: 10,
        height: verticalScale(32),
        borderColor: "#dcdcdcff",
    },
    text:{
        backgroundColor:"rgba(40, 50, 70, 1)",
        fontWeight: "600",
        fontFamily: "montserrat",
        width:wid/8*2,
        textAlign:"center",
        color:"white",
        borderBottomLeftRadius:20,
        borderBottomRightRadius:20,
        borderWidth:1,
        borderColor:"#dcdcdc",
        borderTopWidth:0,
    },
    x_button:{
        width:40,
        height:40,
        marginLeft:10,
        borderRadius:20
    }
});