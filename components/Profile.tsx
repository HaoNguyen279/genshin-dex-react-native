import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { Dimensions, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import {  Button, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, updateProfile } from "firebase/auth";

import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import { signInWithCredential, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import LoadingModal from "./splashscreen/Loading";
import { createUserContent, GoogleGenAI } from "@google/genai";

import { GEMINI_API_KEY, WEB_CLIENT_ID } from "@env"; // Import WEB_CLIENT_ID from .env file

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
    const [inputText, setInputText] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [isLoadingVisible, setIsLoadingVisible] = useState(false);

    const [userData, setUserData] = useState({ email: "null", uid: "null", displayName: "null" });
    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: WEB_CLIENT_ID, // Dùng cho Firebase Auth
        scopes: ['profile', 'email'],
        redirectUri: AuthSession.makeRedirectUri({
            useProxy: true,  // cần cho Expo Go
     } as any),
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

  const signIn = async () => {
    try {
        setIsLoadingVisible(true);
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                user.email && user.displayName ? setUserData({ email: user.email, uid: user.uid, displayName: user.displayName }) : setUserData({ email: "null", uid: "null", displayName: "null" });
                setIsLoadingVisible(false);
                setTimeout(() => {
                    setMessage('');
                }, 3000);
                alert('Đăng nhập thành công! Chào mừng bạn trở lại.');
                setEmail("");
                setPassword(""); 
            })
            .catch((error) => {
                console.log('Firebase login error:', error.code); // 👈 Bắt buộc có dòng này
                switch(error.code){
                    case "auth/user-not-found":
                        alert('Không tìm thấy người dùng. Vui lòng kiểm tra lại email.');
                        break;
                    case 'auth/wrong-password':
                        alert('Mật khẩu không đúng. Vui lòng thử lại.');
                        break;
                    case "auth/invalid-credential":
                        alert('Thông tin đăng nhập không hợp lệ. Vui lòng kiểm tra lại email và mật khẩu.');
                        break;
                    default:
                        alert('Đăng nhập không thành công. Vui lòng thử lại sau.');
                }
            })
            .finally(() => {
                setIsLoadingVisible(false);
            });

    } catch (error : any) {
        setMessage(error.message);
    }
    useEffect(() => {
        if (response?.type === 'success') {
            const { id_token } = response.params;
            const credential = GoogleAuthProvider.credential(id_token);
            signInWithCredential(auth, credential)
                .then(() => {
                    setMessage('Successfully signed in with Google!');
                })
                .catch((error) => {
                    setMessage(error.message);
                    console.error('Error signing in with Google:', error);
                });
        }
    }, [response]);
  };
    return(
        <SafeAreaView style={{flex:1, backgroundColor:"#fff"}}>
            <LoadingModal visible={isLoadingVisible}/>
            <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0} >
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <ScrollView contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps="handled">
                        <View> 
                            <View style={{width:width,height: height*0.1,flexDirection:"row",alignItems:"center", justifyContent:"center", backgroundColor:"#f0f0f0"}}>
                                    <Image
                                        style={{width: 50, height:50, margin:10}}
                                        source={require("../assets/png/profile.png")}
                                    />
                                <View>
                                    <Text style={{color:"#000", fontSize:24}}>{userData.displayName}</Text>
                                    <Text style={{color:"#888", fontSize:16}}>Email : {userData.email}</Text>
                                </View>
                            </View>
                            <View style={{margin:20}}>
                                <Text style={{fontSize:24,textAlign:'center'}}>Login</Text>
                                <View style={{display:"flex", flexDirection:"row", justifyContent:"center", marginTop:20}}>
                                    <Button style={{marginHorizontal:5}} mode="contained-tonal" onPress={()=>{navigation.navigate("SignUp")}}>
                                        <Text>Sign up</Text>
                                    </Button>
                                    <Button style={{marginHorizontal:5}} mode="contained-tonal" onPress={()=>{navigation.navigate("SignIn")}}>
                                        <Text>Sign in</Text>
                                    </Button>
                                </View>
                                <Text style={{marginTop:20}}>Enter your name</Text>
                                <TextInput
                                    label="Name"
                                    value={name}
                                    onChangeText={text => setName(text)}/>
                                <Text style={{marginTop:20}}>Enter your email</Text>
                                <TextInput
                                    label="Email"  
                                    value={email}
                                    onChangeText={text => setEmail(text)}/>
                                <Text style={{marginTop:20}}>Enter your password</Text>
                                <TextInput
                                    label="Password"
                                    value={password}
                                    onChangeText={text => setPassword(text)}
                                    secureTextEntry
                                />
                                <Text style={{marginTop:20, color:"red", textAlign:"center"}}>{message}</Text>
                                <Button 
                                    mode="contained-tonal"
                                    style={{marginTop:20}}
                                    onPress={() => {signIn()}}>
                                    <Text>Login</Text>
                                </Button>
                                <Button 
                                    mode="contained-tonal"
                                    style={{marginTop:20}}
                                    onPress={() => {
                                        signUp();
                                    }}>
                                    <Text>Register</Text>
                                </Button>
                                <Button 
                                    mode="contained-tonal"
                                    style={{marginTop:20}}
                                    onPress={() => {promptAsync()}}>
                                    <Text>Login with Google</Text>
                                </Button>
                                <TextInput placeholder="Ask a question..." style={{marginTop:20}} onChangeText={setInputText}/>
                                <Button 
                                    mode="contained-tonal"
                                    style={{marginTop:20}}
                                    onPress={async () => {
                                        setIsLoadingVisible(true);
                                        getResponse(inputText)
                                            .then(() => {
                                                setIsLoadingVisible(false);
                                            })
                                            .catch((error) => {
                                                setIsLoadingVisible(false);
                                                console.log("Error asking AI: " + error);
                                            });
                                    }}>
                                    <Text>Ask AI</Text>
                                </Button>
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
    }
});
