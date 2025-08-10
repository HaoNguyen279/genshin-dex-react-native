import { NavigationProp, RouteProp, useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { Image } from "expo-image";
import { useCallback, useEffect, useState } from "react";
import { Dimensions, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import {  Button, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { auth } from "../firebaseConfig";
import {getUserData,getIsLoggedIn,logout} from "../utils/functions"
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, updateProfile } from "firebase/auth";

import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import { signInWithCredential, GoogleAuthProvider } from "firebase/auth";

import LoadingModal from "./splashscreen/Loading";
import { GoogleGenAI } from "@google/genai";

import { GEMINI_API_KEY, WEB_CLIENT_ID } from "@env"; // Import WEB_CLIENT_ID from .env file
import { s } from "react-native-size-matters";


const provider = new GoogleAuthProvider(); // Firebase Google Auth Provider
 
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

WebBrowser.maybeCompleteAuthSession();

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const {width, height} = Dimensions.get("window");

async function getResponse(prompt : string) {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "Trả lời ngắn gọn câu hỏi của người dùng (Không dùng markdown): " + prompt,
    });
    alert(response.text);
    return response.text;
}

export default function Profile(){

    const navigation : NavigationProp<RootStackParamList> = useNavigation();
    const route : RouteProp<RootStackParamList, "Profile"> = useRoute();
    const [inputText, setInputText] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [isLoadingVisible, setIsLoadingVisible] = useState(false);
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [userData, setUserData] = useState({ email: "null", uid: "null", displayName: "null" });

    const redirectUri = AuthSession.makeRedirectUri({
        path: 'auth',
        scheme: 'anime_picture'
    });

    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: WEB_CLIENT_ID, 
        scopes: ['profile', 'email'],
        redirectUri: redirectUri,
    });

    const signUp = async () => {
    try {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !password || !emailRegex.test(email)) {
            alert('Vui lòng nhập email và mật khẩu hợp lệ.');
            return;
        }
        if (password.length < 6) {
            alert('Mật khẩu phải có ít nhất 6 ký tự.');
            return;
        }
        setIsLoadingVisible(true);
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
            const user = userCredential.user;
            console.log("User registered:", user);
            updateProfile(userCredential.user, {
                displayName: name,
            }).then(() => {console.log("User profile updated:", user); });
            setIsLoadingVisible(false);
            alert('Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.');
            setEmail("");
            setPassword("");
            setTimeout(() => {
                setMessage('');
            }, 3000); 
        })
        .catch((error) => {
             switch(error.code){
                case "auth/email-already-in-use":
                    alert('Email đã được sử dụng. Vui lòng đăng nhập hoặc sử dụng email khác.');
                    break;
                case "auth/invalid-email":
                    alert('Email không hợp lệ. Vui lòng nhập email đúng định dạng.');
                    break;
                case "auth/weak-password":
                    alert('Mật khẩu quá yếu. Vui lòng sử dụng mật khẩu mạnh hơn.');
                    break;
                default:
                    alert('Đăng ký không thành công. Vui lòng thử lại sau.');
            }
        })
        .finally(() => {
            setIsLoadingVisible(false);
        });
        } catch (error : any) {
            setMessage(error.message);
        }
    };

    useFocusEffect(
        useCallback(()=>{
            let mounted = true;
            (
                async () =>{
                    try {
                        const loadUserData = async () =>{
                            const userDisplayName = await getUserData('displayName');
                            const userEmail = await getUserData('email');
                            const userUid = await getUserData('uid');
                            const newData = {
                                displayName : userDisplayName,
                                email: userEmail,
                                uid : userUid,
                            }
                            setUserData( prev => {
                                if(JSON.stringify(prev) === JSON.stringify(newData)){
                                    return prev;
                                }
                                return newData;
                            });
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


    return(
        <SafeAreaView style={{flex:1, backgroundColor:"#e6e7e2"}}>
            <LoadingModal visible={isLoadingVisible}/>
            <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0} >
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <ScrollView contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps="handled">
                    <View style={styles.profile_container}>
                        <View style={styles.img_profile_container}>
                            <Image
                                style={styles.img_profile}
                                source={require("../assets/png/profile.png")}
                            />
                        </View>
                        <Text style={styles.username}>{userData.displayName === "null" ? "Guest" : userData.displayName}</Text>
                        <Text style={styles.email}> {userData.email === "null" ? "No email" : userData.email}</Text>
                    </View>

                    {!isLoggedIn ? (
                        <View style={{margin:10}}>
                            <View style={{display:"flex", flexDirection:"row", justifyContent:"center", marginTop:10}}>
                                <Button style={{marginHorizontal:5,backgroundColor:"#7cc6ffff"}} mode="contained-tonal" onPress={()=>{navigation.navigate("SignUp")}}>
                                    <Text>Sign up</Text>
                                </Button>
                                <Button style={{marginHorizontal:5,backgroundColor:"#7091ffff"}} mode="contained-tonal" onPress={()=>{navigation.navigate("SignIn")}}>
                                    <Text>Sign in</Text>
                                </Button>
                            </View>
                        </View>
                    ) : (
                        <View style={{margin:10}}>
                            <View style={{display:"flex", flexDirection:"row", justifyContent:"center", marginTop:10}}>
                                <Button
                                    onPress={async () => {
                                        setUserData({email: "null", uid: "null", displayName: "null"});
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
                        <View style={styles.setting_item}>
                            <Text style={styles.text_item}>Deo buiet nua</Text>
                        </View>
                        <View style={styles.setting_item}>
                            <Text style={styles.text_item}>Deo buiet nua</Text>
                        </View>
                        <View style={styles.setting_item}>
                            <Text style={styles.text_item}>Deo buiet nua</Text>
                        </View>
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
