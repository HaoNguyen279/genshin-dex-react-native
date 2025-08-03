import { StyleSheet, View, TouchableOpacity ,Text, FlatList, Modal, Animated, Dimensions, StatusBar, Platform, Alert} from "react-native"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import { AVPlaybackStatus, Video, ResizeMode } from "expo-av";
import React, { use, useEffect, useRef, useState } from "react";
import * as SplashScreen from 'expo-splash-screen';
import CustomSplashScreen from "./splashscreen/CustomSplashScreen";
import { Image, ImageBackground } from "expo-image";
import * as ScreenOrientation from 'expo-screen-orientation';
import Svg, { Path  } from 'react-native-svg';
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import * as FileSystem from 'expo-file-system';
import { GoogleGenAI } from "@google/genai";

import data from "../assets/data/character.json";
import banner from "../assets/data/banner.json";
import { GEMINI_API_KEY } from "@env";
import LoadingModal from "./splashscreen/Loading";
import { NavigationProp, useNavigation } from "@react-navigation/native";

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
var width : any; var height : any;
async function getResponse(prompt : string) {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: prompt,
    });
    console.log(response.text);
    return response.text;
}
async function getLuckyAnalysis(data : HistoryPity[]) {
    if(data.length === 0) return "Không có dữ liệu để phân tích";
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents : "Đọc chuỗi JSON sau, mỗi phần tử (document) đại diện cho một lần người dùng nhận được một nhân vật từ gacha. Mỗi document bao gồm: name (tên nhân vật), won (true nếu trúng rate-up, tức thắng 50/50), pity (số roll). Hãy phân tích và trả về kết quả bằng một vài dòng text (không dùng markdown, mỗi dòng bắt đầu bằng '> '). Bao gồm: Độ may mắn (dựa trên tỷ lệ win >50% thì 'Rất may mắn', =50% thì 'Bình thường', <50% thì 'Kém may mắn'), Nhân vật sở hữu nhiều nhất (dạng c0, c1,... c0 là sở hữu 1 lần, c1 là 2 lần..), Số lần pull (tổng pity), Win/Total (số lần won true / tổng document), Tỉ lệ win (phần trăm, làm tròn 2 chữ số), List char (ví dụ: Diluc c1, Dehya c2,...), Pity trung bình (Tổng pity chia số document, làm tròn 2 chữ số). Dữ liệu JSON: " + JSON.stringify(data),
    });

    console.log(response.text);
    return response.text ? response.text : "Không có dữ liệu để phân tích";
}

const preload_gacha_cards = data.map( char => char.gacha_card_url);
const preload_gacha_banners = banner.map( banner => banner.banner_url);

const that_hoang = [87,44,4,56,14,94,71,74];

var history = {
    "pity" : 0,
    "pulled" : [] as number[],
    "isGuaranteed_fiveStars": false,
    "isGuaranteed_fourStars": false,
};

interface HistoryPity {
    idChar: number;
    name : string;
    pity:number;
    won : boolean
}


var five_stars_history_pity : HistoryPity[];

async function initHistoryData() {
    try{
        const path = FileSystem.documentDirectory  + 'wish_history.json';
        const fileInfo = await FileSystem.getInfoAsync(path);
        if(!fileInfo.exists){
            console.log("File does not exist, creating one...");
            const defaultData : HistoryPity[] = [];
            await FileSystem.writeAsStringAsync(path, JSON.stringify(defaultData, null,2), {encoding: FileSystem.EncodingType.UTF8});
        }
        else{
            console.log("File already exists, reading history from file...");
            five_stars_history_pity = await readHistoryFromFile();// Code phía dưới CÓ đợi promise đc sovle
            const lastHistory = five_stars_history_pity[five_stars_history_pity.length - 1];
            if(that_hoang.includes(lastHistory.idChar)){
                history.isGuaranteed_fiveStars = true;
                console.log("Co bao hiem");
            }
        }
    }
    catch(error){
        console.warn("Caught error when trying to check if file is exists!");
    }
};

initHistoryData().then(test => console.log("Initialized history data!"));

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

const backgroundSource = require("../assets/wish_animation/wish_background.png");
const gachaBackground = require("../assets/wish_animation/gacha_background.webp");
const resultGachaCard = require("../assets/wish_animation/resultcard-bg.png");
const closeButton = require("../assets/wish_animation/close_button.png");
const button_bg = require("../assets/wish_animation/pull_button_bg.webp");
const intertwined_fate = require("../assets/wish_animation/intertwined_fate.webp");
const history_bg = require("../assets/wish_animation/history_bg.png");
const star_rarity = require("../assets/wish_animation/star.png");
const weapon_indicator = require("../assets/wish_animation/weapon_indicator.png");

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


// Lấy url của element icon, truyền vào tên element
// Ví dụ: getElementIcon("pyro") sẽ trả về url của icon Pyro
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

// Lấy mảng data các character 4 sao
const character_4stars = data.filter(item => item.rarity == 4);

