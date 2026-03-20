import AsyncStorage from "@react-native-async-storage/async-storage";
import characterData from "../assets/data/character.json"
import { GoogleSignin, User } from "@react-native-google-signin/google-signin";
import { reload } from "@firebase/auth";

export function getRounded1Number(num : number) : number {
    if (isNaN(num)) {
        return 0;
    }
    return parseFloat(num.toFixed(1));
}
export function getPercentage(num : number, substatText : string) : String {
    if (isNaN(num)) {
        return "No data";
    }
    if(substatText === "Elemental Mastery"){
        return num.toString();
    }else{
        return (num * 100).toFixed(1) + "%";
    }
}
export async function storeUserData(value: any){
    try{
        await AsyncStorage.setItem('userData', JSON.stringify(value));
    }catch(error){
        console.log("Caught error when trying to store user data:" + error);
    }
}
export async function updateUserDataInAsyncStorage(user : User) {
    try {
        await AsyncStorage.setItem('userData', JSON.stringify(user));
        console.warn("Hàm update chạy : ", await AsyncStorage.getItem('userData'));
    } catch (error) {
        console.log("Caught error when trying to update user data:" + error);
    }
}

export async function getUserData(key : string){
    var result;
    try {
        if(key === 'displayName'){
            result = AsyncStorage.getItem('userData')
                .then(userdata => {
                    if(userdata) return JSON.parse(userdata).displayName;
                    return 'null';
                })
            return result;
        }
        else if(key === 'email'){
            result = AsyncStorage.getItem('userData')
                .then(userdata => {
                    if(userdata) return JSON.parse(userdata).email;
                    return 'null';
                })
            return result;
        }     
        else if(key === 'uid'){
            result = AsyncStorage.getItem('userData')
                .then(userdata => {
                    if(userdata) return JSON.parse(userdata).uid;
                    return 'null';
                })
            return result;
        }
        else if(key === 'photoURL'){
            result = AsyncStorage.getItem('userData')
                .then(userData =>{
                    if(userData){
                        return JSON.parse(userData).photoURL;
                    }
                    return 'null';
                })
            return result;
        }
    } catch (error) {
       console.log("Caught error when trying to get user data:" + error); 
    }
    console.warn("No user data found for key: " + key);
    return result;
}

export function getAvatarByCharacterName(charName : string){
    const url = characterData.find(char => char.name === charName)?.url_icon || 'null';
    if(url && url != 'null') {
        console.log("chay" + url);
        return url;
    }
    console.log("chay" + url);
    return 'null';
}
export async function logout(){
    try {
        await AsyncStorage.removeItem('userData');
        await GoogleSignin.signOut();
        await AsyncStorage.removeItem('signInProvider');
    } catch (error) {
        console.log("Caught error when trying to logout:" + error);
    }
} 

export async function getIsLoggedIn() : Promise<boolean> {
    const uid = await getUserData('uid');
    return uid !== 'null';
}

// export async function setSignInProvider(provider: string) {
//     try {
//         await AsyncStorage.setItem('signInProvider', provider);
//     } catch (error) {
//         console.log("Caught error when trying to set sign-in provider:" + error);
//         return 'Null';
//     }
// }
// export async function getSignInProvider() {
//     try {
//         const provider = await AsyncStorage.getItem('signInProvider');
//         return provider !== null ? provider : 'Null';
//     } catch (error) {
//         console.log("Caught error when trying to get sign-in provider:" + error);
//         return 'Null';
//     }
// }

export async function bucu(){

}

export async function changeThemeColor(color : string){
    // Color hoặc black hoặc white
    try {
        await AsyncStorage.setItem('themeColor', color);
    } catch (error) {
        console.log("Caught error when trying to change theme color:" + error);
    }
}
export async function getThemeColor() {
    try {
        const color = await AsyncStorage.getItem('themeColor');
        return color !== null ? color : 'white';
    } catch (error) {
        console.log("Caught error when trying to get theme color:" + error);
        return 'white';
    }
}

export async function getResultLang() {
    try {
        const lang = await AsyncStorage.getItem('language');
        if (lang === "Vietnamese") return 'vi';
        return 'en';
    } catch (error) {
        console.log("Caught error when trying to get language:" + error);
        return 'vi';
    }
}

export async function setResultLangStorage(lang: string) {
    try {
        await AsyncStorage.setItem('language', lang);
    } catch (error) {
        console.log("Caught error when trying to set language:" + error);
    }
}

export async function getCharacterNameByPhotoURL(photoURL: string) {
    try {
        const character = characterData.find(char => char.url_icon === photoURL);
        return character ? character.name : 'Null';
    } catch (error) {
        console.log("Caught error when trying to get character name by photo URL:" + error);
        return 'Null';
    }
}