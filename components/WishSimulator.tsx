import { StyleSheet, View, Button, ImageBackground, Image, TouchableOpacity ,Text, FlatList} from "react-native"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import { useVideoPlayer, VideoView } from "expo-video";
import { useEvent } from "expo";
import { AVPlaybackNativeSource, AVPlaybackStatus, Video, ResizeMode } from "expo-av";
import { useRef, useState } from "react";


const videoSource = require("../assets/wish_animation/wish_ani_5stars.mp4");
const backgroundSource = require("../assets/wish_animation/wish_screen.png");
const gachaBackground = require("../assets/wish_animation/gacha_background.webp");

const videoAspectRatio = 608 / 1080; // ≈ 0.563
const containerHeight = 600;
const adjustedWidth = containerHeight * videoAspectRatio; // ≈ 337.78

export function WishSimulator(){
    const videoRef = useRef<Video>(null);
    const [status,setStatus] = useState<AVPlaybackStatus>()

    const [showVideo,setShowVideo] = useState(false);
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
                    <View >
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
                                    </ImageBackground>)
                                }
                                <TouchableOpacity
                                    style={styles.ten_pulls}
                                    onPress={()=>setShowVideo(true)}>
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
    }


})