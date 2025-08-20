import { NavigationProp, RouteProp, useFocusEffect, useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import { useCallback, useEffect, useState } from "react";
import { Dimensions, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import {  Button, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import {getUserData,getIsLoggedIn,logout, getAvatarByCharacterName, storeUserData, setResultLangStorage, getResultLang, getCharacterNameByPhotoURL} from "../utils/functions"
import * as WebBrowser from 'expo-web-browser';
import { signInWithCredential, GoogleAuthProvider , getAuth, reload, updateProfile, onAuthStateChanged } from "firebase/auth";
import LoadingModal from "./splashscreen/Loading";
import ChoosingAvatarModal from "./customcomponent/ChoosingAvatarModal";


const providerImport = new GoogleAuthProvider(); // Firebase Google Auth Provider
 
providerImport.addScope('https://www.googleapis.com/auth/contacts.readonly');

WebBrowser.maybeCompleteAuthSession();

const {width, height} = Dimensions.get("window");

const initData = async () =>{
    await storeUserData({
        email: "null",
        uid: "null",
        displayName: "null",
        photoURL: "null"
    });
}
// initData();
export default function Profile(){

    const navigation : NavigationProp<RootStackParamList> = useNavigation();
    const [isLoadingVisible, setIsLoadingVisible] = useState(false);
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [userData, setUserData] = useState({ email: "null", uid: "null", displayName: "null", photoURL: "null" });
    const [isChangingAvatar, setIsChangingAvatar] = useState(false);
    const [resultLang, setResultLang] = useState<string | null>("Vietnamese");
    const [avatarCharacter, setAvatarCharacter] = useState<string | null>("Furina");
    const [provider, setProvider] = useState<string | null>("google");
    const auth = getAuth();
    const changeResultLanguage = useCallback(async () =>{
        if(resultLang === 'Vietnamese'){
            setResultLang('English');
            await setResultLangStorage('English');
        }else{
            setResultLang('Vietnamese');
            await setResultLangStorage('Vietnamese');
        }
    }, [resultLang]);
    const changeAvatar = useCallback(async (charName : string) =>{

        console.warn("Changing avatar to: ", charName);
        if(provider !== "password") {
            alert("Please sign in with email to change avatar." + provider);
            console.warn("Character name is empty or null." + provider);
            return;
        }
        const auth = getAuth();
        const user = auth.currentUser;
        if(user) await reload(user);
        else console.log("No user is currently logged in.");
        if(user){
            await updateProfile(auth.currentUser, {
                photoURL : getAvatarByCharacterName(charName)
            });
                    
            
            const [userDisplayName, userEmail, userUid, userPhotoURL] = await Promise.all([
                        user.displayName || 'null',
                        user.email || 'null',
                        user.uid || 'null',
                        await getCharacterNameByPhotoURL(charName)
                    ]);
                console.log("Avatar from Async Storage" + userEmail, userDisplayName, userUid, userPhotoURL );
                setUserData(() => {
                const newData = {
                    email : userEmail,
                    uid : userUid,
                    displayName : userDisplayName,
                    photoURL: userPhotoURL
                };
                return newData;
            });
            // loi o day
            await storeUserData(userData);
            console.warn("Updated user data: ", userData);
        }
        else{
            console.log("No user is currently logged in.");
        }
    }, []);
    useEffect( () =>{
        const unsubscribe = onAuthStateChanged(auth, async (firebaseuser) =>{
        alert("onAuthStateChanged called");
        const [userDisplayName, userEmail, userUid, userPhotoURL] = await Promise.all([
            firebaseuser?.uid || 'null',
            firebaseuser?.email || 'null',
            firebaseuser?.displayName || 'null',
            firebaseuser?.photoURL || 'null'
        ]);
            setUserData({
                email: userEmail,
                uid: userUid,
                displayName: userDisplayName,
                photoURL: userPhotoURL
            });
        });
        return unsubscribe;
    },[auth]);
    useFocusEffect(
        useCallback(()=>{
            let mounted = true;
            (
                async () =>{
                    try {
                        const user = auth.currentUser;
                        if(user) await reload(user);             
                        alert("Focus called");
                        setProvider(user?.providerData[0].providerId || 'null');
                        const loadUserData = async () =>{
                            const [userDisplayName, userEmail, userUid, userPhotoURL] = await Promise.all([
                                user?.displayName || 'null',
                                user?.email || 'null',
                                user?.uid || 'null',
                                user?.photoURL || 'null'
                            ]);
                            console.warn("Loaded user data ảnh nè --- :", userPhotoURL );
                            const newData = {
                                displayName : userDisplayName,
                                email: userEmail,
                                uid : userUid,
                                photoURL: userPhotoURL
                            }
                            console.warn("Loaded user data: ", JSON.stringify(newData));
                            setUserData( prev => {
                                if(JSON.stringify(prev) === JSON.stringify(newData)){
                                    return prev;
                                }
                                return newData;
                            });
                            if(userData.photoURL){
                                Image.prefetch(userData.photoURL).then(()=>{
                                    console.log("Image prefetch suSccessful for " + userData.photoURL);
                                })
                                setAvatarCharacter(await getCharacterNameByPhotoURL(userData.photoURL));
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
        
    }, [isChangingAvatar]);
    useEffect(() => {
        const loadLang = async () =>{
            const lang = await getResultLang();
            if(lang !== 'vi') {
                setResultLang('Vietnamese');
                setResultLangStorage('Vietnamese');
            }
        }
        loadLang();
    }, []);

    return(
        <SafeAreaView style={{flex:1, backgroundColor:"#e6e7e2"}}>
            <LoadingModal visible={isLoadingVisible}/>
            <ChoosingAvatarModal isVisible={isChangingAvatar} onClose={() => setIsChangingAvatar(false)} isLoggedIn={isLoggedIn}/>
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
                        <TouchableOpacity >
                            <View style={styles.setting_item}>
                                <Text style={styles.text_item}>Theme color:</Text>
                                <Text style={[styles.text_item_right, {marginRight:20}]}>Light</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <View style={styles.setting_item}>
                                <Text style={styles.text_item}>Avatar character:</Text>
                                <Text style={[styles.text_item_right, {marginRight:20}]}>{avatarCharacter}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={changeResultLanguage}>
                            <View style={styles.setting_item}>
                                <Text style={styles.text_item}>Voice language:</Text>
                                <Text style={[styles.text_item_right, {marginRight:20}]}>{resultLang}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => changeAvatar(avatarCharacter === "Furina" ? "Skirk" : "Furina")}>
                            <View style={styles.setting_item}>
                                <Text style={styles.text_item}>Change avatar (not work with google sign in)</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            console.log(JSON.stringify(userData))
                        }}>
                            <View style={styles.setting_item}>
                                <Text style={styles.text_item}>Deo buiet nua</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() =>{
                            console.log(JSON.stringify(userData) + 'Provider:' + provider);
                            
                        }}>
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
        justifyContent:"space-between",
        marginVertical:5,
        display:"flex",
        flexDirection:"row",
        alignItems:"center",
    },
    text_item:{
        marginLeft:20,
        color:"#1a1a1a",
        fontFamily:'genshin_font',
    },
    text_item_right:{
        marginLeft:20,
        color:"#919191ff",
        fontFamily:'genshin_font',
    }
});
