


export const defaultCharacter: Character = {
    id: 0,
    name: "",
    title: "",
    description: "",
    weaponType: 'WEAPON_SWORD_ONE_HAND',
    weaponText: "",
    bodyType: 'BODY_MALE',
    gender: "",
    qualityType: "",
    rarity: 4,
    birthdaymmdd: "",
    birthday: "",
    elementType: 'ELEMENT_NONE',
    elementText: "",
    affiliation: "",
    associationType: 'ASSOC_MAINACTOR',
    region: "",
    substatType: 'FIGHT_PROP_ATTACK_PERCENT',
    substatText: "",
    constellation: "",
    cv: {
        english: "",
        chinese: "",
        japanese: "",
        korean: ""
    },
    costs: {
        ascend1: [],
        ascend2: [],
        ascend3: [],
        ascend4: [],
        ascend5: [],
        ascend6: []
    },
    images: {
        filename_icon: "",
        filename_sideIcon: "",
        mihoyo_icon: "",
        mihoyo_sideIcon: ""
    },
    url: {
        fandom: ""
    },
    stats: () => ({}), // Giả sử StatFunction trả về object rỗng cho default
    version: ""
}

export const defaultVoiceover: Voiceover = {
    id: 0,
    name: "",
    friendLines: [],
    actionLines: [],
    version: {}
};