// Write history data to wish_history file
async function writeHistoryToFile(data : HistoryPity[]){
    const path = FileSystem.documentDirectory + 'wish_history.json';
    try{
        await FileSystem.writeAsStringAsync(path, JSON.stringify(data, null, 2),{
        encoding: FileSystem.EncodingType.UTF8,
    });
        console.log('Saved at:', path);
    }
    catch(error) {
        console.error('Failed to save file:', error);
    }
}
// Read history data from wish_history file, returns an array of HistoryPity
async function readHistoryFromFile(){
    const path = FileSystem.documentDirectory + 'wish_history.json';
    try{
        const fileContent = await FileSystem.readAsStringAsync(path, {encoding: FileSystem.EncodingType.UTF8});
        const dataRead : HistoryPity[]  = JSON.parse(fileContent);
        console.log('Read file successfully:', dataRead);
        return dataRead;
    }catch(error){
        console.error('Failed to read file:', error);
        const errorData : HistoryPity[] = [ {idChar : 1, pity: 1,won : false,name: "Error",}];
        return errorData;
    }
}

// Reset history data in wish_history file
async function resetHistoryFromFile(){
    const emptyData : HistoryPity[] = [];
    await writeHistoryToFile(emptyData);
    history = {
        "pity" : 0,
        "pulled" : [] as number[],
        "isGuaranteed_fiveStars": false,
        "isGuaranteed_fourStars": false,
    };
    console.log("Successfully reset pull history!");
}

function getCharacterNameById(id : number) : string{
    return data.find(item => item.id === id)?.name || "Unknown";
}

// Lấy ngẫu nhiên 1 số trong khoảng từ min đến max, dùng để roll char
function getRandomNumber(min : number , max : number){
    return Math.floor(Math.random() *(max - min + 1)) + min;
}

// Lấy id của 4 sao rate up trong banner hiện tại
const getListId4StarsRateUp = (idBanner : number) =>{
    var list : string[]  = banner.find( (item) => item.id_banner === idBanner)?.four_stars_character!; 
    var listID : number[]  = [];
    for(let i = 0; i< 3 ;i++){
        listID.push( data.find((item)=> item.name === list[i])?.id!)
    }
    return listID;
}

// Lấy id của 4 sao rate up trong banner, bao gồm guaranteed 4stars system
const getWinResult4starsCharacterId = (isGuaranteed_fourStars : boolean,listIdChar4StarsBannerRateUp : number[])=>{
    if(isGuaranteed_fourStars){
        history.isGuaranteed_fourStars = false;
        return listIdChar4StarsBannerRateUp[getRandomNumber(0,2)];
    }
    else{
        if(1 === getRandomNumber(1,2)){
            history.isGuaranteed_fourStars = false;
            return listIdChar4StarsBannerRateUp[getRandomNumber(0,2)];;
        }
        else{
            history.isGuaranteed_fourStars = true;
            var charId4StarsRandom : number;
            while(true){
                var randId = character_4stars[getRandomNumber(0,character_4stars.length-1)].id
                if(!listIdChar4StarsBannerRateUp.includes(randId)){
                    charId4StarsRandom = randId;
                    break;
                }
            }
            return charId4StarsRandom;
        }
    }
}

// Chance
const FOUR_STAR_CHANCE = 51; // 5.1% = 51/1000
const FIVE_STAR_CHANCE = 6; // 0.6% = 6/1000


// Lấy random ra (url) của 1 trong 5 vũ khí 3 sao
function getRandom3starWeaponAsset(){
    return map_3star_weapons.get(getRandomNumber(1,5));
}
const randomFour = () : number[]=>{
    // Dùng Set để tránh bị trùng number. nếu add số đã có thì Set tự bỏ qua
    var resultSet = new Set<number>();
    while(resultSet.size < FOUR_STAR_CHANCE){
        resultSet.add(getRandomNumber(1,1000));
    }
    // Cú pháp ... chuyển Set về Array bình thường
    return [...resultSet];
}
const randomFive = (arrayFourStarNumber : number[], addChance : number)=>{
    var resultSet = new Set();
    while(resultSet.size< FIVE_STAR_CHANCE + addChance){
        var rand = getRandomNumber(1,1000);
        if(!arrayFourStarNumber.includes(rand))
            resultSet.add(rand);
    }
    return [...resultSet];
}

const getWinResult5starsCharacterId = (isGuaranteed_fiveStars : boolean,idChar5StarsBannerRateUp : number) =>{
    if(isGuaranteed_fiveStars){
        // history.isGuaranteed_fiveStars = false;
        return idChar5StarsBannerRateUp;
    }
    else{
        if(1 === getRandomNumber(1,2)){
            // history.isGuaranteed_fiveStars = false;
            return idChar5StarsBannerRateUp;
        }
        else{
            // history.isGuaranteed_fiveStars = true;
            return that_hoang[getRandomNumber(0,7)];
        }
    }
}


