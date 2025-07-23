import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {NavigationContainer, NavigationProp, useNavigation} from '@react-navigation/native';
import { StyleSheet, Text, View, Button, Image} from 'react-native';
import { Home } from './components/Home';
import { ImagesList } from './components/ImagesList';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { WishSimulator } from './components/WishSimulator';
import React, { useEffect, useState } from 'react';
import CustomSplashScreen from './components/splashscreen/CustomSplashScreen';
import WelcomeScreen from './components/WelcomeScreen';
import Profile from './components/Profile';



export default function App() {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const Tab = createBottomTabNavigator();
    const [loading, setLoading] = useState(true);
  const HomeStackScreen = ()=>{
    return(
      <Stack.Navigator>
        <Stack.Screen
          	name="HomePage"
          	component={Home}
          	options={{
			        headerShown:false
          	}}
        />
        <Stack.Screen 
           name="Images"
           component={ImagesList}
           options={{
            headerShown:false
          }}
        />
      </Stack.Navigator>
    )
  }
    useEffect(() => {
		const preloadImages = async () => {
    	const urls = [
      "https://gensh.honeyhunterworld.com/img/skirknew_114_gacha_card_w145.webp",
    ];
    await Promise.all(urls.map(Image.prefetch));
  };

  preloadImages();
    	setTimeout(() => {
			setLoading(false);
		}, 4000); 
    }, []);

  if (loading) return <CustomSplashScreen />;
  return (
	<NavigationContainer>
		<Tab.Navigator
			screenOptions={{tabBarStyle:{height:70,paddingTop:10} , animation: 'shift'}}> 
      {/* Animtion cho tab bar, shift chuyển tiếp, fade thì là fade ừ fade ấy =) */}
			<Tab.Screen name='Welcome' component={WelcomeScreen}
				options={{
					headerShown:false, 
					tabBarIcon: () =>{ return <Image style={{width:30, height:30}} source={require("./assets/png/wish.webp")} />}}}/>
			<Tab.Screen name='HomePage' component={HomeStackScreen}
				options={{
					title:"Character Archive",
					tabBarIcon : () =>{ return <Image style={{width:30,height:30}} source={require("./assets/png/character_archive.png")}/>}
					}}/>
			<Tab.Screen name='Wish' component={WishSimulator}
				options={{
          title:"Wish Simulator",
					tabBarIcon: () =>{ return <Image style={{width:25, height:25}} source={require("./assets/wish_animation/intertwined_fate.webp")}/>}}}/>
      <Tab.Screen name='Profile' component={Profile}
        options={{
          title:"Profile",
          tabBarIcon: () =>{ return <Image style={{width:30, height:30}} source={require("./assets/png/profile.png")}/>}
        }}
      />
		</Tab.Navigator>
	</NavigationContainer>
  );
}

const styles = StyleSheet.create({
  home:{
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems:"center",
    alignContent:"center"
  }
});
