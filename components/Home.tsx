import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { View, FlatList, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, TextInput, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {Image} from "expo-image";

import CustomSplashScreen from "./CustomSplashScreen";
import data from '../assets/data/character.json';
const Tab = createBottomTabNavigator();

const preload_icon_list = data.map( item => item.url_icon)

type RenderListProps ={
    navigation : NavigationProp<RootStackParamList>;
    // data_render : NonNullable<RootStackParamList["Images"]>    
    search_text : string
}
const RenderList : React.FC<RenderListProps> = ({navigation,search_text})=>{
    console.log("Re-render-list")
    return(
            <View style={styles.list}>
                    <FlatList 
                        data={data.filter(item => item.name.toLowerCase().includes(search_text.toLowerCase()))}   
                        numColumns={3}
                        contentContainerStyle={{paddingBottom:120}}
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
                            <View style={{marginTop:200, alignItems:"center"}}>
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
    useEffect(() =>{
        const preload_url = async () =>{
            await Promise.all(preload_icon_list.map( url_icon => Image.prefetch(url_icon)))
            .then(() => console.log("Successfully preloaded url icon!"))
            .catch(err => console.warn("Failed to preload url icon :" + err))
            setLoading(false);
            console.log("set false");
        }
        preload_url();
        
    })
    if(loading) return <CustomSplashScreen/>

    return(
        <SafeAreaView  edges={[ 'bottom']}>
            <View style={styles.search_bar}>
                <TextInput
                    ref={searchInputRef}
                    style= {styles.search_input}
                    placeholder='Search'
                    onChangeText={setSearchText}
                    keyboardType='default'
                /> 
                <Pressable
                    style={({pressed}) =>({
                            width:40,
                            height:40,
                            marginLeft:10,
                            backgroundColor : pressed ? "#e3e3e3" : "transparent",
                            borderRadius:20})}
                    onPress={()=> {
                        setSearchText(""); 
                        clearSearchText();
                    }} 
                >
                    <Image
                        style={{width:30,height:30,margin:"auto"}}
                        source={require("../assets/png/search_icon.png")}
                        resizeMode="contain"
                    />
                </Pressable>
            </View>
            <RenderList
                navigation={navigation}
                search_text={searchText}>
            </RenderList>
        </SafeAreaView>
    )

}
const styles = StyleSheet.create({
    font:{
        fontSize: 18,
        marginLeft: 20,
        fontWeight: 700,
    },
    list :{
        display: "flex",
        paddingTop: 30,
        alignItems:"center"
    },
    icon:{
        width:100,
        height:100
    },
    box:{
        width:100,
        height:120,
        display:"flex",
        alignItems:"center",
        flex:1,
        marginBottom:20,
        marginHorizontal:10,
        borderRadius: 20

    } ,
    search_button:{
        width:40,
        height:40,
        marginLeft:10,
        backgroundColor :"transparent",
    },
     search_bar:{
        display:"flex",
        flexDirection:"row",
        margin:"auto",
        marginTop:10
            

    },
    search_input:{
        width: 300,
        height:40,
        borderColor:"black",
        borderWidth: 1,
        borderRadius: 10,
    },
    text:{
        backgroundColor:"rgb(40, 46, 57)",
        width:100,
        textAlign:"center",
        color:"white",
        borderBottomLeftRadius:20,
        borderBottomRightRadius:20
  }
})