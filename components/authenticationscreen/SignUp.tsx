import { Dimensions, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LoadingModal from "../splashscreen/Loading";
import { Button } from "react-native-paper";
import { useState } from "react";
import { scale, verticalScale } from "react-native-size-matters";
import { auth } from "../../firebaseConfig"
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import {  createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { WEB_CLIENT_ID } from "@env";
import { NavigationProp, useNavigation } from "@react-navigation/native";


const { width, height } = Dimensions.get("window");

export default function SignIn() {
    const navigation : NavigationProp<RootStackParamList> = useNavigation();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isLoadingVisible, setIsLoadingVisible] = useState(false);
    const [secureText, setSecureText] = useState(true);

    
    const setErrorMessage = (message: string) => {
        setMessage(message + "5");
        for (let i = 5; i > 0; i--) {
            setTimeout(() => {
                setMessage(message + " (" + i + ")");
            }, 5000 - i * 1000);
        }
        setTimeout(() =>{
            setMessage("");
        }, 5000);
    };
    
    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: WEB_CLIENT_ID,
        scopes: ['profile', 'email'],
        redirectUri: AuthSession.makeRedirectUri({
            useProxy: true, 
        } as any),
    });
        const signUp = async () =>{
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
                .then((userCredential) =>{
                    updateProfile(userCredential.user, {
                        displayName: name,
                    })
                    alert("Đăng ký thành công!");
                    
                })
                .catch((error)=>{
                    switch(error.code){
                        case "auth/email-already-in-use":
                            setErrorMessage("Email đã được đăng ký.");
                            break;
                        case "auth/invalid-email":
                            setErrorMessage("Email không hợp lệ. Vui lòng nhập email đúng định dạng.");
                            break;
                        case "auth/weak-password":
                            setErrorMessage("Mật khẩu quá yếu. Vui lòng sử dụng mật khẩu mạnh hơn.");
                            break;
                        default:
                            setErrorMessage("Đăng ký không thành công. Vui lòng thử lại sau.");
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
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{position:"absolute", top:10}}> 
                        <Text style={[{fontFamily: 'genshin_font',color:"black",fontSize:18,padding:15}]}> ﹤Back</Text>
                    </TouchableOpacity>
                        <View style={styles.content_container}>
                            <View style={{margin:20}}>
                                <Text style={{fontSize:24,textAlign:'center',fontFamily:'genshin_font'}}>Sign Up</Text>
                                <Text style={styles.textLabel}>Enter your name</Text>
                                <TextInput
                                    value={name}
                                    onChangeText={text => setName(text)}
                                    style={styles.input}
                                    placeholder="Name"/>   
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
                                    onPress={() => {signUp()}}>
                                    <Text style={{color:"white"}}>Sign Up</Text>
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
        backgroundColor: "#f6f6f6"
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