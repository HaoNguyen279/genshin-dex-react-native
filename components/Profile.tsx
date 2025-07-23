import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { Dimensions, Keyboard, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import { ActivityIndicator, Button, Modal, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";

import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { signInWithCredential, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import { WEB_CLIENT_ID } from "@env"; // Import WEB_CLIENT_ID from .env file

const provider = new GoogleAuthProvider(); // Firebase Google Auth Provider

provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

WebBrowser.maybeCompleteAuthSession();




const {width, height} = Dimensions.get("window");

const LoadingModal = (loading : boolean | any) =>{
    return(
       <View>
           <Modal visible={loading}>
                <ActivityIndicator animating={true} color="#65ddfd"/>
           </Modal>
       </View>
    )
}

export default function Profile(){
    // const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: WEB_CLIENT_ID, // Expo Go
        iosClientId: WEB_CLIENT_ID, // nếu build iOS native
        androidClientId: WEB_CLIENT_ID, // nếu build Android native
        webClientId: WEB_CLIENT_ID, // Dùng cho Firebase Auth
        scopes: ['profile', 'email'],
    });


    const signUp = async () => {
    try {
        setLoading(true);
        await createUserWithEmailAndPassword(auth, email, password);
        setLoading(false);
        setMessage('Đăng ký thành công!');
        alert('Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.');
    } catch (error : any) {
        setMessage(error.message);
    }
  };

  const signIn = async () => {
    try {
        setLoading(true);
        await signInWithEmailAndPassword(auth, email, password);
        setLoading(false);
        setMessage('Đăng nhập thành công!');
        alert('Đăng nhập thành công! Chào mừng bạn trở lại.');
    } catch (error : any) {
        setMessage(error.message);
    }

    useEffect(() => {
        if (response?.type === 'success') {
            const { id_token } = response.params;
            const credential = GoogleAuthProvider.credential(id_token);

            signInWithCredential(auth, credential)
                .then(() => {
                    setMessage('Đăng nhập bằng Google thành công!');
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
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={{flex:1}}> 
                    <LoadingModal loading={loading}/>
                    <View style={{width:width,height: height*0.1,flexDirection:"row",alignItems:"center", justifyContent:"center", backgroundColor:"#f0f0f0"}}>
                            <Image
                                style={{width: 50, height:50, margin:10}}
                                source={require("../assets/png/profile.png")}
                            />
                        <Text style={{color:"#000", fontSize:24}}>Nguyen Minh Hao</Text>
                    </View>
                    <View style={{flex:1,margin:20}}>
                        <Text style={{fontSize:24,textAlign:'center'}}>Login</Text>
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
                            onPress={() => {signUp()}}>
                            <Text>Register</Text>
                        </Button>
                        <Button 
                            mode="contained-tonal"
                            style={{marginTop:20}}
                            onPress={() => {promptAsync()}}>
                            <Text>Login with Google</Text>
                        </Button>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    fonts :{
        fontSize: 18,
    }
});
