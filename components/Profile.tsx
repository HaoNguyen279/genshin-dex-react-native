import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import { Dimensions, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


const {width, height} = Dimensions.get("window");

export default function Profile(){
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    return(
        <SafeAreaView style={{flex:1, backgroundColor:"#fff"}}>
            <View style={{flex:1}}> 
                <View style={{width:width,height: height*0.1,flexDirection:"row",alignItems:"center", justifyContent:"center", backgroundColor:"#f0f0f0"}}>
                        <Image
                            style={{width: 50, height:50, margin:10}}
                            source={require("../assets/png/profile.png")}
                        />
                    <Text style={{color:"#000", fontSize:24}}>Nguyen Minh Hao</Text>
                </View>
            </View>
        </SafeAreaView>
    )
}