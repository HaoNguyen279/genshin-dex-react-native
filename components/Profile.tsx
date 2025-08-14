import { NavigationProp, RouteProp, useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { Image } from "expo-image";
import { useCallback, useEffect, useState } from "react";
import { Dimensions, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import {  Button, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import {getUserData,getIsLoggedIn,logout, getAvatarByCharacterName, storeUserData} from "../utils/functions"
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signInWithCredential, GoogleAuthProvider , getAuth, reload, updateProfile } from "firebase/auth";

import LoadingModal from "./splashscreen/Loading";
import ChoosingAvatarModal from "./customcomponent/ChoosingAvatarModal";

import { GEMINI_API_KEY, WEB_CLIENT_ID } from "@env"; // Import WEB_CLIENT_ID from .env file



const provider = new GoogleAuthProvider(); // Firebase Google Auth Provider
 
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

WebBrowser.maybeCompleteAuthSession();

const {width, height} = Dimensions.get("window");
//{email, uid, displayName, photoURL} : {email : string, uid : string, displayName : string, photoURL : string}


export default function Profile(){

    const navigation : NavigationProp<RootStackParamList> = useNavigation();
    const [isLoadingVisible, setIsLoadingVisible] = useState(false);
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [userData, setUserData] = useState({ email: "null", uid: "null", displayName: "null", photoURL: "null" });
    const [isChangingAvatar, setIsChangingAvatar] = useState(false);
    const changeAvatar = useCallback(async (charName : string) =>{
        const auth = getAuth();
        const user = auth.currentUser;
        if(user) await reload(user);
        else console.log("No user is currently logged in.");
        // console.log(user?.displayName + "<user_display_name>" + user?.photoURL!);
        if(user){
            await updateProfile(auth.currentUser, {
                photoURL : getAvatarByCharacterName(charName)
            }).then(async() => {
                setUserData(prev => {
                    const newData = {
                        ...prev,
                        photoURL: getAvatarByCharacterName(charName)
                    };
                    console.log("-------------> Updated thành công");
                    return newData;
                });
                    const [userDisplayName, userEmail, userUid, userPhotoURL] = await Promise.all([
                        getUserData('displayName'),
                        getUserData('email'),
                        getUserData('uid'),
                        getUserData('photoURL')
                    ]);
                    console.log("Focused 123 36:" + userEmail, userDisplayName, userUid, userPhotoURL );
            }).then(async() =>{
                await storeUserData(userData);
            })
        }
        else{
            console.log("No user is currently logged in.");
        }
        
    }, []);
    useFocusEffect(
        useCallback(()=>{
            let mounted = true;
            (
                async () =>{
                    try {
                        const loadUserData = async () =>{
                            console.log("Loading user data...");
                            const [userDisplayName, userEmail, userUid, userPhotoURL] = await Promise.all([
                                getUserData('displayName'),
                                getUserData('email'),
                                getUserData('uid'),
                                getUserData('photoURL')
                            ]);
                            console.log("Loaded user data:", {
                                displayName: userDisplayName,
                                email: userEmail,
                                uid: userUid,
                                photoURL: userPhotoURL
                            });
                            const newData = {
                                displayName : userDisplayName,
                                email: userEmail,
                                uid : userUid,
                                photoURL: userPhotoURL
                            }
                            setUserData( prev => {
                                if(JSON.stringify(prev) === JSON.stringify(newData)){
                                    return prev;
                                }
                                return newData;
                            });
                            if(userData.photoURL){
                                Image.prefetch(userData.photoURL).then(()=>{
                                    console.log("Image prefetch successful for " + userData.photoURL);
                                })
                            }
                        }
                        loadUserData();  
                        const ok = await getIsLoggedIn();
                        if(mounted && ok) setLoggedIn(true);
                    } catch (error) {
                        if (mounted) setLoggedIn(false);
                    }
                }
            )();
            return () => { mounted = false; };
        }, [])
    );
    useEffect(() => {
        console.log("isChangingAvatar state changed: ", isChangingAvatar);
    }, [isChangingAvatar]);

    return(
        <SafeAreaView style={{flex:1, backgroundColor:"#e6e7e2"}}>
            <LoadingModal visible={isLoadingVisible}/>
            <ChoosingAvatarModal isVisible={isChangingAvatar} onClose={() => setIsChangingAvatar(false)} />
            <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0} >
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <ScrollView contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps="handled">
                    <View style={styles.profile_container}>
                        <View style={styles.img_profile_container}>
                            <Image
                                key={userData.photoURL}
                                style={styles.img_profile}
                                source={
                                    userData.photoURL !== 'null' 
                                    ? {uri:userData.photoURL}
                                    : require("../assets/png/profile.png")
                                }
                                contentFit="contain"
                                priority={`high`}

                            />
                        </View>
                        <Text style={styles.username}>{userData.displayName === "null" ? "Guest" : userData.displayName}</Text>
                        <Text style={styles.email}> {userData.email === "null" ? "No email" : userData.email}</Text>
                    </View>

                    {!isLoggedIn ? (
                        <View style={{margin:10}}>  
                            <View style={{display:"flex", flexDirection:"row", justifyContent:"center", marginTop:10}}>
                                <Button style={{marginHorizontal:5,backgroundColor:"#7cc6ffff"}} mode="contained-tonal" onPress={()=>{navigation.navigate("SignUp")}}>
                                    <Text style={{color:"white"}}>Sign up</Text>
                                </Button>
                                <Button style={{marginHorizontal:5,backgroundColor:"#7091ffff"}} mode="contained-tonal" onPress={()=>{navigation.navigate("SignIn")}}>
                                    <Text style={{color:"white"}}>Sign in</Text>
                                </Button>
                            </View>
                        </View>
                    ) : (
                        <View style={{margin:10}}>
                            <View style={{display:"flex", flexDirection:"row", justifyContent:"center", marginTop:10}}>
                                <Button
                                    onPress={async () => {
                                        setUserData({email: "null", uid: "null", displayName: "null", photoURL : 'null'});
                                        await logout();
                                        setLoggedIn(false);
                                    }}
                                    mode="contained-tonal"
                                    style={styles.logout_button}
                                >
                                    <Text>Log out</Text>
                                </Button>
                            </View>
                        </View>
                    )}
                    <View style={{marginHorizontal:20,marginVertical:5}}><Text style={{color:"#5b5b5b",fontFamily:'genshin_font'}}>Settings</Text></View>
                    <View style={styles.setting_container}>
                        <View style={styles.setting_item}>
                            <Text style={styles.text_item}>Theme</Text>
                        </View>
                        <View style={styles.setting_item}>
                            <Text style={styles.text_item}>Avatar</Text>
                        </View>
                        <View style={styles.setting_item}>
                            <Text style={styles.text_item}>Deo buiet nua</Text>
                        </View>
                        <TouchableOpacity onPress={() => setIsChangingAvatar(true)}>
                            <View style={styles.setting_item}>
                                <Text style={styles.text_item}>Doi avt</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            console.log(JSON.stringify(userData))
                        }}>
                            <View style={styles.setting_item}>
                                <Text style={styles.text_item}>Deo buiet nua</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => changeAvatar('Skirk').catch((error) => console.error(error))}>
                            <View style={styles.setting_item}>
                                <Text style={styles.text_item}>test</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    fonts :{
        fontSize: 18,
    },
    profile_container: {
        width: width,
        alignItems: 'center',
        marginTop:20
    },
    img_profile: {
        width:width*0.25,
        height:width*0.25,
        borderRadius:(width * 0.25) / 2,
        overflow:"hidden",
    },
    img_profile_container:{
        width:width*0.25,
        height:width*0.25,
        backgroundColor:"#fff",
        borderRadius:"50%",
        alignItems:"center",
        // Shadow for iOS
        shadowColor: "#858585ff",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        // Shadow for Android
        elevation: 5,
    },
    username: {
        fontFamily:'genshin_font',
        color:"#000",
        fontSize:22,
        marginTop:10,
    },
    email: {
        color:"#888",
        fontSize:16,
        marginTop:5,
    },
    logout_button:{
        backgroundColor:"#f4f4f4",
    },
    setting_container:{
        marginHorizontal:20
    },
    setting_item:{
        backgroundColor:"#f4f4f4",
        height:50,
        borderRadius:10,
        justifyContent:"center",
        marginVertical:5,
    },
    text_item:{
        marginLeft:20,
        color:"#1a1a1a",
        fontFamily:'genshin_font',
    }
});
