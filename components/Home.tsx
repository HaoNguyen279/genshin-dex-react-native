import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { View, FlatList, StyleSheet, Text, TouchableOpacity, Image, TouchableWithoutFeedback, TextInput, Pressable } from "react-native";
import data from '../assets/data.json'
import { SafeAreaView } from "react-native-safe-area-context";



type RenderListProps ={
    navigation : NavigationProp<RootStackParamList>;
    // data_render : NonNullable<RootStackParamList["Images"]>    
    search_text : string
}
const RenderList : React.FC<RenderListProps> = ({navigation,search_text})=>{
    console.log("re-render-list")
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
                                            />
                                            <Text style={[styles.text]}>{item.name}</Text>
                                        </View>
                                </TouchableOpacity>
                                )
                        }}
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
    console.log('re-render');
    const navigation : NavigationProp<RootStackParamList> = useNavigation();
    const [tempSearchText, setTempSearchText] = useState("");

    const [searchText,setSearchText]  = useState("");
    
    return(
        <SafeAreaView>
            <View>
                    <View style={styles.search_bar}>
                        <TextInput
                            style= {styles.search_input}
                            placeholder='Search'
                            onChangeText={setTempSearchText}
                            keyboardType='default'
                        /> 
                        <Pressable
                            style={({pressed}) =>({
                                    width:40,
                                    height:40,
                                    marginLeft:10,
                                    backgroundColor : pressed ? "#e3e3e3" : "transparent",
                                    borderRadius:20
                            })
                        }
                            onPress={()=> setSearchText(tempSearchText)} 
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
                    search_text={searchText}
                >
                </RenderList>
            </View>
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
    margin:"auto"
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