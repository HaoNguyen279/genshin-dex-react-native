import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  Dimensions,
  Modal,
  ScrollView,
} from "react-native";
import Animated, { FadeIn, FadeInDown, ZoomIn } from "react-native-reanimated";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";

import CustomSplashScreen from "./splashscreen/CustomSplashScreen";
import data from "../assets/data/character.json";
import { scale } from "react-native-size-matters";

// ─── Layout constants ────────────────────────────────────────────────
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const HORIZONTAL_PADDING = 12;
const CARD_GAP = 16;
const NUM_COLUMNS = 4;
const CARD_WIDTH =
  (SCREEN_WIDTH - HORIZONTAL_PADDING * 2 - CARD_GAP * (NUM_COLUMNS - 1)) /
  NUM_COLUMNS;
const CARD_IMAGE_HEIGHT = CARD_WIDTH * 1.15;

const preload_icon_list = data.map((item) => item.url_icon);

// ─── Element data ────────────────────────────────────────────────────
const ELEMENT_ICONS: Record<string, any> = {
  Pyro: require("../assets/element_icons/Element_Pyro.webp"),
  Hydro: require("../assets/element_icons/Element_Hydro.webp"),
  Electro: require("../assets/element_icons/Element_Electro.webp"),
  Cryo: require("../assets/element_icons/Element_Cryo.webp"),
  Dendro: require("../assets/element_icons/Element_Dendro.webp"),
  Anemo: require("../assets/element_icons/Element_Anemo.webp"),
  Geo: require("../assets/element_icons/Element_Geo.webp"),
};

const ELEMENTS = ["Pyro", "Hydro", "Electro", "Cryo", "Dendro", "Anemo", "Geo"];

const ELEMENT_COLORS: Record<string, string> = {
  Pyro: "#EF7938",
  Hydro: "#4CC2F1",
  Electro: "#B07BD8",
  Cryo: "#9FD6E3",
  Dendro: "#A0C939",
  Anemo: "#74C2A8",
  Geo: "#F5B723",
};

// ─── Weapon data ─────────────────────────────────────────────────────
const WEAPONS = ["Sword", "Bow", "Claymore", "Polearm", "Catalyst"];

const WEAPON_LABELS: Record<string, string> = {
  Sword: "⚔️  Sword",
  Bow: "🏹  Bow",
  Claymore: "🗡️  Claymore",
  Polearm: "🔱  Polearm",
  Catalyst: "📖  Catalyst",
};

// ─── Rarity gradients ────────────────────────────────────────────────
const RARITY_GRADIENTS: Record<number, [string, string, string]> = {
  5: ["#A0712E", "#C5994A", "#DDB862"],
  4: ["#565080", "#74669D", "#8E7CB8"],
};