function gacha(idChar5StarsBannerRateUp : number, pull : number, idBanner : number ){

    var character_id : number[] = [];
    for(let i = 0;i <pull; i++){
        // Khá quan trọng, liên quan đến pity system
        // Ví dụ mảng history.pulled = [3,3,3,3,3,4,3,3,3,3,5,3]
        // Hiện tại sau khi roll đc 5star sẽ đang chỉ có 1 pity, ta lấy lastIndexof(5) để lấy ra vị trí của 5 sao cuối cùng
        // Sau đó lấy length - lastIndexof(5) để tính ra pity 5 sao hiện tại ( = 1 )
        // Tương tự với 4 sao
        var lastIndexof4 = history.pulled.lastIndexOf(4);
        var lastIndexof5 = history.pulled.lastIndexOf(5);
        var pity_4 = history.pulled.length - lastIndexof4;
        var pity_5 = history.pulled.length - lastIndexof5;

        var four_stars_numbers_array = randomFour();
        var five_stars_numbers_array;
        if(pity_5 > 73 && pity_5 < 85 ){
            five_stars_numbers_array = randomFive(four_stars_numbers_array, (pity_5-73) * 50);
        }
        else if(pity_5 >= 85 && pity_5 < 90){
            five_stars_numbers_array = randomFive(four_stars_numbers_array, 200 );
        }
        else{
            five_stars_numbers_array = randomFive(four_stars_numbers_array,0); 
        }
        var randNumb = getRandomNumber(1,1000);
        try{
            if(pity_5 < 90){
                if(pity_4 < 10){
                    if(five_stars_numbers_array.includes(randNumb)){
                        var idCharGot = getWinResult5starsCharacterId(history.isGuaranteed_fiveStars,idChar5StarsBannerRateUp);
                        character_id.push(idCharGot);

                        const checkLimitChar = !that_hoang.includes(idCharGot);
                        const won = checkLimitChar && !history.isGuaranteed_fiveStars;
                        if(checkLimitChar) history.isGuaranteed_fiveStars = false;
                        else history.isGuaranteed_fiveStars = true;
                        
                        five_stars_history_pity.push({idChar :idCharGot, pity:pity_5, won, name: getCharacterNameById(idCharGot)});
                        console.log("Pulled 5 stars : " + data.find(item => item.id === idCharGot)?.name + " with won: " + won);
                        history.pulled.push(5);
                        writeHistoryToFile(five_stars_history_pity);
                    }
                    else if(four_stars_numbers_array.includes(randNumb)){
                        const randomChar : number = getWinResult4starsCharacterId(history.isGuaranteed_fourStars, getListId4StarsRateUp(idBanner))!
                        console.log("Pulled 4 stars : " + data.find(item => item.id === randomChar)?.name);
                        character_id.push(randomChar && randomChar ? randomChar : 999);
                        history.pulled.push(4);
                    }
                    else{
                        character_id.push(999);
                        history.pulled.push(3);
                    }
                }
                else{
                    const randomChar : number = getWinResult4starsCharacterId(history.isGuaranteed_fourStars, getListId4StarsRateUp(idBanner))!
                    console.log("Pulled 4 stars : " + data.find(item => item.id === randomChar)?.name);
                    character_id.push(randomChar && randomChar ? randomChar : 999);
                    history.pulled.push(4);
                }
            }
            else{
                var idCharGot : number = getWinResult5starsCharacterId(history.isGuaranteed_fiveStars,idChar5StarsBannerRateUp);
                character_id.push(idCharGot);

                const checkLimitChar = !that_hoang.includes(idCharGot);
                const won = checkLimitChar && !history.isGuaranteed_fiveStars;
                if(checkLimitChar) history.isGuaranteed_fiveStars = false;
                else history.isGuaranteed_fiveStars = true;

                five_stars_history_pity.push({idChar :idCharGot, pity:pity_5, won, name: getCharacterNameById(idCharGot)});
                history.pulled.push(5);
                console.log("Pulled 5 stars : " + data.find(item => item.id === idCharGot)?.name + " with won: " + won);
                writeHistoryToFile(five_stars_history_pity);
            }
        }
        catch(error){
            console.error("Error when trying to gacha: " + error);
        }
    }


    var resultSet : Character[]  = [];
    for( let i = 0 ;i < character_id.length; i++){
        var char = data.find(item => item.id == character_id[i]);
        if(char) resultSet.push(char);
    }
    // Sắp xếp result set theo rarity từ cao xuống thấp
    // Trong game thực tế sẽ sắp xếp theo rarity
    resultSet.sort((a, b) => b.rarity - a.rarity);
    return resultSet;
}

