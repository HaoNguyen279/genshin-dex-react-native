import AsyncStorage from "@react-native-async-storage/async-storage";

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
        console.log("User data stored successfully:", await AsyncStorage.getItem('userData'));
    }catch(error){
        console.log("Caught error when trying to store user data:" + error);
    }
}

export async function getUserData(key : string){
    var result;
    try {
        if(key === 'displayName'){
            result = AsyncStorage.getItem('userData')
                .then(userdata => {
                    if(userdata){
                        return JSON.parse(userdata).displayName;
                    }
                    return 'null';
                })
            return result;
        }
        else if(key === 'email'){
            result = AsyncStorage.getItem('userData')
                .then(userdata => {
                    if(userdata){
                        return JSON.parse(userdata).email;
                    }
                    return 'null';
                })
            return result;
        }     
        else if(key === 'uid'){
            result = AsyncStorage.getItem('userData')
                .then(userdata => {
                    if(userdata){
                        return JSON.parse(userdata).uid;
                    }
                    return 'null';
                })
            return result;
        }
    } catch (error) {
       console.log("Caught error when trying to get user data:" + error); 
    }
    return result;
}

export async function logout(){
    try {
        await AsyncStorage.removeItem('userData');
    } catch (error) {
        console.log("Caught error when trying to logout:" + error);
    }
} 

export async function getIsLoggedIn() : Promise<boolean> {
    const uid = await getUserData('uid');
    return uid !== 'null';
}

export async function changeThemeColor(color : string){
    // Color hoặc black hoặc white
    try {
        await AsyncStorage.setItem('themeColor', color);
    } catch (error) {
        console.log("Caught error when trying to change theme color:" + error);
    }
}
async function getThemeColor() {
    try {
        const color = await AsyncStorage.getItem('themeColor');
        return color !== null ? color : 'white';
    } catch (error) {
        console.log("Caught error when trying to get theme color:" + error);
        return 'white';
    }
}