// ─── Main component ─────────────────────────────────────────────────
export function Home() {
  const navigation: NavigationProp<RootStackParamList> = useNavigation();
  const insets = useSafeAreaInsets();
  const searchInputRef = useRef<TextInput>(null);

  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [onPress5Star, setOnPress5Star] = useState(false);
  const [onPress4Star, setOnPress4Star] = useState(false);

  // Dropdown filter state (UI only — no filtering logic applied)
  const [showElementModal, setShowElementModal] = useState(false);
  const [showWeaponModal, setShowWeaponModal] = useState(false);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [selectedWeapon, setSelectedWeapon] = useState<string | null>(null);

  const [filteredData, setFilteredData] = useState(data);
  useEffect(() => {
    const preload_url = async () => {
      await Promise.all(
        preload_icon_list.map((url_icon) => Image.prefetch(url_icon))
      ).catch((err) => console.warn("Failed to preload url icon: " + err));
      setLoading(false);
    };
    preload_url();
  });
  useEffect(() => {
    let filtered = data;
    setTimeout(() => {
      if (onPress4Star) {
        filtered = filtered.filter((item) => item.rarity === 4);
      }if (onPress5Star) {
        filtered = filtered.filter((item) => item.rarity === 5);
      }if(selectedElement){
        filtered = filtered.filter((item) => item.element === selectedElement);
      }if(selectedWeapon){
        filtered = filtered.filter((item) => item.weapon === selectedWeapon);
      }
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredData(filtered);
    }, 200);
  }, [searchText, onPress4Star, onPress5Star, selectedElement, selectedWeapon]);
  
  const handleOnPress4Star = () => {
    setOnPress4Star(!onPress4Star);
    setOnPress5Star(false);
  };
  const handleOnPress5Star = () => {
    setOnPress5Star(!onPress5Star);
    setOnPress4Star(false);
  };

  if (loading) return <CustomSplashScreen />;



  // ─── Render a single character card ──────────────────────────────
  const renderCard = ({ item, index }: { item: (typeof data)[0], index: number }) => {
    const gradientColors = RARITY_GRADIENTS[item.rarity] ?? RARITY_GRADIENTS[4];
    return (
      <Animated.View entering={FadeIn.duration(600).delay(index * 50)}>
        <Pressable
        onPress={() => navigation.navigate("Images", item)}
        style={styles.cardContainer}
      >
        <LinearGradient
          colors={gradientColors}
          style={styles.cardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        >
          {/* Element badge */}
          {ELEMENT_ICONS[item.element] && (
            <View
              style={[
                styles.elementBadge,
                { backgroundColor: (ELEMENT_COLORS[item.element] ?? "#555") + "40" },
              ]}
            >
              <Image
                source={ELEMENT_ICONS[item.element]}
                style={styles.elementIcon}
              />
            </View> // lala
          )}

          {/* Character icon */}
          <Image
            source={{ uri: item.url_icon }}
            style={styles.cardCharIcon}
            priority="high"
          />
                <View style={styles.cardNameStrip}>
                  <Text style={styles.cardName} numberOfLines={1} adjustsFontSizeToFit>
                    {item.name}
                  </Text>
                </View>
        </LinearGradient>
      </Pressable>
      </Animated.View>
    );
  };

  // ─── Main render ───────────────────────────────────────────────── main
  return (
    <SafeAreaView style={[styles.safeArea]}>  
      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
        <Text style={styles.headerText}>Character Archive</Text>
        {/* ── Search Bar ──────────────────────────────────────────── */}
        <View style={styles.searchWrapper}>
          <View style={styles.searchBar}>
            <TextInput
              ref={searchInputRef}
              style={styles.searchInput}
              placeholder="Search characters..."
              placeholderTextColor="#8B8DA3"
              onChangeText={setSearchText}
              returnKeyType="search"
              selectionColor="#D4A650"
            />
            <Pressable
              onPress={() =>{
                searchInputRef.current?.blur();
                searchInputRef.current?.clear();
               setSearchText("")
            }}>
              <Image
                source={require("../assets/png/search_icon.png")}
                style={styles.searchIcon}
                tintColor="#8B8DA3"
              />
            </Pressable>
          </View>
        </View>

        {/* ── Filter Row ──────────────────────────────────────────── */}
        <ScrollView
          style={{paddingVertical: 4,marginBottom: 4, flexGrow: 0}}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {/* 4-Star toggle */}
          <Pressable
            onPress={handleOnPress4Star}
            style={[styles.filterChip, onPress4Star && styles.filterChipActive4]}
          >
            <Text
              style={[
                styles.filterChipText,
                onPress4Star && styles.filterChipTextActive,
              ]}
            >
              ★ 4
            </Text>
          </Pressable>

          {/* 5-Star toggle */}
          <Pressable
            onPress={handleOnPress5Star}
            style={[styles.filterChip, onPress5Star && styles.filterChipActive5]}
          >
            <Text
              style={[
                styles.filterChipText,
                onPress5Star && styles.filterChipTextActive,
              ]}
            >
              ★ 5
            </Text>
          </Pressable>

          {/* Element dropdown trigger */}
          <Pressable
            onPress={() => setShowElementModal(true)}
            style={[
              styles.filterChip,
              selectedElement != null && {
                borderColor: ELEMENT_COLORS[selectedElement],
                backgroundColor: (ELEMENT_COLORS[selectedElement] ?? "#555") + "20",
              },
            ]}
          >
            {selectedElement != null && ELEMENT_ICONS[selectedElement] && (
              <Image
                source={ELEMENT_ICONS[selectedElement]}
                style={styles.filterChipIcon}
              />
            )}
            <Text
              style={[
                styles.filterChipText,
                selectedElement != null && styles.filterChipTextActive,
              ]}
            >
              {selectedElement ?? "Element"} ▾
            </Text>
          </Pressable>

          {/* Weapon dropdown trigger */}
          <Pressable
            onPress={() => setShowWeaponModal(true)}
            style={[
              styles.filterChip,
              selectedWeapon != null && {
                borderColor: "#D4A650",
                backgroundColor: "rgba(212,166,80,0.15)",
              },
            ]}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedWeapon != null && styles.filterChipTextActive,
              ]}
            >
              {selectedWeapon != null
                ? `${WEAPON_LABELS[selectedWeapon]}`
                : "⚔ Weapon"}{" "}
              ▾
            </Text>
          </Pressable>
        </ScrollView>
        {/* ── Character Grid ──────────────────────────────────────── */}
        <FlatList
          data={filteredData}
          renderItem={renderCard}
          numColumns={NUM_COLUMNS}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.gridContent}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Image
                source={require("../assets/png/qiqi_sticker.webp")}
                style={styles.emptyImage}
              />
              <Text style={styles.emptyText}>
                The world is wide, try to search something else!
              </Text>
            </View>
          )}
        />

        {/* ── Element Modal ───────────────────────────────────────── */}
        
        <Modal
          visible={showElementModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowElementModal(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setShowElementModal(false)}
          >
            <Animated.View entering={ZoomIn.duration(200).springify()}>
            <Pressable style={styles.modalSheet}>
              <Text style={styles.modalTitle}>Select Element</Text>
              <View style={styles.modalDivider} />

              {ELEMENTS.map((el) => {
                const isActive = selectedElement === el;
                return (
                  <Pressable
                    key={el}
                    style={[
                      styles.modalOption,
                      isActive && {
                        backgroundColor: (ELEMENT_COLORS[el] ?? "#555") + "25",
                      },
                    ]}
                    onPress={() => {
                      setSelectedElement(isActive ? null : el);
                      setShowElementModal(false);
                    }}
                  >
                    <Image
                      source={ELEMENT_ICONS[el]}
                      style={styles.modalElIcon}
                    />
                    <Text
                      style={[
                        styles.modalOptionText,
                        isActive && { color: ELEMENT_COLORS[el] },
                      ]}
                    >
                      {el}
                    </Text>
                    {isActive && (
                      <Text
                        style={[styles.modalCheck, { color: ELEMENT_COLORS[el] }]}
                      >
                        ✓
                      </Text>
                    )}
                  </Pressable>
                );
              })}

              {selectedElement != null && (
                <>
                  <View style={styles.modalDivider} />
                  <Pressable
                    style={styles.modalClearBtn}
                    onPress={() => {
                      setSelectedElement(null);
                      setShowElementModal(false);
                    }}
                  >
                    <Text style={styles.modalClearText}>Clear Filter</Text>
                  </Pressable>
                </>
              )}
            </Pressable>
            </Animated.View>
          </Pressable>
        </Modal>
      
        {/* ── Weapon Modal ────────────────────────────────────────── */}
      
        <Modal
            visible={showWeaponModal}
            transparent
            animationType="fade"
            onRequestClose={() => setShowWeaponModal(false)}
          >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setShowWeaponModal(false)}
          >
            <Animated.View entering={ZoomIn.duration(200).springify()}>
            <Pressable style={styles.modalSheet}>
              <Text style={styles.modalTitle}>Select Weapon</Text>
              <View style={styles.modalDivider} />

              {WEAPONS.map((wp) => {
                const isActive = selectedWeapon === wp;
                return (
                  <Pressable
                    key={wp}
                    style={[
                      styles.modalOption,
                      isActive && {
                        backgroundColor: "rgba(212,166,80,0.18)",
                      },
                    ]}
                    onPress={() => {
                      setSelectedWeapon(isActive ? null : wp);
                      setShowWeaponModal(false);
                    }}
                  >
                    <Text style={styles.modalWpEmoji}>
                      {WEAPON_LABELS[wp]?.split("  ")[0]}
                    </Text>
                    <Text
                      style={[
                        styles.modalOptionText,
                        isActive && { color: "#D4A650" },
                      ]}
                    >
                      {wp}
                    </Text>
                    {isActive && (
                      <Text style={[styles.modalCheck, { color: "#D4A650" }]}>
                        ✓
                      </Text>
                    )}
                  </Pressable>
                );
              })}

              {selectedWeapon != null && (
                <>
                  <View style={styles.modalDivider} />
                  <Pressable
                    style={styles.modalClearBtn}
                    onPress={() => {
                      setSelectedWeapon(null);
                      setShowWeaponModal(false);
                    }}
                  >
                    <Text style={styles.modalClearText}>Clear Filter</Text>
                  </Pressable>
                </>
              )}
            </Pressable>
            </Animated.View>
          </Pressable>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────
