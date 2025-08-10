import { Dimensions, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LoadingModal from "../splashscreen/Loading";
import { Button } from "react-native-paper";
import { useState } from "react";
import { scale, verticalScale } from "react-native-size-matters";
import { auth } from "../../firebaseConfig"
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import { signInWithEmailAndPassword } from "firebase/auth";
import { WEB_CLIENT_ID } from "@env";
import { NavigationProp, useNavigation } from "@react-navigation/native";

import {storeUserData} from "../../utils/functions"

const { width, height } = Dimensions.get("window");

interface UserDataType {
    email: string | null;
    uid: string | null;
    displayName: string | null;
}
export default function SignIn() {
        const navigation : NavigationProp<RootStackParamList> = useNavigation();
        const [inputText, setInputText] = useState("");
        const [name, setName] = useState("");
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");
        const [message, setMessage] = useState("");
        const [isLoggedIn, setLoggedIn] = useState(false);
        const [loading, setLoading] = useState(false);
        const [isLoadingVisible, setIsLoadingVisible] = useState(false);
        const [secureText, setSecureText] = useState(true);

        const [userData, setUserData] = useState<UserDataType>({ email: "null", uid: "null", displayName: "null" });

        const setErrorMessage = (message: string) => {
            setMessage(message);
            setTimeout(() =>{
                setMessage("");
            }, 3000);
        };
        
        const [request, response, promptAsync] = Google.useAuthRequest({
            clientId: WEB_CLIENT_ID,
            scopes: ['profile', 'email'],
            redirectUri: AuthSession.makeRedirectUri({
                useProxy: true, 
         } as any),
        });
        const signIn = async () =>{
            if (email === "" || password === ""){
                setErrorMessage("Email and password cannot be empty!");
                return;
            }
            setIsLoadingVisible(true);
            signInWithEmailAndPassword(auth, email, password)
                .then(async (userCredential) =>{
                    const user = userCredential.user;
                    const payload: UserDataType = {
                        email: user.email ?? "null",
                        uid: user.uid ?? "null",
                        displayName: user.displayName ?? "null", 
                    };
                    await storeUserData(payload).then(() => {
                        console.log("Thành công");
                    });
                    setUserData(payload);
                    setTimeout(() => {
                        navigation.goBack();
                    }, 500);
                })
                .catch((error)=>{
                    switch (error.code) {
                        case "auth/invalid-email":
                            setErrorMessage("Địa chỉ email không hợp lệ");
                            break;
                        case "auth/user-not-found":
                            setErrorMessage("Thông tin đăng nhập không chính xác");
                            break;
                        case "auth/wrong-password":
                            setErrorMessage("Thông tin đăng nhập không chính xác");
                            break;
                        case "auth/invalid-credential":
                            setErrorMessage("Thông tin đăng nhập không hợp lệ");
                            break;
                        case "auth/too-many-requests": 
                            setErrorMessage("Quá nhiều yêu cầu, vui lòng thử lại sau");
                            break;
                        default:
                            setErrorMessage("Lỗi đăng nhập");
                    }
                })
                .finally(() => {
                    setIsLoadingVisible(false);
                });
        }
        


    
  return (
    <SafeAreaView style={styles.container}>
            <LoadingModal visible={isLoadingVisible}/>
            <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0} >
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <ScrollView contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps="handled" >
                        <View style={styles.content_container}>
                            <View style={{margin:20}}>
                                <Text style={{fontSize:24,textAlign:'center',fontFamily:'genshin_font'}}>Sign In</Text>
                                <Text style={styles.textLabel}>Enter your email</Text>
                                <TextInput
                                    value={email}
                                    onChangeText={text => setEmail(text)}
                                    style={styles.input}
                                    placeholder="Email"/>   
                                    
                                <Text style={styles.textLabel}>Enter your password</Text>
                                <TextInput
                                    value={password}
                                    onChangeText={text => setPassword(text)}
                                    style={styles.input}
                                    placeholder="Password"
                                    // right={<TextInput.Icon icon="eye" onPress={()=>{setSecureText(!secureText)}} />}
                                    secureTextEntry={secureText}
                                    autoComplete="off"
                                    autoCorrect={false}
                                    spellCheck={false}
                                    importantForAutofill="no"
                                    textContentType="none"
                                />
                                <Text style={{marginTop:10, color:"red"}}>{message}</Text>
                                <Button              
                                    mode="contained-tonal"
                                    style={{marginTop:10, backgroundColor:"#4460f0"}}
                                    onPress={() => {signIn()}}>
                                    <Text style={{color:"white"}}>Sign In</Text>
                                </Button>
                            </View>
                        </View>
                </ScrollView>
            </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: "#f6f6f6",
    },
    content_container:{
        flex:1,
        justifyContent: 'center',
    },
    input: {
        marginTop: scale(10),
        fontSize: scale(16),
        borderRadius: scale(8),
        height: verticalScale(50),
        backgroundColor: "#ebeff8",
        paddingLeft:20
    },
    textLabel: {
        fontFamily: "montserrat-semi-bold",
        fontSize: scale(14),
        marginTop: scale(20),
    },


})