function getVideoPullPath(array : Character[] ){
    if(array.at(0)?.rarity === 5){
        return require("../assets/wish_animation/wish_ani_5stars.mp4");
    }
    else if(array.at(0)?.rarity === 4){
        return require("../assets/wish_animation/wish_ani_4stars.mp4");
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
        
        <View style={{ alignItems:"center"}}>
            <View style={{position:"absolute", zIndex:2, flexDirection:"row",top:"80%"}}>
                <Image source={star_rarity} style={{width:10,height:10}}/>
                <Image source={star_rarity} style={{width:10,height:10}}/>
                <Image source={star_rarity} style={{width:10,height:10}}/>
            </View>
            <View style={{position:"absolute", zIndex:2, flexDirection:"row",top:"60%"}}>
                <Image
                    source={weapon_indicator}
                    style={{width:40,height:40}}
                />
            </View>
            <ImageBackground source={resultGachaCard} style={styles.gachaCard}>
              <Image 
                source={getRandom3starWeaponAsset()}
                style={styles.gachaCharacter}
                contentFit="cover"
                priority={"high"}
              />
            </ImageBackground>
        </View  >
      </View>
    );
  }
  
  return (

      <View style={styles.resultGachaCard}>
        <ShadowEffect isFiveStars={item.rarity === 5}/>
            <View style={{ alignItems:"center"}}>
                <View style={{position:"absolute", zIndex:2, flexDirection:"row",top:"80%"}}>
                    <Image source={star_rarity} style={{width:10,height:10}}/>
                    <Image source={star_rarity} style={{width:10,height:10}}/>
                    <Image source={star_rarity} style={{width:10,height:10}}/>
                { item.rarity == 4 && (
                    <Image source={star_rarity} style={{width:10,height:10}}/>
                )}
                {item.rarity == 5 && (
                    <View style={{flexDirection:"row"}}>
                        <Image source={star_rarity} style={{width:10,height:10}}/><Image source={star_rarity} style={{width:10,height:10}}/>
                    </View>
                )}
            </View>
            <View style={{position:"absolute", zIndex:2, flexDirection:"row",top:"60%"}}>
                <Image
                    source={getElementIcon(item.element)}
                    style={{width:35,height:35}}
                />
            </View>
            <ImageBackground source={resultGachaCard} style={styles.gachaCard}>
              <Image 
                source={{ uri: item.gacha_card_url }}
                style={styles.gachaCharacter}
                contentFit="cover"
                priority={"high"}
              />
            </ImageBackground>
            </View>
      </View>

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

    resultColor =   data_history.pity <= 10 ? color10 :
                    data_history.pity <= 30 ? color30 :
                    data_history.pity <= 50 ? color50 :
                    data_history.pity <= 60 ? color60 :
                    data_history.pity <= 70 ? color70 :
                    data_history.pity <= 80 ? color80 :
                    data_history.pity <= 90 ? color90 :
                    "#default"; 
    return (
         <View style={{borderRadius:30,backgroundColor:"rgba(187, 171, 141,0.8)", marginHorizontal:3, marginTop:3,
                        display:"flex", flexDirection:"row",padding:5,borderColor:"#726d73",borderWidth:1}}>
            <Text style={[globalFont.fonts,{fontSize:14}]}>{data.find( (item1) => item1.id === data_history.idChar)?.name}</Text>
            <Text style={[globalFont.fonts,{fontSize:14, color:resultColor}]}> {data_history.pity}</Text>
        </View>
    )
}

