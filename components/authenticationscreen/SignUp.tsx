import { Dimensions, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View, TextInput } from "react-native";
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


const { width, height } = Dimensions.get("window");

export default function SignIn() {

    const [inputText, setInputText] = useState("");
        const [name, setName] = useState("");
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");
        const [message, setMessage] = useState("");

        const [loading, setLoading] = useState(false);
        const [isLoadingVisible, setIsLoadingVisible] = useState(false);
        const [secureText, setSecureText] = useState(true);

        const [userData, setUserData] = useState({ email: "null", uid: "null", displayName: "null" });

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
        const signUp = async () =>{
            if (email === "" || password === ""){
                setErrorMessage("Email and password cannot be empty!");
                return;
            }
            setIsLoadingVisible(true);
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) =>{
                    updateProfile(userCredential.user, {
                        displayName: name
                    })
                })
                .catch((error)=>{

                })
                .finally(() => {
                    setIsLoadingVisible(false);
                });
        }

    
  return (
    <SafeAreaView style={{flex:1, backgroundColor:"#fff"}}>
            <LoadingModal visible={isLoadingVisible}/>
            <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0} >
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <ScrollView contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps="handled" >
                        <View>
                            <View style={{margin:20}}>
                                <Text style={{fontSize:24,textAlign:'center'}}>Sign Up</Text>
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
                                    style={{marginTop:10, backgroundColor:"#70f5ffff"}}
                                    onPress={() => {signUp()}}>
                                    <Text>Sign In</Text>
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
    input: {
        marginTop: scale(10),
        fontSize: scale(16),
        borderRadius: scale(8),
        borderWidth: scale(2),
        height: verticalScale(50),
        borderColor: "#ededed",
    },
    textLabel: {
        fontFamily: "montserrat-semi-bold",
        fontSize: scale(14),
        marginTop: scale(20),
    },


})