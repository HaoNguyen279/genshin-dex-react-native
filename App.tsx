import { createNativeStackNavigator, NativeStackNavigatorProps } from '@react-navigation/native-stack';
import {NavigationContainer, NavigationProp, useNavigation} from '@react-navigation/native';

import { StyleSheet, Text, View, Button, TextInput, Dimensions , Image, Pressable} from 'react-native';
import { Home } from './components/Home';
import { ImagesList } from './components/ImagesList';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { WishSimulator } from './components/WishSimulator';
import { useState } from 'react';

function ProfileScreen(){
    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);
  const navigation : NavigationProp<RootStackParamList> = useNavigation();
  return(
    <View>
      <Text>Test profile screen</Text>
      <Text>Name : Hao Nguyen</Text>
      <View>
        <Text>Ganyu</Text>
      </View>
      <Button title='Back to home' onPress={() => navigation.goBack()}/>

    
    </View>
  )
}


export default function App() {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const Tab = createBottomTabNavigator();
  const HomeStackScreen = ()=>{
    return(
      <Stack.Navigator>
        <Stack.Screen
          	name="Home"
          	component={Home}
          	options={{
			    headerShown:false
          	}}
        />
        <Stack.Screen 
           name="Images"
           component={ImagesList}
           options={{title:'Back'} }
          />
      </Stack.Navigator>
    )
  }
  return (

        <NavigationContainer>
            <Tab.Navigator>
                <Tab.Screen name='Main' component={HomeStackScreen} options={{headerShown:false}}/>
                <Tab.Screen name='Wish' component={WishSimulator} options={{headerShown:false}}/>
                {/* <Tab.Screen name='Profile' component={Test} options={{headerShown:false}}/>*/}
                
            </Tab.Navigator>
        </NavigationContainer>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  home:{
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems:"center",
    alignContent:"center"
  }


});
