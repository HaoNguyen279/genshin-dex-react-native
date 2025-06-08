import { createNativeStackNavigator, NativeStackNavigatorProps } from '@react-navigation/native-stack';
import {NavigationContainer, NavigationProp, useNavigation} from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput, Dimensions , Image, Pressable} from 'react-native';
import { Home } from './components/Home';
import { ImagesList } from './components/ImagesList';
import { ResizeMode } from 'expo-av';
import { useState } from 'react';

const { width, height } = Dimensions.get('screen')
function HomeScreen(){
  const navigation : NavigationProp<RootStackParamList> = useNavigation();
  return(
    <View style={styles.home}>
      
      <Text>Test homescreen navigator</Text>
      <Button title='See my profile' onPress={() => navigation.navigate("Profile")} >

      </Button>
    </View>
  )
}
function ProfileScreen(){

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

  return (
    
    <NavigationContainer>
      <Stack.Navigator
	  >
        <Stack.Screen
          	name="Home"
          	component={Home}
          	options={{
            title:"React Native Prj By Hao Nguyen",
			headerShown:false
          	}}
        />
        <Stack.Screen 
          name="Images"
          component={ImagesList}
          options={{title:'Back'}}
          />
      </Stack.Navigator>
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
  },

});
