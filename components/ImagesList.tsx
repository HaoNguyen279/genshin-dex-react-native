import { View, FlatList, StyleSheet, Text, ViewStyle , Dimensions, ScrollView, SafeAreaView, Touchable, TouchableOpacity } from "react-native";
import { RouteProp, useIsFocused, useNavigation, useRoute } from "@react-navigation/native";
import { Shadow } from "react-native-shadow-2";
import { Video, ResizeMode } from "expo-av";
import { useEffect, useState } from "react";
import { Image, ImageBackground } from "expo-image";
import { DataTable } from "react-native-paper";
import { scale } from "react-native-size-matters";

import { BASE_URL, H_API_KEY } from "@env";
import {defaultCharacter, defaultVoiceover, defaultCharacterStats} from "../utils/constant";
import {getRounded1Number,getPercentage, getResultLang} from "../utils/functions";




const RenderTable : React.FC<{stats: CharacterStats}> = ({stats}) =>{
    return (
            <View style={{paddingHorizontal: 20, marginTop: 20}}>
                <DataTable>
                    <DataTable.Header style={{backgroundColor: 'rgba(52, 52, 52, 0.3)'}}>
                        <DataTable.Title textStyle={styles.table_title}>Level</DataTable.Title>
                        <DataTable.Title textStyle={styles.table_title}>Lv.1(Base)</DataTable.Title>
                        <DataTable.Title textStyle={styles.table_title}>Lv.90(Max)</DataTable.Title>
    
                    </DataTable.Header>
        
                    <DataTable.Row> 
                        <DataTable.Cell textStyle={styles.table_title}>HP</DataTable.Cell>
                        <DataTable.Cell textStyle={styles.cell}>{getRounded1Number(stats.baseStats.hp)}</DataTable.Cell>
                        <DataTable.Cell textStyle={styles.cell}>{getRounded1Number(stats.maxStats.hp)}</DataTable.Cell>

                    </DataTable.Row>
        
                    <DataTable.Row>
                        <DataTable.Cell textStyle={styles.table_title}>ATK</DataTable.Cell>
                        <DataTable.Cell textStyle={styles.cell}>{getRounded1Number(stats.baseStats.attack)}</DataTable.Cell>
                        <DataTable.Cell textStyle={styles.cell}>{getRounded1Number(stats.maxStats.attack)}</DataTable.Cell>

                    </DataTable.Row>

                    <DataTable.Row>
                        <DataTable.Cell textStyle={styles.table_title}>DEF</DataTable.Cell>
                        <DataTable.Cell textStyle={styles.cell}>{getRounded1Number(stats.baseStats.defense)}</DataTable.Cell>
                        <DataTable.Cell textStyle={styles.cell}>{getRounded1Number(stats.maxStats.defense)}</DataTable.Cell>

                    </DataTable.Row>
        
                    <DataTable.Row>
                        <DataTable.Cell textStyle={styles.table_title}>{stats.typeSubstatText}</DataTable.Cell>
                        <DataTable.Cell textStyle={styles.cell}>{getPercentage(stats.baseStats.specialized, stats.typeSubstatText)}</DataTable.Cell>
                        <DataTable.Cell textStyle={styles.cell}>{getPercentage(stats.maxStats.specialized, stats.typeSubstatText)}</DataTable.Cell>
                    </DataTable.Row>
                </DataTable>
            </View>

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
                default:
            jade =  jade_data["cryo"];  
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
        break;
            default:
        material =  mat_data["Mondstadt"];
        break;

    }
    return(
        <View>
            <View style={{marginLeft:30}}>
                <Text style={{fontFamily: "genshin_font" ,color:"white"}}>Ascension Materials</Text>
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
        return data_background["cryo"];
            case "Pyro":
        return data_background["pyro"];
            case "Hydro":
        return data_background["hydro"];
            case "Dendro":
        return data_background["dendro"];
            case "Electro":
        return data_background["electro"];
            case "Anemo":
        return data_background["anemo"];
            case "Geo":
        return data_background["geo"];
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

const getVoiceLine = (voice : Voiceover) => {
        if (!Array.isArray(voice.friendLines)) {
        console.error('Caught error:', voice.friendLines);
        return { 1: undefined, 2: undefined, 3: undefined };
    }
    var result1 = voice.friendLines.find(item => item.voicelineType === '3001');
    if(result1 === undefined){
        result1 = voice.friendLines.find(item => item.voicelineType === '3006');
    }
    var result2 = voice.friendLines.find(item => item.voicelineType === '3002');
    var result3 = voice.friendLines.find(item => item.voicelineType === '3003');
    var returned = {
        1 : result1,
        2 : result2,
        3 : result3
    }
    return returned;
}

const { width, height } = Dimensions.get('window');

export function ImagesList(){
    const [data,setData] = useState<Character>(defaultCharacter);
    const [voice,setVoice] = useState<Voiceover>(defaultVoiceover);
    const [characterStats,setCharacterStats] = useState<CharacterStats>(defaultCharacterStats);
    const [loaded,setLoaded] = useState(false);
    const [lang,setLang] = useState<string | undefined>("en");
    const navigation = useNavigation();
    const route : RouteProp<RootStackParamList, "Images"> = useRoute();

    useEffect(() => {
        const char_name : string = route.params?.name || "Lumine";
        const fetchData = async () => {
            const lang = await getResultLang();
            const requestURL1 = BASE_URL + "/api/char?name=" + encodeURIComponent(char_name) + "&lang=" + lang;
            const requestURL2 = BASE_URL + "/api/charInfo?name=" + encodeURIComponent(char_name) +"&lang=" + lang;
            const responese1 = await fetch( requestURL1 ,{
                method: 'GET',
                headers:{
                    'Accept': 'application/json',
                    'x-api-key' : H_API_KEY
                }
            });
            const responese2 = await fetch( requestURL2 ,{
                method: 'GET',
                headers:{
                    'Accept': 'application/json',
                    'x-api-key' : H_API_KEY
                }
            });
            if(!responese1.ok || !responese2.ok){
                console.warn("Error response");
                return;
            }
            else{
                const responseData = await responese1.json();
                const responseInfo = await responese2.json();
                console.log(responseData);
                console.log(responseInfo);

                setVoice(responseInfo.voice);
                setCharacterStats({
                    baseStats: responseInfo.statsBase,
                    maxStats: responseInfo.statsMax,
                    typeSubstatText: responseInfo.typeSubstatText,
                    version: responseInfo.version
                });
                setData(responseData);
                setLoaded(true);
            }
        }
        if(!loaded) {
            fetchData();
            const lang = getResultLang().then(lang => setLang(lang));
        }
    }, [loaded]);

    return(
        <SafeAreaView style={{flex:1}}>
                <Video
                    source={getBackground(route.params?.element)}
                    isLooping
                    shouldPlay
                    resizeMode={ResizeMode.COVER}
                    style={styles.backgroundVideo}
                />
                <ScrollView style={{flex:1,paddingTop:scale(20),paddingBottom:scale(50)}}>
                <View>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{position:'absolute',zIndex:1}}> 
                        <Text style={[{fontFamily: 'genshin_font',color:"white",fontSize:18,padding:15}]}> ﹤Back</Text>
                    </TouchableOpacity>
                    <View style={{display:"flex", alignItems:"center", marginTop:60}}>
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
                                    contentFit="contain"
                                    priority={'high'}
                                />
                            </View>
                        </Shadow>
                    </View>

                        <View >
                            <View style={styles.text_box}>
                                <Text style={[{textAlign:"left", fontSize:24, fontFamily: 'genshin_font'}, getFontColor(route.params?.element)?.font]}>{ route.params?.name}</Text>
                                <Text style={[ {fontFamily: 'genshin_font',color:"white", marginRight:60}]}>   
                                    <Image source={getElementIcon(route.params?.element)} style={styles.element_icon}/>
                                    {route.params?.role}
                                </Text>
                            </View>
                            <View style={styles.info}>
                                    <View>
                                        <Text style={[{fontFamily: 'genshin_font'}, styles.info_text]}>Element :{route.params?.element}</Text>
                                    </View>
                                    <View>
                                        <Text style={[{fontFamily: 'genshin_font'}, styles.info_text]}>Weapon: {route.params?.weapon}</Text>
                                    </View>
                            </View>
                            <View style={[styles.info_row, {marginTop:10}]}>
                                <Text style={[getFontColor(route.params?.element)?.font,{fontFamily: 'genshin_font',fontSize:18}]}> 
                                    {data.title}
                                </Text>
                            </View>
                            <View style={styles.voice_line_row}>
                                <Text style={styles.info_text_row}> 
                                    ▶{'\t'}{data.description || route.params?.about || "<No data>"}
                                </Text>
                            </View>
                            <View style={styles.info_row}>
                                <Text style={styles.info_text_row}> 
                                    <Text style={styles.title_text}>{lang === "en" ? "Birthday:" : "Ngày sinh:"}</Text> {data.birthday || route.params?.birthday || "<No data>"}
                                </Text>
                            </View>
                            <View style={styles.info_row}>
                                <Text style={styles.info_text_row}> 
                                    <Text style={styles.title_text}>{lang === "en" ? "Country:" : "Quốc gia:"}</Text> {data.region || route.params?.region || "<No data>"}
                                </Text>
                            </View>
                            <View style={styles.info_row}>
                                <Text style={styles.info_text_row}> 
                                    <Text style={styles.title_text}>{lang === "en" ? "Constellation:" : "Cung mệnh:"}</Text> {data.constellation || "<No data>"}
                                </Text>
                            </View>
                            <View style={styles.info_row}>
                                <Text style={styles.info_text_row}> 
                                    <Text style={styles.title_text}>{lang === "en" ? "Release Version:" : "Phiên bản ra mắt:"}</Text> {characterStats.version || "<No data>"}
                                </Text>
                            </View>
                            <View style={{marginHorizontal: 20, marginTop: 15}}>
                                <Text style={styles.info_text_row}> 
                                    Voice lines :
                                </Text>
                            </View>
                            {loaded && (
                            <View>
                            <View style={styles.voice_line_row}>
                                <Text style={styles.info_text_row}> 
                                    ▶{'\t'}<Text style={styles.title_text}>{getVoiceLine(voice)?.[1]?.title}</Text> : {getVoiceLine(voice)?.[1]?.description || "<No data>"}
                                </Text>
                            </View>
                            <View style={styles.voice_line_row}>
                                <Text style={styles.info_text_row}> 
                                    ▶{'\t'}<Text style={styles.title_text}>{getVoiceLine(voice)?.[2]?.title}</Text> : {getVoiceLine(voice)?.[2]?.description || "<No data>"}
                                </Text>
                            </View>
                            <View style={styles.voice_line_row}>
                                <Text style={styles.info_text_row}> 
                                    ▶{'\t'}<Text style={styles.title_text}>{getVoiceLine(voice)?.[3]?.title}</Text> : {getVoiceLine(voice)?.[3]?.description || "<No data>"}
                                </Text>
                            </View>
                            </View>
                            )}
                        </View>
                </View>
                <RenderTable
                    stats={characterStats || {
                        baseStats: { hp: 0, attack: 0, defense: 0, specialized: 0, level: 0, ascension: 0 },
                        maxStats: { hp: 0, attack: 0, defense: 0, specialized: 0, level: 0, ascension: 0 },
                        typeSubstatText: "",
                        version: ""
                    }}
                />
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
    title_text:{
        color:"pink",
    },
    info_row:{
        marginHorizontal: 20,
        paddingVertical:2,
    },
    voice_line_row:{
        marginHorizontal: 20,
        marginVertical:5,   
    },
    info_text_row:{
        color:"white",
        fontFamily: 'genshin_font'
    },
    text_box:{
        display:"flex",
        flexDirection: "row",
        flexWrap : 'wrap', // Flex wrap giúp item được tự động đẩy xuống hàng dưới tương tự flex CSS web, nếu ko thì đéo có
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
        color:"white",
        paddingLeft:20
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
