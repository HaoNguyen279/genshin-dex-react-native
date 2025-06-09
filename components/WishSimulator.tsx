import { StyleSheet, View, Button, ImageBackground, Image, TouchableOpacity ,Text, FlatList} from "react-native"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import { AVPlaybackNativeSource, AVPlaybackStatus, Video, ResizeMode } from "expo-av";
import { useRef, useState } from "react";
import data from "../assets/data.json"

const videoSource = require("../assets/wish_animation/wish_ani_5stars.mp4");
const backgroundSource = require("../assets/wish_animation/wish_screen.png");
const gachaBackground = require("../assets/wish_animation/gacha_background.webp");
const resultGachaCard = require("../assets/wish_animation/resultcard-bg.png");
const closeButton = require("../assets/wish_animation/close_button.png")

const FIVE_STARS_RATE = 0.006;
const FOUR_STAR_RATE = 0.051;
function getRandomCharacterId(min : number , max : number){
    return Math.floor(Math.random() *(max - min + 1)) + min;
}


const randomFour = () : number[]=>{
    var resultSet = new Set<number>();
    while(resultSet.size < 51){
        resultSet.add(getRandomCharacterId(1,1000));
    }
    console.log("cac ne 4 sao :" + [...resultSet])
    return [...resultSet];
}
const randomFive = (array : number[])=>{
    var resultSet = new Set();
    while(resultSet.size< 6){
        var rand = getRandomCharacterId(1,1000);
        if(!array.includes(rand))
            resultSet.add(rand);
    }
    console.log("5 sao");
    console.log([...resultSet])
    return [...resultSet];
}

randomFive(randomFour());
function gacha(){
    var character_id  =[];
    for(let i = 0;i <10; i++){
        character_id.push(getRandomCharacterId(1,85));
        console.log(character_id);
    }
    return character_id;
    
}
export function WishSimulator(){
    const videoRef = useRef<Video>(null);
    const [status,setStatus] = useState<AVPlaybackStatus>()
    
    const [showVideo,setShowVideo] = useState(false);
    const [listGacha,setListGacha] = useState<number[]>([]);
    const handleStatus = (status : AVPlaybackStatus)=>{
        if(!status.isLoaded) return;
        if(status.didJustFinish){
            setShowVideo(false);
            setShowGachaList(true);
        
        }
    }
    
    const [showGachaList,setShowGachaList] = useState(false);
    return(
        <SafeAreaProvider>
            <SafeAreaView style={{backgroundColor:"black", flex:1}}>
                    <View>
                        <View style={styles.container}>
                            <ImageBackground
                                    style={styles.box}
                                    source={backgroundSource}
                            >
                                {showVideo && (
                                    <Video 
                                        ref={videoRef} 
                                        style={[styles.box]}
                                        resizeMode={ResizeMode.COVER}
                                        shouldPlay
                                        useNativeControls={false} 
                                        source={videoSource} 
                                        onPlaybackStatusUpdate={handleStatus}
                                        /> 
                                )}
                                { showGachaList &&
                                    (<ImageBackground
                                        source={gachaBackground}
                                        style={styles.box}
                                        >
                                        <View style={{position:"relative"}}>
                                            <FlatList
                                                data={data.filter(item => listGacha.includes(item.id))}
                                                horizontal={true}
                                                style={ styles.flatList }
                                                keyExtractor={(item, index) => index.toString()}
                                                renderItem={({item}) =>{
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
                                                }}
                                            />
                                                </View>
                                               
                                            
                                            <TouchableOpacity 
                                                style={styles.closeButton}
                                                onPress={()=> setShowGachaList(false)}
                                                >
                                                <ImageBackground
                                                    source={closeButton}
                                                    style={{width:30,height:30}}
                                                    
                                                />
                                            </TouchableOpacity>
                                    </ImageBackground>)
                                }
                                <TouchableOpacity
                                    style={styles.ten_pulls}
                                    onPress={()=>{
                                        setShowVideo(true)
                                        setListGacha(gacha());
                                    }}>
                                </TouchableOpacity>
                            </ImageBackground>
                        </View>
                    </View>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
    container:{
        height:600,
        width:337.5,
        position: 'relative',
        marginTop:90,
        alignSelf:"center",
    },
    box: {
        position:"relative",
        width: 337.5,
        height: 600,
    },
    button:{
        width:50,
        borderColor:"black",
        borderWidth:2
    },
    
    ten_pulls:{
        // backgroundColor:"black",
        width:100,
        height:25,
        transform: [{rotate:'90deg'}],
        position:'absolute',
        top: '86%',
        left: '-8%',
        borderRadius:20
    },
      resultGachaCard: {
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
        marginTop:190       
    }




})