
import { NavigationProp, useNavigation} from '@react-navigation/native';
import {Text, View, Button} from 'react-native';
import React, {  useState } from 'react';



export function ProfileScreen(){
    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);
  const navigation : NavigationProp<RootStackParamList> = useNavigation();
  return(
    <View>
      <Text>Test profile screen</Text>
        <Text>Name : Hao Nguyen</Text>
        <Button title='Back to home' onPress={() => navigation.goBack()}/>
    </View>
  )
}