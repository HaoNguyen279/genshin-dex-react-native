import { StyleSheet, View, ImageBackground, Image, TouchableOpacity ,Text, FlatList, Modal, Button} from "react-native"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import { AVPlaybackStatus, Video, ResizeMode } from "expo-av";
import React, { useEffect, useRef, useState } from "react";
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
};

interface HistoryPity {
    idChar: number;
    pity:number
}
var five_stars_history_pity : HistoryPity[] = [
    {idChar:1 , pity:90},
    {idChar:1 , pity:90},
    {idChar:1 , pity:90},
    {idChar:1 , pity:90},
    {idChar:1 , pity:90},
]



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
const pull_button_bg = require("../assets/wish_animation/pull_button_bg.webp");
const intertwined_fate = require("../assets/wish_animation/intertwined_fate.webp");
const history_bg = require("../assets/wish_animation/history_bg.png");

const catalyst1_3stars_weapon = require("../assets/gacha_items/catalyst1_3stars_weapon.webp");
const claymore1_3stars_weapon = require("../assets/gacha_items/claymore1_3stars_weapon.webp");
const sword1_3stars_weapon = require("../assets/gacha_items/sword1_3stars_weapon.webp");
const bow1_3stars_weapon = require("../assets/gacha_items/bow1_3stars_weapon.webp");
const polearm1_3stars_weapon = require("../assets/gacha_items/polearm1_3stars_weapon.webp");

const map_3star_weapons = new Map<number, any>();
map_3star_weapons.set(1,catalyst1_3stars_weapon);
map_3star_weapons.set(2,claymore1_3stars_weapon);
map_3star_weapons.set(3,sword1_3stars_weapon);
map_3star_weapons.set(4,bow1_3stars_weapon);
map_3star_weapons.set(5,polearm1_3stars_weapon);

const character_4stars = data.filter(item => item.rarity == 4);

function getRandomNumber(min : number , max : number){
    return Math.floor(Math.random() *(max - min + 1)) + min;
}