const PityAnlysisModal : React.FC<{ isVisiblePityAnalysis: boolean, setIsVisiblePityAnalysis: (visible: boolean) => void, responseText : string }> = ({ isVisiblePityAnalysis, setIsVisiblePityAnalysis, responseText }) => {
    // const [modalReady, setModalReady] = useState(false);
    // useEffect(() => {
    //     if (isVisiblePityAnalysis) {
    //         // Delay để đảm bảo iOS ready
    //         setTimeout(() => setModalReady(true), Platform.OS === 'ios' ? 1000 : 500);
    //     } else {
    //         setModalReady(false);
    //     }
    // }, [isVisiblePityAnalysis]);
    return (
        <Modal
            visible={isVisiblePityAnalysis}
            transparent={true}// Quan trọng cho iOS
            statusBarTranslucent={Platform.OS !== 'ios'} // ✅ iOS-specific
            supportedOrientations={['landscape']}  // Cho iOS landscape
            onRequestClose={() => setIsVisiblePityAnalysis(false)}
            animationType="fade"
            >
            <View style={styles.modalContainer}>
                <View style={styles.modal_button_bar}>
                    <TouchableOpacity onPress={()=> {setIsVisiblePityAnalysis(false)}} style={styles.modal_close_button}>
                        <ImageBackground source={closeButton} style={styles.modal_close_button} resizeMode="cover" />  
                    </TouchableOpacity>
                </View>
                <ImageBackground style={styles.modal_book_bg} source={history_bg}  resizeMode="cover"/>
                <View style={styles.modal_content}>
                    <View style={{flex:1,display:"flex",alignItems:"center",maxWidth:"70%"}}>
                        <Text style={[globalFont.fonts,{fontSize:16,marginBottom:10}]}>Pity Analysis by Gemini Flash 2.5</Text>
                        <Text style={[globalFont.fonts,{fontSize:12}]}>{responseText}</Text>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export function WishSimulator(){

    SplashScreen.preventAutoHideAsync();

    const navigation : NavigationProp<RootStackParamList> = useNavigation();

    const videoRef = useRef<Video>(null);
    const [showVideo,setShowVideo] = useState(false);
    const [listGacha,setListGacha] = useState<Character[]>([]);
    const [showGachaList,setShowGachaList] = useState(false);
    const [intertwinedFate,setInterwinedFate] = useState(100);
    const [analysisResult, setAnalysisResult] = useState("");

    const [isVisibleBanner,setIsVisibleBanner] = useState(false);
    const [isLoading,setIsLoading] = useState(false);
    const [isVisibleHistory,setIsVisibleHistory] = useState(false);
    const [isVisiblePityAnalysis,setIsVisiblePityAnalysis] = useState(false);

    const [selectedBanner,setSelectedBanner] = useState(1);
    const [bannerUrl,setBannerUrl] = useState("");
    const [rateUpCharId,setRateUpCharId] = useState<number>(1);

    const [size, setSize] = useState({width: 0, height: 0});
    const [loading, setLoading] = useState(true);
    const [orientationReady, setOrientationReady] = useState(false);

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
            // console.log("Selected banner:", foundBanner.five_stars_character, "with id:", charId);
        } else {
            setBannerUrl("");
            // console.warn("Banner not found for id:", selectedBanner);
        }
    }, [selectedBanner]);

    useEffect(() => {
	    const preloadImages = async () => {
        await Promise.all(preload_gacha_cards.map( url => Image.prefetch(url)))
            // .then(() => console.log("Preloaded gacha card successfully!"))
            .catch(err => console.warn("Failed to preload gacha card? -----" + err) );
        await Promise.all(preload_gacha_banners.map(item => Image.prefetch(item)))
            // .then(() => console.log("Preloaded banner image successfully!"))
            .catch(err => console.warn("Failed to preload banner image? -----" + err) );
        setLoading(false);
        };
        preloadImages();
        setTimeout(()=> {setLoading(false)}, 15000);
    }, []);
    
        useEffect(() => {
            const unsubscribe = navigation.addListener("focus", async () =>{
                try {
                    await ScreenOrientation.lockAsync(
                        ScreenOrientation.OrientationLock.LANDSCAPE
                    );
                    const { width: newWidth, height: newHeight } = Dimensions.get('window');
                    setSize({ width: newWidth, height: newHeight });
                    setOrientationReady(true);
                    StatusBar.setHidden(true, 'fade');
                } catch (error) {
                    console.warn('Error handling focus event:', error);
                }
            });
            const unsubscribeBlur = navigation.addListener('blur', () => {
                // console.log("WishSimulator blurred");
                StatusBar.setHidden(false, 'fade');
            });

            return () => {
                unsubscribe();
                unsubscribeBlur();
            };
        }, [navigation]);

    useEffect(() => {
        const setupScreenAndStatusBar = async () => {
            try {
                StatusBar.setHidden(true, 'fade');
                // await new Promise(resolve => setTimeout(resolve, 1000));
                await ScreenOrientation.lockAsync(
                    ScreenOrientation.OrientationLock.LANDSCAPE
                ).then(() => {
                    console.log("Screen orientation locked to landscape");
                    setOrientationReady(true);
                    setSize({width: Dimensions.get('window').width, height: Dimensions.get('window').height});
                    height = size.height;
                    width = size.width;
                });
            } catch (error) {
                console.warn('Error setting up screen:', error);
                setOrientationReady(true);
                setSize({width: Dimensions.get('window').width, height: Dimensions.get('window').height});
                height = size.height;
                width = size.width;
            }
        }; 
        if(!orientationReady) setupScreenAndStatusBar();

        return () => {
            StatusBar.setHidden(false, 'fade');
            ScreenOrientation.unlockAsync();
        };
    }, []);
    

    if (loading || !orientationReady) return <CustomSplashScreen />;

    

    return(
    <SafeAreaProvider>
        <LoadingModal visible={isLoading} />
        <PityAnlysisModal   isVisiblePityAnalysis={isVisiblePityAnalysis}
                            setIsVisiblePityAnalysis={setIsVisiblePityAnalysis}
                            responseText={analysisResult} />
            <View style={{flex:1}}>
                <ImageBackground style={styles.container} source={backgroundSource} contentFit="cover">

                {/* Modal for selecting banner */}
                <Modal
                    visible={isVisibleBanner}
                    transparent={true}
                    // 
                    presentationStyle="overFullScreen" // Quan trọng cho iOS
                    supportedOrientations={['landscape']} // Cho iOS landscape
                    onRequestClose={() => setIsVisibleBanner(false)}
                    animationType="fade">
                        <View style={styles.modalContainer}>
                            <View style={styles.modal_button_bar}>
                                <TouchableOpacity onPress={()=> {setIsVisibleBanner(false)}} style={styles.modal_close_button}>
                                    <ImageBackground source={closeButton} style={styles.modal_close_button} />
                                </TouchableOpacity>
                            </View>
                            <ImageBackground style={styles.modal_book_bg} source={history_bg}/>
                            <View style={styles.modal_content}>
                                <View style={{display:"flex",flexDirection:"row",alignItems:"center"}}>
                                    <Text style={[globalFont.fonts,{fontSize:scale(18),marginRight:20}]}>Select banner:</Text>
                                </View>
                                <FlatList
                                    data={banner}
                                    scrollEnabled={true}
                                    showsVerticalScrollIndicator
                                    style={{width:400,height:200}}
                                    renderItem={({item}) =>{
                                        return(
                                            <TouchableOpacity style={styles.select_item_banner}
                                                onPress={()=>{
                                                    setSelectedBanner(item.id_banner);
                                                    setIsVisibleBanner(false)
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
                    
                    presentationStyle="overFullScreen" // Quan trọng cho iOS
                    supportedOrientations={['landscape']} // Cho iOS landscape
                    onRequestClose={() => setIsVisibleHistory(false)}
                    animationType="fade"
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modal_button_bar}>
                                <TouchableOpacity onPress={()=> {setIsVisibleHistory(false)}}  style={styles.modal_close_button}>
                                    <ImageBackground source={closeButton}style={styles.modal_close_button} />
                                </TouchableOpacity>
                            </View>
                            <ImageBackground style={styles.modal_book_bg} source={history_bg}/>
                            <View style={styles.modal_content}>
                                <Text style={[globalFont.fonts,{fontSize:22,marginRight:20,textAlign:"center",padding:10}]}>History:</Text>
                                <FlatList
                                        style={{width:450,height:170}}
                                        numColumns={4}
                                        contentContainerStyle={{alignItems:"center"}} 
                                        data={five_stars_history_pity}
                                        renderItem={({item}) =>{
                                            return(   <PityCard data_history={item}/>)
                                        }} />
                                    <TouchableOpacity
                                        onPress={() => {
                                            resetHistoryFromFile();
                                            initHistoryData();
                                            setIsVisibleHistory(false);
                                        }}
                                    >
                                        <Text style={[globalFont.fonts,{alignSelf:"center",fontSize:12,color:"#a49a90",top:"50%"}]}>Reset History</Text>
                                    </TouchableOpacity>
                            </View>
                            
                        </View>
                    
                </Modal>               
                
                
                { showGachaList &&
                (<ImageBackground
                    source={gachaBackground}
                    style={{flex:1, justifyContent:"center", alignItems:"center", zIndex:2}}
                    >
                    <View style={{flex:1, alignItems:"center",display:"flex", flexDirection:"column"}}>
                        <FlatList
                            data={listGacha}
                            horizontal={true}
                            style={ styles.flatList }
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({item,index}) => <AnimatedItem index={index}><GachaCard item={item}/></AnimatedItem> }
                            contentContainerStyle={{
                                flexGrow: 1,          
                                justifyContent: 'center',  
                                alignItems: 'center',     
                            }}
                               
                        />

                        <View style={{width:"80%",display:"flex",flexDirection:"row",position:"absolute",justifyContent:"flex-end",marginTop:scale(40)}}>
                            <TouchableOpacity
                            style={styles.closeButton}
                            onPress={()=> {setShowGachaList(false)}}
                            >
                                <ImageBackground
                                source={closeButton}
                                style={{width:30,height:30}}
                            />
                        </TouchableOpacity>
                        </View>
                    </View>
                </ImageBackground>
                )}

                {!showGachaList && !showVideo &&(
                <View style={styles.button_view}>
                    
                    {/* Button bar 1 */}
                    <View style={[styles.button_bar,{marginTop:scale(5)}]}>
                        <View  style={styles.button_group_2}>
                            <TouchableOpacity style={styles.button_} onPress={()=>{navigation.navigate("Welcome")}}>
                                <ImageBackground
                                    source={button_bg}
                                    contentFit="cover"
                                    style={styles.img_bg_button}>
                                <View style={styles.view_text_button}>
                                    <Text style={styles.text_button}>Exit</Text>
                                </View>
                                </ImageBackground>
                            </TouchableOpacity>
                            
                            <TouchableOpacity style={styles.button_} onPress={()=>{setIsVisibleBanner(true);}}>
                                <ImageBackground
                                    source={button_bg}
                                    contentFit="cover"
                                    style={styles.img_bg_button}>
                                <View style={styles.view_text_button}>
                                    <Text style={styles.text_button}>Select banner</Text>
                                </View>
                                </ImageBackground>
                            </TouchableOpacity>
    
                            <TouchableOpacity style={styles.button_}
                            onPress={async ()=>{
                                try {
                                    setIsLoading(true);
                                    const dataRead = await readHistoryFromFile();
                                    const result = await getLuckyAnalysis(dataRead);
                                    // Batch updates
                                    setTimeout(() => {
                                        setAnalysisResult(result);
                                        setIsLoading(false);
                                        setIsVisiblePityAnalysis(true);
                                    }, 100);
                                } catch (error) {
                                    setIsLoading(false);
                                    console.log("Error analyzing history: " + error);
                                    // iOS-specific error handling
                                    if (Platform.OS === 'ios') {
                                        Alert.alert('Error', 'Failed to analyze history. Please try again.');
                                    }
                                }
                            }}>
                                <ImageBackground
                                    source={button_bg}
                                    contentFit="cover"
                                    style={styles.img_bg_button}
                                >
                                <View style={styles.view_text_button}>
                                    <Text style={styles.text_button}>Pity analysis AI</Text>
                                </View>
                                </ImageBackground>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.intertwined_fate_amount}>
                            <View style={{display:"flex", flexDirection:"row", alignItems:"center"}}>
                                <Image
                                    source={intertwined_fate}
                                    style={{width:20, height:20}}
                                    contentFit="cover"/>
                                <Text style={[globalFont.fonts, {fontSize:14, alignSelf:"center", color:"white"}]}>{intertwinedFate}</Text>
                            </View>
                        </View>
                    </View>
                    
                    {/* Banner image */}
                        <View style={styles.banner_image_container}>
                            <ImageBackground
                                source={bannerUrl}
                                style={styles.banner_image}
                                contentFit="contain"
                                priority={"high"}
                            />
                        </View>

                    {/* Button bar 2 */}
                    <View style={styles.button_bar}>
                        <View style={styles.button_group_2}>
                            <TouchableOpacity
                            style={styles.button_}
                            onPress={()=>{
                                setInterwinedFate(intertwinedFate+100);
                            }}>
                                <ImageBackground
                                    source={button_bg}
                                    contentFit="cover"
                                    style={styles.img_bg_button}
                                >
                                <View style={styles.view_text_button}> 
                                    <Text style={styles.text_button}>Shop</Text>
                                </View>
                                </ImageBackground>
                            </TouchableOpacity>
                            <TouchableOpacity
                            style={styles.button_}
                            onPress={()=>{
                                setIsVisibleHistory(true)
                            }}>
                                <ImageBackground
                                    source={button_bg}
                                    contentFit="cover"
                                    style={styles.img_bg_button}
                                >
                                <View style={styles.view_text_button}>
                                    <Text style={styles.text_button}>History</Text></View>
                                </ImageBackground>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.button_group_2}>
                            <TouchableOpacity style={styles.button_}
                                onPress={()=>{
                                    if(intertwinedFate -1 >= 0){
                                        setShowVideo(true)
                                        setListGacha(gacha(rateUpCharId,1,selectedBanner));
                                        setInterwinedFate(intertwinedFate-1);
                                    }
                                }}>
                                    <ImageBackground
                                        source={button_bg}
                                        contentFit="cover"
                                        style={styles.img_bg_button}
                                    >
                                    <View style={styles.view_text_button}>
                                        <Text style={styles.text_button}>Wish x1</Text>
                                        <Text style={styles.text_button}>x1 <Image source={intertwined_fate} style={{width:15, height:15,position:"absolute"}} contentFit="cover" /></Text>
                                    </View>
                                    </ImageBackground>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button_}
                                onPress={()=>{
                                    if(intertwinedFate -10 >= 0){
                                        setListGacha(gacha(rateUpCharId,10,selectedBanner));
                                        setShowVideo(true);
                                        setInterwinedFate(intertwinedFate-10);
                                    }
                                }}>
                                    <ImageBackground source={button_bg} contentFit="cover" style={styles.img_bg_button}>
                                    <View style={styles.view_text_button}>
                                        <Text style={styles.text_button}>Wish x10</Text>
                                        <Text style={styles.text_button}>x10 <Image source={intertwined_fate} style={{width:15, height:15,position:"absolute"}} contentFit="cover" /></Text>
                                    </View>
                                    </ImageBackground>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View> /*end button_view */
                )}
                </ImageBackground>

                {showVideo &&  (
                <View style={styles.video_overlay}>
                    <Video 
                        ref={videoRef} 
                        style={styles.video_fullscreen}
                        resizeMode={ResizeMode.COVER}
                        shouldPlay
                        useNativeControls={false}
                        source={getVideoPullPath(listGacha)} 
                        onPlaybackStatusUpdate={handleStatus}
                        /> 
                    <View  style={{position:"absolute",top:0, width:"100%", height:100, justifyContent:"center", alignItems:"flex-end"}}>
                        <TouchableOpacity
                            style={styles.skip_button}
                            onPress={()=>{
                                // SplashScreen.preventAutoHideAsync();
                                // setTimeout( () => {SplashScreen.hideAsync()}, 3000);
                                setShowVideo(false);
                                setShowGachaList(true);
                            }}
                            >
                            <Text style={[globalFont.fonts, {color:"white", fontSize:16}]}>Skip ▶</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                )}
           
        </View>
    </SafeAreaProvider>
    )
}
interface ShadowEffectProps{
    isFiveStars : boolean;
}