const BG_PRIMARY = "#1E1E2E";
const BG_SURFACE = "#2A2C3E";
const BORDER_COLOR = "#3A3C50";

const styles = StyleSheet.create({
  headerText: {
    fontFamily: "genshin_font",
    fontSize: scale(18),
    color: "#E8E8F0",
    textAlign: "left",
    marginVertical: 10,
    marginHorizontal: HORIZONTAL_PADDING,
  },
  // Layout
  safeArea: {
    flex: 1,
    backgroundColor: BG_PRIMARY,
  },
  container: {
    flex: 1,
    backgroundColor: BG_PRIMARY,
  },

  // ── Search ──────────────────────────────────────────────────────
  searchWrapper: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: 10,
    paddingBottom: 4,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: BG_SURFACE,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 46,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  searchIcon: {
    width: 18,
    height: 18,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontFamily: "genshin_font",
    fontSize: scale(13),
    color: "#E8E8F0",
    padding: 0,
  },

  // ── Filters ─────────────────────────────────────────────────────
  filterRow: {
    paddingHorizontal: HORIZONTAL_PADDING,
    gap: 8,
    alignItems: "center",
    flexDirection: "row",
    height: 60,
    paddingBottom: 8,
    flexGrow: 0,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: BG_SURFACE,
    borderWidth: 1.5,
    borderColor: BORDER_COLOR,
    gap: 6,
  },
  filterChipActive4: {
    backgroundColor: "rgba(142,124,184,0.25)",
    borderColor: "#8E7CB8",
  },
  filterChipActive5: {
    backgroundColor: "rgba(212,166,80,0.25)",
    borderColor: "#D4A650",
  },
  filterChipText: {
    fontFamily: "genshin_font",
    fontSize: scale(11),
    color: "#B0B0C4",
  },
  filterChipTextActive: {
    color: "#FFFFFF",
  },
  filterChipIcon: {
    width: 18,
    height: 18,
  },

  // ── Grid ────────────────────────────────────────────────────────
  gridContent: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: 8,
    justifyContent: "flex-start",
  },
  gridRow: {
    gap: CARD_GAP,
    marginBottom: CARD_GAP,
  },

  // ── Card ────────────────────────────────────────────────────────
  cardContainer: {
    width: CARD_WIDTH,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: BG_SURFACE,
  },
  cardGradient: {
    width: "100%",
    height: CARD_IMAGE_HEIGHT,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  elementBadge: {
    position: "absolute",
    top: 5,
    left: 5,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  elementIcon: {
    width: 18,
    height: 18,
  },
  cardCharIcon: {
    width: CARD_WIDTH * 0.88,
    height: CARD_IMAGE_HEIGHT * 0.88,
  },
  cardNameStrip: {
    // paddingVertical: 7,
    // paddingHorizontal: 4,
    // alignItems: "center",
    width: "100%",
    backgroundColor: "#eee4da",
  },
  cardName: {
    fontFamily: "genshin_font",
    fontSize: scale(10),
    color: "#393f49",
    textAlign: "center",
  },

  // ── Empty state ─────────────────────────────────────────────────
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 80,
    marginHorizontal: 40,
  },
  emptyImage: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  emptyText: {
    fontFamily: "genshin_font",
    color: "#8B8DA3",
    textAlign: "center",
    fontSize: scale(14),
    lineHeight: 24,
  },

  // ── Modal (shared) ──────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalSheet: {
    backgroundColor: "#252738",
    borderRadius: 18,
    width: SCREEN_WIDTH * 0.72,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
  },
  modalTitle: {
    fontFamily: "genshin_font",
    fontSize: scale(16),
    color: "#E8E8F0",
    textAlign: "center",
    marginBottom: 6,
  },
  modalDivider: {
    height: 1,
    backgroundColor: BORDER_COLOR,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 12,
  },
  modalElIcon: {
    width: 30,
    height: 30,
  },
  modalWpEmoji: {
    fontSize: 22,
    width: 30,
    textAlign: "center",
  },
  modalOptionText: {
    fontFamily: "genshin_font",
    fontSize: scale(14),
    color: "#C8C8D8",
    flex: 1,
  },
  modalCheck: {
    fontSize: 20,
    fontWeight: "bold",
  },
  modalClearBtn: {
    alignItems: "center",
    paddingVertical: 12,
  },
  modalClearText: {
    fontFamily: "genshin_font",
    fontSize: scale(13),
    color: "#EF7938",
  },
});