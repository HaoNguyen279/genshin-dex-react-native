import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {NavigationContainer,getFocusedRouteNameFromRoute, useNavigation, useRoute  } from '@react-navigation/native';
import { StyleSheet, Image, Dimensions} from 'react-native';
import { Home } from './components/Home';
import { ImagesList } from './components/ImagesList';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { WishSimulator } from './components/WishSimulator';
import React, { use, useEffect, useLayoutEffect, useState } from 'react';
import CustomSplashScreen from './components/splashscreen/CustomSplashScreen';
import WelcomeScreen from './components/WelcomeScreen';
import Profile from './components/Profile';
import SignIn from './components/authenticationscreen/SignIn';
import SignUp from './components/authenticationscreen/SignUp';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import BirthdayList from './components/BirthdayList';



export default function App() {
    const Stack = createNativeStackNavigator<RootStackParamList>();
    const Tab = createBottomTabNavigator();
    const [isLandscape, setIsLandscape] = useState((Dimensions.get('window').width >= Dimensions.get('window').height));
    const [loaded,error] = useFonts({
            'montserrat': require("./assets/fonts/Montserrat-VariableFont_wght.ttf"),
            'montserrat-semi-bold': require("./assets/fonts/Montserrat-SemiBold.ttf"),
            'genshin_font': require("./assets/fonts/genshin_font.ttf"),
  });
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
    };
    const MainScreen = () =>{
        return (
            <Stack.Navigator>
                <Stack.Screen
                    name="Welcome"
                    component={WelcomeScreen}
                    options={{
                        headerShown: false
                    }}
                />
                <Stack.Screen
                    name="BirthdayListScreen"
                    component={BirthdayList}
                    options={{
                        headerShown: false
                    }}
                />
            </Stack.Navigator>
        )
    }

    const ProfileScreen = () => {
      return (
        <Stack.Navigator>
          <Stack.Screen
            name="Profile"
            component={Profile}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="SignIn"
            component={SignIn}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      )
    };
    useEffect(() => {
        const handleOrientationChange = () => {
            setIsLandscape(Dimensions.get('window').width >= Dimensions.get('window').height);
        };
        const subscription = Dimensions.addEventListener('change', handleOrientationChange);
        return () => {
            subscription?.remove();
        };
    },[]);

    if (!loaded) return <CustomSplashScreen/>;
    return (
    <SafeAreaProvider>
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={{tabBarStyle:{height:70,paddingTop:10} , animation: 'shift'}}
            >
            {/* Animtion cho tab bar, shift chuyển tiếp, fade thì là fade ừ fade ấy =) */}
                <Tab.Screen name='MainScreen' component={MainScreen}
                    options={{
                        headerShown:false, 
                        tabBarIcon: () =>{ return <Image style={{width:30, height:30}} source={require("./assets/png/wish.webp")} />}}}/>
                <Tab.Screen name='HomePage' component={HomeStackScreen}
                    options={({route}) =>{
                        const routeName = getFocusedRouteNameFromRoute(route) ?? 'HomePage';
                        const hide = routeName === 'Images';
                        return {
                            headerShown:false,
                            title:"Character Archive",
                            tabBarStyle : hide ? {display: 'none'} : {height:70,paddingTop:10, animation: 'shift'},
                            tabBarIcon : () =>{ return <Image style={{width:30,height:30}} source={require("./assets/png/character_archive.png")}/>}
                        }
                       }}/>
                <Tab.Screen name='Wish' component={WishSimulator}
                    options={{
                        headerShown:false,
                        title:"Wish Simulator",
                        tabBarStyle: {display: isLandscape ? 'none' : 'flex'},
                        tabBarIcon: () =>{ return <Image style={{width:25, height:25}} source={require("./assets/wish_animation/intertwined_fate.webp")}/>}}}/>
                <Tab.Screen name='ProfileScreen' component={ProfileScreen}
                    options={({route})=>{
                        const routeName = getFocusedRouteNameFromRoute(route) ?? 'Profile';
                        const hide = routeName === 'SignIn' || routeName === 'SignUp';
                        return {
                            headerShown:false,
                            title:"Profile",
                            tabBarStyle: hide ? {display: 'none'} :{height:70,paddingTop:10, animation: 'shift'},
                            tabBarIcon: () =>{ return <Image style={{width:30, height:30}} source={require("./assets/png/profile.png")}/>}
                        }
                    }}
            />
            </Tab.Navigator>
        </NavigationContainer>
    </SafeAreaProvider>
  );
}