// Component Effect này gen bằng GPT + Claude, tạo hiệu ứng shadow cho card khi gacha
const ShadowEffect : React.FC<ShadowEffectProps> = React.memo(({isFiveStars}) => {
    var color : any;
    if(isFiveStars) color = "rgb(249, 171, 6) ";
    else color = "rgb(198, 85, 219)";
    const width = 68;
    const height = 230;
    const centerX = width / 2;

    const pathData = `
    M ${centerX} 0
    C ${centerX + width/2} ${height * 0.2} ${centerX + width/2} ${height * 0.8} ${centerX} ${height}
    C ${centerX - width/2} ${height * 0.8} ${centerX - width/2} ${height * 0.2} ${centerX} 0
    Z
    `;

  return (
    <View style={styles.shadow_effect}>
      <Svg
        width={width + 120}
        height={height + 300}
        viewBox={`-60 -150 ${width + 120} ${height + 300}`}
      >
        {/* Blur dọc trên */}
        {Array.from({ length: 10 }, (_, i) => {
        const dy = -2 * (i + 1);
        const alpha = 0.12 * Math.exp(-i / 18);
        var fillColor; 
        if(isFiveStars) fillColor = "rgba(249, 171, 6, "  + alpha.toFixed(3) + ")";
        else fillColor = "rgba(198, 85, 219, " + alpha.toFixed(3) + ")";
        return (
            <Path
                key={`blur-top-${i}`}
                d={pathData}
                fill={fillColor}
                transform={`translate(0, ${dy})`}
            />
          );
        })}

        {/* Blur dọc dưới */}
        {Array.from({ length: 10 }, (_, i) => {
        const dy = 2 * (i + 1);
        const alpha = 0.12 * Math.exp(-i / 18);
        var fillColor;
        if(isFiveStars) fillColor = "rgba(249, 171, 6, "  + alpha.toFixed(3) + ")";
        else fillColor = "rgba(198, 85, 219, " + alpha.toFixed(3) + ")";
        return (
            <Path
                key={`blur-bottom-${i}`}
                d={pathData}
                fill={fillColor}
                transform={`translate(0, ${dy})`}
            />
          );
        })}

        {/* Blur xung quanh */}
        {Array.from({ length: 12 }, (_, i) => {
        const radius = 1.5 * (i + 1); // nhỏ hơn => mịn hơn
        const alpha = 0.09 * Math.exp(-i / 6);
        const positions = Array.from({ length: 20 }, (_, j) => {
            const angle = (j / 20) * 2 * Math.PI;
            const dx = parseFloat((Math.cos(angle) * radius).toFixed(1));
            const dy = parseFloat((Math.sin(angle) * radius).toFixed(1));
            return [dx, dy];
          });
        var fillColor : any;
        if(isFiveStars) fillColor = "rgba(249, 171, 6, "  + alpha.toFixed(3) + ")";
        else fillColor = "rgba(198, 85, 219, " + alpha.toFixed(3) + ")";
        return positions.map(([dx, dy], idx) => (
            <Path
              key={`blur-around-${i}-${idx}`}
              d={pathData}
              fill={fillColor}
              transform={`translate(${dx}, ${dy})`}
            />
          ));
        })}

        {/* Path chính */}
        <Path
          d={pathData}
          fill={color}
          stroke={color}
          strokeWidth={1}
        />
      </Svg>
    </View>
  );
});
type Props = {
  index: number;
  children: React.ReactNode;
};
// Quả animated này GPT làm nốt, chạy ok vê lờ ;)
const AnimatedItem: React.FC<Props> = ({ index, children }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: 0,
        duration: 300,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        opacity,
        transform: [{ translateX }],
      }}
    >
      {children}
    </Animated.View>
  );
};
const globalFont = StyleSheet.create({
    fonts:{
        fontFamily:"genshin_font"
    }
})
const styles = StyleSheet.create({
    shadow_effect: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        width: 55,  
        height: 230, 
        overflow: 'visible',
        marginTop:35
    },
        video_overlay:{
        position: "absolute",
        flex: 1,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor:"white",

    },
    video_fullscreen:{
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    // Button view ( chiếm toàn bộ màn hình landscape )
    // Chia layout 1:1:1 3 row, row giữa là banner, 2 row còn lại là button
    button_view:{
        display:"flex",
        flex:1,
        width: width,
        height: height,
        alignItems:"center",
        flexDirection:"column",
        justifyContent:"space-between",
    },
    // Button bar style, each button bar is a row of the layout
    button_bar:{
        width:"90%",
        minHeight: scale(50),
        paddingVertical: scale(10),
        display:"flex",
        flexDirection:"row",
        justifyContent:"space-between",
        zIndex:1,
    },
    // Gôm 2 button lại thành 1 group_button
    button_group_2:{
        display:"flex",
        flexDirection:"row",
    },
    // Button style
    button_:{
        borderRadius:20,
        width:scale(120),
        height:scale(30),
        marginHorizontal:scale(5),
    },
    // Image background for button
    img_bg_button:{
        flex:1,
    },
    // View that contains text for button
    view_text_button:{
        flex:1,
        alignItems:"center",
        justifyContent:"center"
    },
    text_button:{
        fontFamily:"genshin_font",
        fontSize:scale(11),
        color: "#a49a90"
    },
    banner_image_container:{
        position:"absolute",
        width: "50%",
        height: "100%",
        display:"flex",
        flexDirection:"column",
        alignItems:"center",
        justifyContent:"center",
    },
    banner_image:{
        width: "100%",
        height: "100%",
    },
    intertwined_fate_amount:{
        width:100,
        height:25,
        backgroundColor:"rgba(92, 113, 124,0.6)",
        borderRadius:25,
        alignItems:"center",
        justifyContent:"center",
    },
    resultGachaCard: {
        width: 54, 
        // height: 230,
        height:300,
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
        width:scale(30),
        height:scale(30),
    },
    flatList:{
        alignSelf:"center",
        width:"100%",
    },
    skip_button:{
        zIndex:2,
        padding:10,
        margin:10,
        marginRight:20,
        position:"absolute", // ====================================
    },
    modalContainer:{
        flex:1,
        position:"relative",
        alignContent:"center",
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:"rgba(0,0,0,0.5)",

    },
    modal_content:{
        position:"absolute",
        display:"flex",
        flexDirection:"column",
        justifyContent:"center",
        alignContent:"center",
        alignItems:"center",
        paddingBottom:scale(40),
        maxHeight:height * 0.7,
    },
    modal_button_bar:{
        display:"flex",
        position:"absolute",
        width:"70%",
        flexDirection:"row",
        justifyContent:"flex-end",
        zIndex:2,
        top:scale(40),
    },
    modal_close_button:{
        width:scale(40),
        height:scale(40),
    },
    modal_book_bg:{
        position: "absolute",
        width: "70%", 
        height: "80%", 
        zIndex: 0, 
    },
    select_item_banner:{
        backgroundColor:"#f6f1e7",
        borderColor:"#d5bf94",
        borderWidth:1,
        width:width * 0.4,
        height:scale(40),
        justifyContent: "center",

    },
})