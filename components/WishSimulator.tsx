import { StyleSheet, View, ImageBackground, Image, TouchableOpacity ,Text, FlatList, Modal, Button} from "react-native"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import { AVPlaybackStatus, Video, ResizeMode } from "expo-av";
import { useEffect, useRef, useState } from "react";
import data from "../assets/data.json"
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from "expo-font";
import { Shadow } from "react-native-shadow-2";
import banner from "../assets/banner.json"


const globalFont = StyleSheet.create({
    fonts:{
        fontFamily:"genshin_font"
    }
})
const that_hoang = [87,44,4,56,14,94,71,74];
var history = {
    "pity" : 0,
    "pulled" : [3,3,3,3,3,3,3,3,3],
    "isGuaranteed": false
}

interface Character {
    id: number;
    name: string;
    element: string;
    rarity: number;
    weapon: string;
    region: string;
    role: string;
    birthday: string;
    about: string;
    url_image: string;
    url_icon: string;
    gacha_card_url: string;
}

const videoSource = require("../assets/wish_animation/wish_ani_5stars.mp4");
const backgroundSource = require("../assets/wish_animation/wish_background.jpg");
const gachaBackground = require("../assets/wish_animation/gacha_background.webp");
const resultGachaCard = require("../assets/wish_animation/resultcard-bg.png");
const closeButton = require("../assets/wish_animation/close_button.png");
const sword_3stars = require("../assets/wish_animation/sword_3stars.webp");
const pull_button_bg = require("../assets/wish_animation/pull_button_bg.webp");
const intertwined_fate = require("../assets/wish_animation/intertwined_fate.webp");

const character_5stars = data.filter(item => item.rarity == 5);
const character_4stars = data.filter(item => item.rarity == 4);

const FIVE_STARS_RATE = 0.006;
const FOUR_STAR_RATE = 0.051;

function getRandomNumber(min : number , max : number){
    return Math.floor(Math.random() *(max - min + 1)) + min;
}


const randomFour = () : number[]=>{
    var resultSet = new Set<number>();
    while(resultSet.size < 102){
        resultSet.add(getRandomNumber(1,1000));
    }              
    console.log("--------------------------")
    console.log("cac ne 4 sao :" + [...resultSet])
    return [...resultSet];
}
const randomFive = (array : number[])=>{
    var resultSet = new Set();
    while(resultSet.size< 12){
        var rand = getRandomNumber(1,1000);
        if(!array.includes(rand))
            resultSet.add(rand);
    }
    console.log("5 sao");
    console.log([...resultSet])
    return [...resultSet];
}

const getWinResultCharacterId = (isGuaranteed : boolean,idCharBannerRateUp : number) =>{
    if(isGuaranteed){
        history.isGuaranteed = false;
        return idCharBannerRateUp;
    }
    else{
        if(1 === getRandomNumber(1,2)){
            history.isGuaranteed = false;
            return idCharBannerRateUp;
        }
        else{
            history.isGuaranteed = true;
            return that_hoang[getRandomNumber(0,7)];
        }
    }
}





function gacha(idCharBannerRateUp : number){
    var four_chance = randomFour();
    var five_chace = randomFive(four_chance);

    var character_id : number[] = [];
    for(let i = 0;i <10; i++){
        var lastIndexof4 = history.pulled.lastIndexOf(4);
        var lastIndexof5 = history.pulled.lastIndexOf(5);
        var pity_4 = history.pulled.length - lastIndexof4;
        var pity_5 = history.pulled.length - lastIndexof5;
        var randNumb = getRandomNumber(1,1000);
        console.log(randNumb);
        if(pity_5 < 90){
            if(pity_4 < 10){
                if(five_chace.includes(randNumb)){
                    character_id.push(getWinResultCharacterId(history.isGuaranteed,idCharBannerRateUp));
                    history.pulled.push(5);
                }
                else if(four_chance.includes(randNumb)){
                    character_id.push(character_4stars[Math.floor(Math.random()* character_4stars.length)].id);
                    history.pulled.push(4);
                }
                else{
                    character_id.push(99);
                    history.pulled.push(3);
                }
            }
            else{
                character_id.push(character_4stars[Math.floor(Math.random()* character_4stars.length)].id);
                history.pulled.push(4);
            }
        }
        else{
            character_id.push(getWinResultCharacterId(history.isGuaranteed,idCharBannerRateUp));
            history.pulled.push(5);
        }
            
        
        
    }
    console.log(character_id);
    var resultSet  = [];
    for( let i = 0 ;i < character_id.length; i++){
        var char = data.filter(item => item.id == character_id[i])[0];
        resultSet.push(char)
    }
    resultSet.sort((a, b) => b.rarity - a.rarity);
    return resultSet;
}

