

type RootStackParamList = {
    "Home" : undefined,
    "Profile" : undefined,
    "Images" :  
     {  
        id: number,
        name: string,
        element: string,
        rarity: number,
        weapon: string,
        region: string,
        role: string,
        birthday: string,
        about: string,
        url_image: string,
        url_icon: string
    }  
    | undefined ,
}

type FontOfElement = {
    style : ViewStyle
}