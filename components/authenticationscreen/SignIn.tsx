import { Dimensions, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LoadingModal from "../splashscreen/Loading";
import { Button } from "react-native-paper";
import { useEffect, useState } from "react";
import { scale, verticalScale } from "react-native-size-matters";
import { auth } from "../../firebaseConfig"
import { signInWithEmailAndPassword } from "firebase/auth";  
import { IOS_CLIENT_ID, WEB_CLIENT_ID } from "@env";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Google } from "@lobehub/icons-rn"
import { storeUserData} from "../../utils/functions"
import { GoogleSigninButton, isSuccessResponse, isErrorWithCode, statusCodes, GoogleSignin} from "@react-native-google-signin/google-signin"
const { width, height } = Dimensions.get("window");

interface UserDataType {
    email: string | null;
    uid: string | null;
    displayName: string | null;
    photoURL: string | null;
}
export default function SignIn() {
        const navigation : NavigationProp<RootStackParamList> = useNavigation();
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");
        const [message, setMessage] = useState("");
        const [isLoadingVisible, setIsLoadingVisible] = useState(false);
        const [secureText, setSecureText] = useState(true);
        const [isSubmitting, setIsSubmitting] = useState(false);
        const [userData, setUserData] = useState<UserDataType>({ email: "null", uid: "null", displayName: "null" , photoURL: "null"});


        const setErrorMessage = (message: string) => {
            setMessage(message);
            setTimeout(() =>{
                setMessage("");
            }, 3000);
        };
        
        const handleGoogleSignIn = async () =>{
            try {
                setIsSubmitting(true);
                await GoogleSignin.hasPlayServices();
                const response = await GoogleSignin.signIn();
                if(isSuccessResponse(response)){
                    const { idToken, user } = response.data;
                    const { name, email, photo } = user;
                    const payload: UserDataType = {
                        email: email ?? "null",
                        uid: user.id ?? "null",
                        displayName: name ?? "null",
                        photoURL: photo ?? "null"
                    };
                    setUserData(payload);
                    await storeUserData(payload);
                    // await setSignInProvider("google");
                    // const probe = await getSignInProvider?.(); // nếu export sẵn trong utils
                    // console.warn("Provider stored =", probe);
                    navigation.goBack();
                }
                else{
                    console.warn("Google Sign In failed: ", response);
                }
            } catch (error) {
                if(isErrorWithCode(error)){
                    switch (error.code) {
                        case statusCodes.SIGN_IN_CANCELLED:
                            console.warn("User cancelled the sign-in flow");
                            break;
                        case statusCodes.IN_PROGRESS:
                            console.warn("Sign-in is in progress");
                            break;
                        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                            console.warn("Google Play Services not available");
                            break;
                        default:
                            console.warn("Google Sign In error: ", error);
                    }
                }
                console.warn("Google Play Services not available", error);
                setIsSubmitting(false);
            }
        };
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
                        photoURL: user.photoURL ?? "null"
                    };
                    await storeUserData(payload).then(() => {
                        console.warn("Đăng nhập thành công");
                    });
                    setUserData(payload);
                    // await setSignInProvider("email");
                    // const probe = await getSignInProvider?.(); // nếu export sẵn trong utils
                    // console.warn("Provider stored =", probe);
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
        useEffect(() => {
            GoogleSignin.configure({
                webClientId: WEB_CLIENT_ID,
                iosClientId: IOS_CLIENT_ID,
                offlineAccess: true,
                profileImageSize: 150,  
            });
        }, []);

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
                                <Button
                                    mode="contained-tonal"
                                    style={{marginTop:10, backgroundColor:"white",marginVertical:10}}
                                    onPress={() => {handleGoogleSignIn()}}
                                >
                                    <View style={{flexDirection:"row",alignItems:"center"}}>
                                        <Text style={{color:"black"}}>Sign In with </Text> 
                                        <View style={{flexDirection:"row",alignItems:"center", justifyContent:"center"}}>
                                            <Google.Brand size={16}/>
                                            <Google.Color size={18}/>
                                        </View>
                                    </View>
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