const isBannerChecked  =  (id1: number, id2: number) : boolean =>{
    return id1 == id2;
}

export function WishSimulator(){

    SplashScreen.preventAutoHideAsync();

    const [loaded, error] = useFonts({
        'genshin_font': require('../assets/fonts/genshin_font.ttf'),
    }); 

    const videoRef = useRef<Video>(null);
    const [showVideo,setShowVideo] = useState(false);
    const [listGacha,setListGacha] = useState<Character[]>();
    const [showGachaList,setShowGachaList] = useState(false);
    const [intertwinedFate,setInterwinedFate] = useState(12);
    const [isVisible,setIsVisibale] = useState(false);
    const [selectedBanner,setSelectedBanner] = useState(1);
    const [bannerUrl,setBannerUrl] = useState("");
    const [rateUpCharId,setRateUpCharId] = useState<number>(1);

    const handleStatus = (status : AVPlaybackStatus)=>{
        if(!status.isLoaded) return;
        if(status.didJustFinish){
            setShowVideo(false);
            setShowGachaList(true);
        }
    }
        useEffect(() => {
        const foundBanner = banner.find((item) => item.id_banner === selectedBanner);
        const charId : number = data.find((item) => item.name === foundBanner?.five_stars_character)?.id!
        if (foundBanner) {
            setBannerUrl(foundBanner.banner_url);
            setRateUpCharId(charId);
        } else {
            setBannerUrl("");
        }
    }, [selectedBanner]);
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
    
    <SafeAreaProvider>
        <SafeAreaView style={{backgroundColor:"black", flex:1}}>
            <View style={styles.container}>
                <ImageBackground style={styles.box} source={backgroundSource}>
                <Modal
                    visible={isVisible}
                    onRequestClose={() => setIsVisibale(false)}
                    animationType="fade"
                    presentationStyle="pageSheet"
                    style={{justifyContent:"center",alignItems:"center"}}
                    
                    >
                    <View style={styles.modalContainer}>
                        <View style={{display:"flex",flexDirection:"row",alignItems:"center"}}>
                            <Text style={[globalFont.fonts,{fontSize:22,marginRight:20}]}>Select banner:</Text>
                            <TouchableOpacity onPress={()=> {setIsVisibale(false)}} >
                                <ImageBackground
                                    source={closeButton}
                                    style={{width:50,height:50,marginLeft:10}}
                                />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={banner}
                            scrollEnabled={true}
                            style={{height:235}}
                            showsVerticalScrollIndicator
                            renderItem={({item}) =>{
                                return(
                                    <TouchableOpacity style={styles.select_item_banner}
                                        onPress={()=>{
                                            setSelectedBanner(item.id_banner);
                                            setIsVisibale(false)
                                        }}
                                    >
                                        <View style={{display:"flex",flexDirection:"row"}}>
                                            <Text style={[globalFont.fonts,{fontSize:14,marginLeft:20}]}>{item.id_banner}. {item.five_stars_character}</Text>
                                            { isBannerChecked(item.id_banner,selectedBanner) && (
                                                <Text>    ✓</Text>
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                )
                            }}
                        
                        />
                    </View>
                </Modal>
                <Image
                    style={styles.banner_style}
                    source={{uri: bannerUrl}}
                />
                
                {showVideo && (
                <View>
                    <Video 
                        ref={videoRef} 
                        style={[styles.box]}
                        resizeMode={ResizeMode.COVER}
                        shouldPlay
                        useNativeControls={false}
                        source={videoSource} 
                        onPlaybackStatusUpdate={handleStatus}
                        /> 
                    <TouchableOpacity
                        style={styles.skip_button}
                        onPress={()=>{
                            setShowVideo(false) 
                            setShowGachaList(true);
                        }}
                        >
                        <Text style={[globalFont.fonts, {color:"white", fontSize:14}]}>Skip ▶</Text>
                    </TouchableOpacity>
                </View>
                )}
                { showGachaList &&
                (<ImageBackground
                    source={gachaBackground}
                    style={styles.box}
                    >
                    <View style={{position:"relative"}}>
                        <FlatList
                            // data={data.filter(item => listGacha.includes(item.id))}
                            data={listGacha}
                            horizontal={true}
                            style={ styles.flatList }
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({item}) =>{
                                if(item.rarity == 4){
                                    return(
                                        <Shadow
                                            style={{borderRadius:100}}
                                            distance={5}
                                            startColor={'#c55bda'}
                                            endColor={'#00000000'}
                                            paintInside={true}
                                            sides={{start: true,top: true,end: true,bottom: true}}
                                            corners={{ topStart: true, topEnd: true, bottomStart: true, bottomEnd: true}}
                                        >
                                            <View style={[styles.resultGachaCard]}>
                                                <ImageBackground
                                                    source={resultGachaCard}
                                                    style={styles.gachaCard}
                                                >
                                                    <Image source={{ uri: item.gacha_card_url }}
                                                        style={styles.gachaCharacter}
                                                        resizeMode="cover"
                                                    />
                                                </ImageBackground>
                                            </View>
                                        </Shadow >
                                        
                                    )}
                                    else if(item.rarity == 5){
                                    return(
                                        <Shadow
                                            style={{borderRadius:100}}
                                            distance={5}
                                            startColor={'#f5b32a'}
                                            endColor={'#00000000'}
                                            paintInside={true}
                                            sides={{start: true,top: true,end: true,bottom: true}}
                                            corners={{ topStart: true, topEnd: true, bottomStart: true, bottomEnd: true}}
                                        >
                                            <View style={[styles.resultGachaCard]}>
                                                <ImageBackground
                                                    source={resultGachaCard}
                                                    style={styles.gachaCard}
                                                >
                                                    <Image source={{ uri: item.gacha_card_url }}
                                                        style={styles.gachaCharacter}
                                                        resizeMode="cover"
                                                    />
                                                </ImageBackground>
                                            </View>
                                        </Shadow >
                                        
                                    )}
                                else{
                                    return(
                                        <View style={[styles.resultGachaCard]}>
                                            <ImageBackground
                                                source={resultGachaCard}
                                                style={styles.gachaCard}
                                            >
                                                <Image source={{ uri: item.gacha_card_url }}
                                                    style={styles.gachaCharacter}
                                                    resizeMode="cover"
                                                />
                                            </ImageBackground>
                                        </View>
                                    )
                                }
                            }}
                        />
                    </View>
                    <TouchableOpacity 
                        style={styles.closeButton}
                        onPress={()=> {setShowGachaList(false)}}
                        >
                        <ImageBackground
                            source={closeButton}
                            style={{width:30,height:30}}
                        />
                    </TouchableOpacity>
                </ImageBackground>
                )}








                {!showGachaList && !showVideo &&(
                <View style={styles.button_bar}>
                    <View style={styles.intertwined_fate_amount}>
                        <View style={{display:"flex", flexDirection:"row", alignItems:"center"}}>
                            <Image
                                source={intertwined_fate}
                                style={{width:20, height:20}}
                                resizeMode="cover"
                            />
                            <Text style={[globalFont.fonts, {fontSize:14, alignSelf:"center", color:"white"}]}>{intertwinedFate}</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                    style={styles.store_button}
                    onPress={()=>{
                        setInterwinedFate(intertwinedFate+10);
                    }}>
                        <ImageBackground
                            source={pull_button_bg}
                            resizeMode="cover"
                            style={{position:'absolute',width:140,height:35,}}
                        >
                        <View>
                            <Text style={[globalFont.fonts,{alignSelf:"center",fontSize:12,color:"#a49a90",top:"50%"}]}>Cửa hàng</Text>
                        </View>
                        </ImageBackground>
                    </TouchableOpacity>
                    <TouchableOpacity
                    style={[styles.store_button,{marginTop:110}]}
                    onPress={()=>{
                        setIsVisibale(true);
                    }}>
                        <ImageBackground
                            source={pull_button_bg}
                            resizeMode="cover"
                            style={{position:'absolute',width:140,height:35,}}
                        >
                        <View>
                            <Text style={[globalFont.fonts,{alignSelf:"center",fontSize:12,color:"#a49a90",top:"50%"}]}>Lịch sử</Text></View>
                        </ImageBackground>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.pull_button,{marginTop:200}]}
                        onPress={()=>{ 
                            if(intertwinedFate -1 >= 0){
                                setShowVideo(true)
                                setListGacha(gacha(rateUpCharId));
                                setInterwinedFate(intertwinedFate-1);
                            }
                        }}>
                            <ImageBackground
                                source={pull_button_bg}
                                resizeMode="cover"
                                style={{position:'absolute',width:140,height:35}}
                            >
                            <View>
                                <Text style={[globalFont.fonts,{alignSelf:"center",fontSize:10,color:"#a49a90",marginTop:3}]}>Wish x1</Text>
                                <Text style={[globalFont.fonts,{alignSelf:"center",fontSize:10,color:"#a49a90",marginRight:20}]}>x1</Text>
                                <Image
                                    source={intertwined_fate}
                                    style={{width:15, height:15,position:"absolute",top:"50%",left:"55%"}}
                                    resizeMode="cover"
                                />
                            </View>
                            </ImageBackground>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.pull_button,{marginTop:110}]}
                        onPress={()=>{
                            if(intertwinedFate -10 >= 0){
                                setShowVideo(true)
                                setListGacha(gacha(rateUpCharId));
                                setInterwinedFate(intertwinedFate-10);
                            }
                        }}>
                            <ImageBackground
                                source={pull_button_bg}
                                resizeMode="cover"
                                style={{position:'absolute',width:140,height:35,}}
                            >
                            <View>
                                <Text style={[globalFont.fonts,{alignSelf:"center",fontSize:10,color:"#a49a90",marginTop:3}]}>Wish x10</Text>
                                <Text style={[globalFont.fonts,{alignSelf:"center",fontSize:10,color:"#a49a90",marginRight:20}]}>x10</Text>
                                <Image
                                    source={intertwined_fate}
                                    style={{width:15, height:15,position:"absolute",top:"50%",left:"55%"}}
                                    resizeMode="cover"
                                />
                            </View>
                            </ImageBackground>
                    </TouchableOpacity>
                </View>
                )}
                </ImageBackground>
            </View>
        </SafeAreaView>
    </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
    container:{

        position: 'relative',
        marginTop:60,
        alignSelf:"center",
    },
    box: {
        position:"relative",
        width: 393.75,
        height: 700,
    },
    button:{
        width:50,
        borderColor:"black",
        borderWidth:2
    },
    banner_style:{
        position:"absolute",
        margin:"auto",
        alignSelf:"center",
        top:"35%",
        width:440,
        height:220,
        transform:[{rotate:"90deg"}]
    },
    button_bar:{
        width:70,
        marginRight:100,
        top:"10%",
        alignItems:"center"

    },
    store_button:{
        transform: [{rotate:'90deg'}],
        borderRadius:20,       
        width:140,height:35,
    },
    pull_button:{
        transform: [{rotate:'90deg'}],
        borderRadius:20,
        width:140,height:35,
        
    },
    intertwined_fate_amount:{
        position:"absolute",
        transform: [{rotate:'90deg'}],
        width:100,
        height:25,
        backgroundColor:"rgba(92, 113, 124,0.6)",
        top:"97%",
        left:"440%",
        borderRadius:25,
        alignItems:"center",
        justifyContent:"center"
    },
      resultGachaCard: {
        width: 54, 
        height: 224,
        padding: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    resultGachaCard_4stars: {
        width: 54, 
        height: 224,
        padding: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    resultGachaCard_5stars: {
        width: 54, 
        height: 224,
        padding: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    gachaCard: {
        width: 50,
        height: 220,
        margin: 0,
        padding: 0,
        overflow: 'hidden',

    },
    gachaCharacter: {
        width: 48,
        height: 170,
        margin: 'auto',
        padding: 0,
        overflow: 'hidden',
        borderRadius:5
    },
    closeButton:{
        width:30,
        height:30,
        top: '92%',
        left: '87%',
        position:"absolute"
    },
    flatList:{
        transform: [{ rotate: "90deg" }],
        alignSelf:"center",
        width:550,
        position:"absolute",
        marginTop:230     
    },
    skip_button:{
        transform:[{rotate:"90deg"}],
        zIndex:2,
        position:"absolute",
        top: '92%',
        left: '85%',
    },
    modalContainer:{
        transform:[{rotate:"90deg"}],
        alignContent:"center",
        justifyContent:"center",
        alignItems:"center",
        top:"30%"
    },
    select_item_banner:{
        backgroundColor:"#f6f1e7",
        borderColor:"#d5bf94",
        borderWidth:1,
        width:250,
        height:50,
        justifyContent: "center",

    }



})