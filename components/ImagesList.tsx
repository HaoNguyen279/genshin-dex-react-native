import { View, FlatList, Image, StyleSheet, Text, ViewStyle, ImageBackground, Dimensions, ScrollView, SafeAreaView } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { Shadow } from "react-native-shadow-2";
import { Video, ResizeMode } from "expo-av";
import { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from 'expo-splash-screen';
import { DataTable } from "react-native-paper";



const globalFont = StyleSheet.create({
    fonts:{
        fontFamily:"genshin_font"
    }
})

const damage_data = {
  "Level": ["Lv.1", "Lv.2", "Lv.3"],
  "1-Hit DMG": ["80.0%", "86.6%", "93.1%"],
  "2-Hit DMG": ["36.5%x2", "39.4%x2", "42.4%x2"],
  "3-Hit DMG": ["33.2%x3", "35.9%x3", "38.6%x3"],
  "4-Hit DMG": ["116.2%", "125.6%", "135.1%"],
  "Charged Attack DMG": ["194%", "210%", "225%"],
  "Charged Attack Stamina Cost": ["50.0", "50.0", "50.0"],
  "Plunge DMG": ["74.6%", "80.7%", "86.7%"],
  "Low/High Plunge DMG": [
    "149%/186%",
    "161%/201%",
    "173%/217%"
  ]
}
const RenderTable = () =>{
    return (
        <DataTable style={{margin:10}}>
            <DataTable.Header style={{backgroundColor: 'rgba(52, 52, 52, 0.3)'}}>
                <DataTable.Title textStyle={styles.table_title}>Level</DataTable.Title>
                <DataTable.Title textStyle={styles.table_title}>{damage_data["Level"][0]}</DataTable.Title>
                <DataTable.Title textStyle={styles.table_title}>{damage_data["Level"][1]}</DataTable.Title>
                <DataTable.Title textStyle={styles.table_title}>{damage_data["Level"][2]}</DataTable.Title>
            </DataTable.Header>

            <DataTable.Row> 
                <DataTable.Cell textStyle={styles.table_title}>1-Hit DMG</DataTable.Cell>
                <DataTable.Cell textStyle={styles.cell}>{damage_data["1-Hit DMG"][0]}</DataTable.Cell>
                <DataTable.Cell textStyle={styles.cell}>{damage_data["1-Hit DMG"][1]}</DataTable.Cell>
                <DataTable.Cell textStyle={styles.cell}>{damage_data["1-Hit DMG"][2]}</DataTable.Cell>
            </DataTable.Row>

            <DataTable.Row>
                <DataTable.Cell textStyle={styles.table_title}>2-Hit DMG</DataTable.Cell>
                <DataTable.Cell textStyle={styles.cell}>{damage_data["2-Hit DMG"][0]}</DataTable.Cell>
                <DataTable.Cell textStyle={styles.cell}>{damage_data["2-Hit DMG"][1]}</DataTable.Cell>
                <DataTable.Cell textStyle={styles.cell}>{damage_data["2-Hit DMG"][2]}</DataTable.Cell>
            </DataTable.Row> 

            <DataTable.Row>
                <DataTable.Cell textStyle={styles.table_title}>3-Hit DMG</DataTable.Cell>
                <DataTable.Cell textStyle={styles.cell}>{damage_data["3-Hit DMG"][0]}</DataTable.Cell>
                <DataTable.Cell textStyle={styles.cell}>{damage_data["3-Hit DMG"][1]}</DataTable.Cell>
                <DataTable.Cell textStyle={styles.cell}>{damage_data["3-Hit DMG"][2]}</DataTable.Cell>
            </DataTable.Row>

            <DataTable.Row>
                <DataTable.Cell textStyle={styles.table_title}>Low/High Plunge DMG</DataTable.Cell>
                <DataTable.Cell textStyle={styles.cell}>{damage_data["Low/High Plunge DMG"][0]}</DataTable.Cell>
                <DataTable.Cell textStyle={styles.cell}>{damage_data["Low/High Plunge DMG"][1]}</DataTable.Cell>
                <DataTable.Cell textStyle={styles.cell}>{damage_data["Low/High Plunge DMG"][2]}</DataTable.Cell>
            </DataTable.Row>
        </DataTable>
    )
}

const RenderAscend = ({ region, element }: { region?: string, element?: string })=>{
    var jade : any;
    var material : any;
    const jade_data = {
        "cryo" :  require("../assets/ascend_data/jades/bang_jade.webp"),
        "pyro" :  require("../assets/ascend_data/jades/hoa_jade.webp"),
        "hydro" :  require("../assets/ascend_data/jades/thuy_jade.webp"),
        "dendro" :  require("../assets/ascend_data/jades/thao_jade.webp"),
        "electro" :  require("../assets/ascend_data/jades/loi_jade.webp"),
        "anemo" :  require("../assets/ascend_data/jades/phong_jade.webp"),
        "geo" : require("../assets/ascend_data/jades/nham_jade.webp"),
    }
    switch (element){
                case "Cryo":
            jade =  jade_data["cryo"]
            break;
                case "Pyro":
            jade =  jade_data["pyro"]
            break;
                case "Hydro":
            jade =  jade_data["hydro"]
            break;
                case "Dendro":
            jade =  jade_data["dendro"]
            break;
                case "Electro":
            jade =  jade_data["electro"]
            break;
                case "Anemo":
            jade =  jade_data["anemo"]
            break;
                case "Geo":
            jade =  jade_data["geo"]
            break;
    }

    const mat_data = {
        "Mondstadt" :  require("../assets/ascend_data/materials/monstadt_mat.webp"),
        "Liyue" :  require("../assets/ascend_data/materials/liyue_mat.webp"),
        "Inazuma" :  require("../assets/ascend_data/materials/inazuma_mat.webp"),
        "Sumeru" :  require("../assets/ascend_data/materials/sumeru_mat.webp"),
        "Fontaine" :  require("../assets/ascend_data/materials/fontaine_mat.webp"),
        "Natlan" :  require("../assets/ascend_data/materials/natlan_mat.webp")

    }
    switch (region){
                case "Mondstadt":
            material =  mat_data["Mondstadt"]
            break;
                case "Liyue":
            material =  mat_data["Liyue"]
            break;
                case "Inazuma":
            material =  mat_data["Inazuma"]
            break;
                case "Sumeru":
            material =  mat_data["Sumeru"]
            break;
                case "Fontaine":
            material =  mat_data["Fontaine"]
            break;
                case "Natlan":
            material =  mat_data["Natlan"]

    }
    return(
        <View>
            <View style={{marginLeft:30}}>
                <Text style={[globalFont.fonts, {color:"white"}]}>Ascension Materials</Text>
            </View>
            <View style={styles.ascend_mat_bar}>
                <View style={{marginHorizontal:10}}>
                    <ImageBackground
                        source={require("../assets/ascend_data/materials_background.png")}
                        style={styles.box_materials}
                    >
                        <Image
                            style={styles.box_materials}
                            source={require("../assets/ascend_data/mora.webp")}
                        />
                    </ImageBackground>
                </View>
                <View style={{marginHorizontal:10}}>
                    <ImageBackground
                        source={require("../assets/ascend_data/materials_background.png")}
                        style={styles.box_materials}
                    >
                        <Image
                            style={styles.box_materials}
                            source={jade}
                        />
                    </ImageBackground>
                </View>
                <View style={{marginHorizontal:10}}>
                    <ImageBackground
                        source={require("../assets/ascend_data/materials_background.png")}
                        style={styles.box_materials}
                    >
                        <Image
                            style={styles.box_materials}
                            source={material}
                        />
                    </ImageBackground>
                </View>
            </View>
        </View>
    )
}


const getBackground = (element : string | undefined) =>{
    const data_background = {
        "cryo" :  require("../assets/background_videos/bg_cryo.mp4"),
        "pyro" :  require("../assets/background_videos/bg_pyro.mp4"),
        "hydro" :  require("../assets/background_videos/bg_hydro.mp4"),
        "dendro" :  require("../assets/background_videos/bg_dendro.mp4"),
        "electro" :  require("../assets/background_videos/bg_electro.mp4"),
        "anemo" :  require("../assets/background_videos/bg_anemo.mp4"),
        "geo" : require("../assets/background_videos/bg_geo.mp4"),
    }
    switch (element){
                case "Cryo":
            return data_background["cryo"]
                case "Pyro":
            return data_background["pyro"]
                case "Hydro":
            return data_background["hydro"]
                case "Dendro":
            return data_background["dendro"]
                case "Electro":
            return data_background["electro"]
                case "Anemo":
            return data_background["anemo"]
                case "Geo":
            return data_background["geo"]
    }
}

const getElementIcon = (element : string | undefined) =>{
    const data_background = {
        "cryo" :  require("../assets/element_icons/Element_Cryo.webp"),
        "pyro" :  require("../assets/element_icons/Element_Pyro.webp"),
        "hydro" :  require("../assets/element_icons/Element_Hydro.webp"),
        "dendro" :  require("../assets/element_icons/Element_Dendro.webp"),
        "electro" :  require("../assets/element_icons/Element_Electro.webp"),
        "anemo" :  require("../assets/element_icons/Element_Anemo.webp"),
        "geo" : require("../assets/element_icons/Element_Geo.webp"),
    }
    switch (element){
                case "Cryo":
            return data_background["cryo"]
                case "Pyro":
            return data_background["pyro"]
                case "Hydro":
            return data_background["hydro"]
                case "Dendro":
            return data_background["dendro"]
                case "Electro":
            return data_background["electro"]
                case "Anemo":
            return data_background["anemo"]
                case "Geo":
            return data_background["geo"]
    }
}
const getFontColor = (element : string | undefined) =>{

    switch (element){
                case "Cryo":
            return StyleSheet.create({
                font:{
                    color:"#61d5ff"
                }
            })
                case "Pyro":
            return StyleSheet.create({
                font:{
                    color:"#e8782a"
                }
            })
                case "Hydro":
            return StyleSheet.create({
                font:{
                    color:"#35bafc"
                }
            })
                case "Dendro":
            return StyleSheet.create({
                font:{
                    color:"#02cc05"
                }
            })
                case "Electro":
            return StyleSheet.create({
                font:{
                    color:"#ab16e0"
                }
            })
                case "Anemo":
            return StyleSheet.create({
                font:{
                    color:"#64f5a8"
                }
            })
                case "Geo":
            return StyleSheet.create({
                font:{
                    color:"#f5bc20"
                }
            })
    }
}
const { width, height } = Dimensions.get('window');

export function ImagesList(){

    SplashScreen.preventAutoHideAsync();
    console.log("--SplashScreen is on --")
    const [loaded, error] = useFonts({
        'genshin_font': require('../assets/fonts/genshin_font.ttf'),
    });

    const route : RouteProp<RootStackParamList, "Images"> = useRoute();
    const [loading,setLoading] = useState(true);
    useEffect(() => {
        const hide = async() =>{
            if (loaded || error) {
            SplashScreen.hideAsync();
            }
        };
        hide();
        console.log("__Off__")
    }, [loaded, error]);

    if (!loaded && !error) {
        return null;
    }

    return(
        <SafeAreaView style={{flex:1}}>
            <ScrollView style={{flex:1}} >
                <Video
                        source={getBackground(route.params?.element)}
                        isLooping
                        shouldPlay
                        resizeMode={ResizeMode.COVER}
                        style={styles.backgroundVideo}
                    />
                <View>

                        <View style={{display:"flex", alignItems:"center", marginTop:40}}>
                            <Shadow
                                distance={10}
                                startColor="#00000020"
                                offset={[0, 4]}
                                corners={{ topStart: true, topEnd: true, bottomStart: true, bottomEnd: true }}
                                style={{borderRadius:30}}
                            >
                                <View style={styles.box}>
                                    <Image
                                        source={{uri:route.params?.url_image}}
                                        style={styles.image}
                                        resizeMode="contain"
                                        onLoad={() =>{
                                            // Load xong
                                            setLoading(false);
                                        }}
                                        onError={() =>{
                                            setLoading(false);
                                        }}
                                    />
                                </View>
                            </Shadow>
                        </View>

                        <View >
                            <View style={styles.text_box}>
                                <Text style={[{textAlign:"left", fontSize:24},globalFont.fonts, getFontColor(route.params?.element)?.font]}>{ route.params?.name}</Text>
                                
                                <Text style={[globalFont.fonts, {color:"white", marginRight:60}]}>   
                                    <Image source={getElementIcon(route.params?.element)} style={styles.element_icon}/>
                                    {route.params?.role}
                                </Text>
                            </View>
                            <View style={styles.info}>
                                
                                    <View>
                                        <Text style={[globalFont.fonts, styles.info_text]}>Element :{route.params?.element}</Text>
                                    </View>

                                    <View>
                                        <Text style={[globalFont.fonts, styles.info_text]}>Weapon: {route.params?.weapon}</Text>
                                    </View>
                                
                            </View>
                            <View style={{padding: 20}}>
                                <Text style={{color:"white"}}> 
                                    {route.params?.about}
                                </Text>
                            </View>
                        </View>
                </View>
                <RenderTable/>
                <RenderAscend
                    region={route.params?.region}
                    element={route.params?.element}
                />
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    image:{
        width:270,
        height:472,
        borderRadius:30,
        // iOS shadow
        shadowColor: '#00000',
        shadowOffset: {
        width: 3,
        height: 2,
        },
        shadowOpacity: 0.45,
        shadowRadius: 3.84,
    },
    info:{
        display:"flex",
        flexDirection:"row",
        justifyContent:"center",
        alignItems:"center",
    },
    text_box:{
        display:"flex",
        flexDirection: "row",
        marginLeft:60,
        marginTop: 20,
        marginBottom: 10,
        justifyContent:"space-between"
    },
    box: {
        borderRadius: 15,
        overflow: 'hidden',
        backgroundColor: '#fff',
    },
    backgroundVideo :{
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: -1,
    },
    element_icon:{
        height:30,
        width:30,
    },
    text:{
        color:"#e3e3e3",
    },
    info_text:{
        color:"#d3bc8e",
        fontSize:12,
        paddingHorizontal:8,
        paddingVertical:4,
        borderRadius:10,
        backgroundColor: 'rgba(52, 52, 52, 0.5)',
        marginHorizontal:5
    },
    cell:{
        color:"white"
    },
    table_title:{
        color:"rgb(211, 188, 142)",
        
    },
    box_materials:{
        width:80,
        height:80,
        backgroundColor:"#454e60",
        borderBottomLeftRadius:10,
        borderBottomRightRadius: 20,
        borderTopLeftRadius:10,
        borderTopRightRadius:10,
    },
    box_mat_image:{
        width:70,
    },
    ascend_mat_bar:{
        display:"flex",
        flexDirection:"row",
        justifyContent:"center",
        marginVertical:20,


    }

})