function getRandom3starWeaponAsset(){
    return map_3star_weapons.get(getRandomNumber(1,5));
}
const randomFour = () : number[]=>{
    var resultSet = new Set<number>();
    while(resultSet.size < 51){
        resultSet.add(getRandomNumber(1,1000));
    }              
    console.log("------------------------------------------------------------------------------------")
    console.log("4 sao :" + [...resultSet])
    return [...resultSet];
}
const randomFive = (array : number[], addChance : number)=>{
    var resultSet = new Set();
    while(resultSet.size< 12 + addChance){
        var rand = getRandomNumber(1,1000);
        if(!array.includes(rand))
            resultSet.add(rand);
    }
    console.log("5 sao:");
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





function gacha(idCharBannerRateUp : number, pull : number){


    var character_id : number[] = [];
    for(let i = 0;i <pull; i++){
        var lastIndexof4 = history.pulled.lastIndexOf(4);
        var lastIndexof5 = history.pulled.lastIndexOf(5);
        var pity_4 = history.pulled.length - lastIndexof4;
        var pity_5 = history.pulled.length - lastIndexof5;

        var four_chance = randomFour();
        var five_chance;
        if(pity_5 > 73 && pity_5 < 85 ){
            five_chance = randomFive(four_chance, (pity_5-73) * 50);
        }else{
            five_chance = randomFive(four_chance,0); 
        }
        

        var randNumb = getRandomNumber(1,1000);
        console.log(randNumb);
        if(pity_5 < 90){
            if(pity_4 < 10){
                if(five_chance.includes(randNumb)){
                    var idCharGot = getWinResultCharacterId(history.isGuaranteed,idCharBannerRateUp);
                    character_id.push(idCharGot);
                    five_stars_history_pity.push({idChar :idCharGot, pity:pity_5})
                    history.pulled.push(5);
                }
                else if(four_chance.includes(randNumb)){
                    if (character_4stars && character_4stars.length > 0) {
                        const randomChar = character_4stars[Math.floor(Math.random() * character_4stars.length)];
                        character_id.push(randomChar && randomChar.id ? randomChar.id : 99);
                    } else {
                        character_id.push(99);
                    }
                    history.pulled.push(4);
                }
                else{
                    character_id.push(99);
                    history.pulled.push(3);
                }
            }
            else{
                if (character_4stars && character_4stars.length > 0) {
                    const randomChar = character_4stars[Math.floor(Math.random() * character_4stars.length)];
                    character_id.push(randomChar && randomChar.id ? randomChar.id : 99);
                } else {
                    character_id.push(99);
                }
                history.pulled.push(4);
            }
        }
        else{
            var idCharGot : number = getWinResultCharacterId(history.isGuaranteed,idCharBannerRateUp);
            character_id.push(idCharGot);
            five_stars_history_pity.push({idChar :idCharGot, pity:pity_5})
            history.pulled.push(5);
        }
    }
    console.log(character_id);
    for(let i = 0; i <10;i++){
        if(character_id.at(i) === undefined){
            character_id.at(i) == 99
            console.log("nigggggggggggggggggggggggggggggggggggggggggggggggg46345362452462546========???????????????????????????")
        }
            
    }
    var resultSet : Character[]  = [];
    for( let i = 0 ;i < character_id.length; i++){
        var char = data.filter(item => item.id == character_id[i])[0];
        resultSet.push(char)
    }
    resultSet.sort((a, b) => b.rarity - a.rarity);
    return resultSet;
}

function getVideoPullPath(array : Character[] ){
    if(array.at(0)?.rarity === 5){
        return require("../assets/wish_animation/wish_ani_5stars.mp4");
    }
    else if(array.at(0)?.rarity === 4){
        return require("../assets/wish_animation/wish_ani_4stars.mp4")
    }
    return require("../assets/wish_animation/wish_ani_3stars.mp4");
}

const isBannerChecked  =  (id1: number, id2: number) : boolean =>{
    return id1 == id2;
}

interface GachaCardProps {
  item: Character;
}
const GachaCard: React.FC<GachaCardProps> = ({ item }) => {
  const shadowColor = item.rarity === 5 ? '#f5b32a' : item.rarity === 4 ? '#c55bda' : null;
  
  if (!shadowColor) {
    return (
      <View style={styles.resultGachaCard}>
        <ImageBackground source={resultGachaCard} style={styles.gachaCard}>
          <Image 
            source={getRandom3starWeaponAsset()}
            style={styles.gachaCharacter}
            resizeMode="cover"
          />
        </ImageBackground>
      </View>
    );
  }
  
  return (
    <Shadow
      style={{borderRadius:30}}
      distance={20}
      startColor={shadowColor}
      endColor={'#00000000'}
      paintInside={true}
      sides={{start: true, top: true, end: true, bottom: true}}
      corners={{ topStart: true, topEnd: true, bottomStart: true, bottomEnd: true}}
    >
      <View style={styles.resultGachaCard}>
        <ImageBackground source={resultGachaCard} style={styles.gachaCard}>
          <Image 
            source={{ uri: item.gacha_card_url }}
            style={styles.gachaCharacter}
            resizeMode="cover"
          />
        </ImageBackground>
      </View>
    </Shadow>
  );
};



const PityCard  = ( { data_history }: { data_history: HistoryPity }) =>{
const color10 = "#bdf070";
const color30 = "#60d74c"; 
const color50 = "#eeda89";
const color60 = "#fab66e";
const color70 = "#e2c152";
const color80 = "#e85c5a";
const color90 = "#de3c41"; 
var resultColor = "";

// Cách 1: Đảo ngược thứ tự điều kiện (từ nhỏ đến lớn)
resultColor = data_history.pity <= 10 ? color10 :
              data_history.pity <= 30 ? color30 :
              data_history.pity <= 50 ? color50 :
              data_history.pity <= 60 ? color60 :
              data_history.pity <= 70 ? color70 :
              data_history.pity <= 80 ? color80 :
              data_history.pity <= 90 ? color90 :
              "#default"; // hoặc một màu mặc định
    return (
         <View style={{borderRadius:30,backgroundColor:"rgba(187, 171, 141,0.8)", marginHorizontal:3, marginTop:3,
                        display:"flex", flexDirection:"row",padding:5,borderColor:"#726d73",borderWidth:1}}>
            <Text style={[globalFont.fonts,{fontSize:14}]}>{data.find( (item1) => item1.id === data_history.idChar)?.name}</Text>
            <Text style={[globalFont.fonts,{fontSize:14, color:resultColor}]}> {data_history.pity}</Text>
        </View>
    )
}

export function WishSimulator(){

    SplashScreen.preventAutoHideAsync();

    const [loaded, error] = useFonts({
        'genshin_font': require('../assets/fonts/genshin_font.ttf'),
    }); 

    const videoRef = useRef<Video>(null);
    const [showVideo,setShowVideo] = useState(false);
    const [listGacha,setListGacha] = useState<Character[]>([]);
    const [showGachaList,setShowGachaList] = useState(false);
    const [intertwinedFate,setInterwinedFate] = useState(12);
    const [isVisible,setIsVisible] = useState(false);
    const [isVisibleHistory,setIsVisibleHistory] = useState(false);
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
                    transparent={true}
                    onRequestClose={() => setIsVisible(false)}
                    animationType="fade"
                    style={{justifyContent:"center",alignItems:"center"}}
                    
                    >
                    <View style={{flex:1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent:"center"}}>
                    <TouchableOpacity onPress={()=> {setIsVisible(false)}} style={styles.close_button_modal}>
                        <ImageBackground
                            source={closeButton}
                            style={{width:50,height:50}}
                        />
                    </TouchableOpacity>
                        <View style={styles.modalContainer}>
                            <ImageBackground style={{position:"absolute",width:622.3, height:350}} source={history_bg}/>
                            <View style={{display:"flex",flexDirection:"row",alignItems:"center"}}>
                                <Text style={[globalFont.fonts,{fontSize:22,marginRight:20}]}>Select banner:</Text>

                            </View>
                            <FlatList
                                data={banner}
                                scrollEnabled={true}
                                style={{height:200}}
                                showsVerticalScrollIndicator
                                renderItem={({item}) =>{
                                    return(
                                        <TouchableOpacity style={styles.select_item_banner}
                                            onPress={()=>{
                                                setSelectedBanner(item.id_banner);
                                                setIsVisible(false)
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
                        
                    </View>
                </Modal>
                
                 <Modal
                    visible={isVisibleHistory}
                    transparent={true}
                    onRequestClose={() => setIsVisibleHistory(false)}
                    animationType="fade"
                    style={{justifyContent:"center",alignItems:"center"}}
                    
                    >
                    <View style={{flex:1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent:"center"}}>
                    <TouchableOpacity onPress={()=> {setIsVisibleHistory(false)}}  style={styles.close_button_modal}>
                        <ImageBackground
                            source={closeButton}
                            style={{width:50,height:50}}
                        />
                    </TouchableOpacity>
                        <View style={styles.modalContainer}>
                            <ImageBackground style={{position:"absolute",width:622.3, height:350}} source={history_bg}/>
                            <View style={{display:"flex",flexDirection:"row",alignItems:"center"}}>
                                <Text style={[globalFont.fonts,{fontSize:22,marginRight:20}]}>History:</Text>

                            </View>
                            <FlatList
                                    style={{width:450,height:200}}
                                    numColumns={4}
                                    contentContainerStyle={{alignItems:"center"}}
                                    data={five_stars_history_pity}
                                    renderItem={({item}) =>{
                                        return(
                                            <PityCard
                                                data_history={item}
                                            />
                                        )
                                    }}
                                />
                        </View>
                        
                    </View>
                </Modal>               
                
                {showVideo &&  (
                <View>
                    <Video 
                        ref={videoRef} 
                        style={[styles.box]}
                        resizeMode={ResizeMode.COVER}
                        shouldPlay
                        useNativeControls={false}
                        source={getVideoPullPath(listGacha)} 
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
                            renderItem={({item}) => <GachaCard item={item}/> }
                            contentContainerStyle={{
                                flexGrow: 1,          
                                justifyContent: 'center',  
                                alignItems: 'center',     
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
                <View style={styles.button_view}>
                    
                    <View style={styles.button_bar}>
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
                            setIsVisibleHistory(true)
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
                                    setListGacha(gacha(rateUpCharId,1));
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
                                    setListGacha(gacha(rateUpCharId,10));
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
                    <View style={[styles.button_view]}>
                        <Image
                        style={styles.banner_style}
                        source={{uri: bannerUrl}}
                    />
                    </View>
                    <View style={[styles.button_bar]}>

                        <TouchableOpacity
                        style={styles.select_banner_button}
                        onPress={()=>{
                            setIsVisible(true);
                        }}>
                            <ImageBackground
                                source={pull_button_bg}
                                resizeMode="cover"
                                style={{position:'absolute',width:140,height:35,}}
                            >
                            <View>
                                <Text style={[globalFont.fonts,{alignSelf:"center",fontSize:12,color:"#a49a90",top:"50%"}]}>Select banner</Text>
                            </View>
                            </ImageBackground>
                        </TouchableOpacity>
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
                    </View>

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
        margin:"auto",
        // alignSelf:"center",
        // top:"35%",
        width:440,
        height:220,
        transform:[{rotate:"90deg"}],
        right:"35%"
    },
    button_view:{
        flex:1,
        // backgroundColor:"red",
        display:"flex",
        flexDirection:"row",
        justifyContent:"space-between"
    },
    button_bar:{
        width:70,
        top:"10%",
        alignItems:"center",
        // backgroundColor:"black"
    },
    store_button:{
        transform: [{rotate:'90deg'}],
        borderRadius:20,       
        width:140,height:35,
    },
    select_banner_button:{
        transform: [{rotate:'90deg'}],
        width:100,
        height:25,
        borderRadius:25,
        alignItems:"center",
        justifyContent:"center"
    },
    pull_button:{
        transform: [{rotate:'90deg'}],
        borderRadius:20,
        width:140,height:35,
        
    },
    intertwined_fate_amount:{
        transform: [{rotate:'90deg'}],
        width:100,
        height:25,
        backgroundColor:"rgba(92, 113, 124,0.6)",
        borderRadius:25,
        alignItems:"center",
        justifyContent:"center",
        marginTop:500
    },
      resultGachaCard: {
        width: 54, 
        height: 230,
        padding: 2,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius:30,
        alignSelf:"center"
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
        width:600,
        position:"absolute",
        marginTop:230,
        padding:10
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

    },
    select_item_banner:{
        backgroundColor:"#f6f1e7",
        borderColor:"#d5bf94",
        borderWidth:1,
        width:250,
        height:50,
        justifyContent: "center",

    },
    close_button_modal:{
        position:"absolute",
        top:"78%",
        left:"73%",
        zIndex:2
    }



})