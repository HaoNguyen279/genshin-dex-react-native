import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View ,Modal, Text, Dimensions, TouchableOpacity} from "react-native";
import data from "../../assets/data/character.json"
import { Image } from "expo-image";

const url_img_array = data.map(item => ({name: item.name, url_image: item.url_icon}));
const { width, height } = Dimensions.get("window");

const ChoosingAvatarModal: React.FC<{ isVisible: boolean, onClose : () => void }> = ({ isVisible, onClose }) => {
    useEffect(()=>{
        console.log("ChoosingAvatarModal isVisible: ", isVisible);
        Promise.all(url_img_array.map(item => Image.prefetch(item.url_image)))
    }, []);
    return (
        <Modal visible={isVisible} onRequestClose={onClose} transparent={true} animationType="fade" >
            <View style={{backgroundColor: "rgba(0, 0, 0, 0.5)", flex:1}}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Change your avatar</Text>
                    <TouchableOpacity style={{position:"absolute",right: 20}} onPress={onClose}>
                        <Image source={require("../../assets/wish_animation/close_button.png")} style={{width: 30, height: 30}} />
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={url_img_array}
                    numColumns={4}
                    contentContainerStyle={{ alignItems: 'center',paddingBottom:100 }}
                    scrollEnabled={true}
                    ListEmptyComponent={<Text>No avatars available</Text>}
                    keyExtractor={(item) => item.name}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => {
                            console.log("Selected avatar: ", item.name);
                        }}>
                            <View style={styles.avatarContainer}>
                            <Image source={{ uri: item.url_image }} style={styles.avatarImage} contentFit="contain"/>
                        </View>
                        </TouchableOpacity>
                    )}
                />
            </View>
        </Modal>
    );
}
export default ChoosingAvatarModal;

const styles = StyleSheet.create({
    header:{
        marginBottom:20
    },
    headerText:{    
        fontFamily:'genshin_font',
        textAlign:"center",
        fontSize: 20,
    },
    avatarContainer: {
        margin: 5,
        width: width * 0.2,
        height: width * 0.2,
        borderRadius: width * 0.1,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'white',
        backgroundColor:"white"
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    }
});