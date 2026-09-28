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
  StatusBar,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import Svg, {
  Circle,
  RadialGradient,
  Defs,
  Stop,
  Rect,
} from "react-native-svg";

import CustomSplashScreen from "./splashscreen/CustomSplashScreen";
import data from "../assets/data/character.json";
import { scale } from "react-native-size-matters";

import {
  COLORS,
  SvgSparkle,
  SvgStar,
  SvgSwords,
  SvgGlobe,
  SvgSearch,
  SvgMic,
  SvgTune,
  SvgPerson,
  SvgClose,
} from "./ui/svg-icon";

// ─── Layout constants ────────────────────────────────────────────────
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
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

// ─── Region data ─────────────────────────────────────────────────────
const REGION_ORDER = [
  "Mondstadt",
  "Liyue",
  "Inazuma",
  "Sumeru",
  "Fontaine",
  "Natlan",
  "Snezhnaya",
  "Nod-Krai",
  "N/A",
];

const ALL_REGIONS = Array.from(
  new Set(data.map((item) => item.region))
).filter(Boolean);

const REGIONS = [
  ...REGION_ORDER.filter((r) => ALL_REGIONS.includes(r)),
  ...ALL_REGIONS.filter((r) => !REGION_ORDER.includes(r)),
];

const REGION_LABELS: Record<string, string> = {
  Mondstadt: "🏰  Mondstadt",
  Liyue: "🏮  Liyue",
  Inazuma: "⚡  Inazuma",
  Sumeru: "🌿  Sumeru",
  Fontaine: "⛲  Fontaine",
  Natlan: "🔥  Natlan",
  Snezhnaya: "❄️  Snezhnaya",
  "Nod-Krai": "⚙️  Nod-Krai",
  "N/A": "🌐  N/A",
};

// ─── Rarity gradients ────────────────────────────────────────────────
const RARITY_GRADIENTS: Record<number, [string, string, string]> = {
  5: ["#A0712E", "#C5994A", "#DDB862"],
  4: ["#565080", "#74669D", "#8E7CB8"],
};

// ─── iOS-style Animated Modal ───────────────────────────────────────
interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  showClear?: boolean;
  onClear?: () => void;
  children: React.ReactNode;
}

function FilterModal({
  visible,
  onClose,
  title,
  showClear,
  onClear,
  children,
}: FilterModalProps) {
  const [isRendered, setIsRendered] = useState(visible);
  const isVisibleRef = useRef(visible);
  isVisibleRef.current = visible;

  const scale = useSharedValue(0.88);
  const opacity = useSharedValue(0);
  const backdropOpacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      setIsRendered(true);
      scale.value = 0.88;
      opacity.value = 0;
      backdropOpacity.value = 0;

      // iOS Alert presentation spring:
      // Rapid scale from 0.88 to 1.0 with subtle settling overshoot
      scale.value = withSpring(1, {
        damping: 24,
        stiffness: 300,
        mass: 0.8,
      });
      opacity.value = withTiming(1, {
        duration: 180,
        easing: Easing.out(Easing.quad),
      });
      backdropOpacity.value = withTiming(1, {
        duration: 220,
        easing: Easing.out(Easing.quad),
      });
    } else if (isRendered) {
      // iOS Alert dismissal:
      // Snappy retreat (1.0 -> 0.92) with rapid fade
      scale.value = withTiming(0.92, {
        duration: 160,
        easing: Easing.in(Easing.quad),
      });
      opacity.value = withTiming(0, {
        duration: 140,
        easing: Easing.in(Easing.quad),
      });
      backdropOpacity.value = withTiming(
        0,
        {
          duration: 160,
          easing: Easing.in(Easing.quad),
        },
        (finished) => {
          if (finished && !isVisibleRef.current) {
            runOnJS(setIsRendered)(false);
          }
        }
      );
    }
  }, [visible]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  if (!isRendered) return null;

  return (
    <Modal
      visible={isRendered}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[StyleSheet.absoluteFill, styles.modalBackdrop, backdropStyle]}
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        </Animated.View>

        <Animated.View style={sheetStyle}>
          <Pressable
            style={styles.modalSheet}
            onPress={(e) => e.stopPropagation?.()}
          >
            <Text style={styles.modalTitle}>{title}</Text>
            <View style={styles.modalDivider} />

            {children}

            {showClear && onClear && (
              <>
                <View style={styles.modalDivider} />
                <Pressable style={styles.modalClearBtn} onPress={onClear}>
                  <Text style={styles.modalClearText}>Clear Filter</Text>
                </Pressable>
              </>
            )}
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

// ─── Main component ─────────────────────────────────────────────────
export function Home() {
  const navigation: NavigationProp<RootStackParamList> = useNavigation();
  const insets = useSafeAreaInsets();
  const searchInputRef = useRef<TextInput>(null);

  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [onPress5Star, setOnPress5Star] = useState(false);
  const [onPress4Star, setOnPress4Star] = useState(false);

  // Dropdown filter state
  const [showElementModal, setShowElementModal] = useState(false);
  const [showWeaponModal, setShowWeaponModal] = useState(false);
  const [showRegionModal, setShowRegionModal] = useState(false);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [selectedWeapon, setSelectedWeapon] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

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
    const timer = setTimeout(() => {
      if (onPress4Star) {
        filtered = filtered.filter((item) => item.rarity === 4);
      }
      if (onPress5Star) {
        filtered = filtered.filter((item) => item.rarity === 5);
      }
      if (selectedElement) {
        filtered = filtered.filter((item) => item.element === selectedElement);
      }
      if (selectedWeapon) {
        filtered = filtered.filter((item) => item.weapon === selectedWeapon);
      }
      if (selectedRegion) {
        filtered = filtered.filter((item) => item.region === selectedRegion);
      }
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredData(filtered);
    }, 200);

    return () => clearTimeout(timer);
  }, [
    searchText,
    onPress4Star,
    onPress5Star,
    selectedElement,
    selectedWeapon,
    selectedRegion,
  ]);
  
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
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.surface} />

      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
        <View style={styles.topHeader}>
          
          <View style={styles.topHeaderLeft}>
            <SvgSparkle size={20} color={COLORS.primary} />
            <View style={styles.headerTitleCol}>
              <Text style={styles.headerMainTitle}>Character Archive</Text>
              <Text style={styles.headerSubTitle}>NHÂN VẬT</Text>
            </View>
          </View>

          <View style={styles.topHeaderRight}>
            <View style={styles.countBadge}>
              <SvgPerson size={13} color={COLORS.primary} />
              <Text style={styles.countText}>{filteredData.length}</Text>
            </View>
          </View>

        </View>

        {/* ── Controls Deck (Search & Filters) ─────────────── */}
        <View style={styles.headerDeck}>
          {/* Search Input Container */}
          <View style={styles.searchContainer}>
            <SvgSearch size={18} color={COLORS.primary} />
            <TextInput
              ref={searchInputRef}
              style={styles.searchInput}
              placeholder="Tìm kiếm nhân vật..."
              placeholderTextColor={COLORS.outline}
              value={searchText}
              onChangeText={setSearchText}
              returnKeyType="search"
              selectionColor={COLORS.primary}
            />
            {searchText.length > 0 ? (
              <Pressable
                onPress={() => {
                  searchInputRef.current?.blur();
                  searchInputRef.current?.clear();
                  setSearchText("");
                }}
                hitSlop={10}
                style={styles.searchActionBtn}
              >
                <SvgClose size={16} color={COLORS.onSurfaceVariant} />
              </Pressable>
            ) : (
              <Pressable hitSlop={10} style={styles.searchActionBtn}>
                <SvgMic size={18} color={COLORS.onSurfaceVariant} />
              </Pressable>
            )}
          </View>

          {/* Filter Row (Horizontal ScrollView) */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
          >
            {/* 5-Star toggle */}
            <Pressable
              onPress={handleOnPress5Star}
              style={[
                styles.rarityPill,
                {
                  backgroundColor: onPress5Star
                    ? `${COLORS.primary}33`
                    : `${COLORS.primary}15`,
                  borderColor: onPress5Star ? COLORS.primary : "transparent",
                },
              ]}
            >
              <SvgStar size={12} color={COLORS.primary} filled />
              <Text style={[styles.rarityText, { color: COLORS.primary }]}>
                5 SAO
              </Text>
            </Pressable>

            {/* 4-Star toggle */}
            <Pressable
              onPress={handleOnPress4Star}
              style={[
                styles.rarityPill,
                {
                  backgroundColor: onPress4Star
                    ? `${COLORS.secondary}33`
                    : `${COLORS.secondary}15`,
                  borderColor: onPress4Star ? COLORS.secondary : "transparent",
                },
              ]}
            >
              <SvgStar size={12} color={COLORS.secondary} filled />
              <Text style={[styles.rarityText, { color: COLORS.secondary }]}>
                4 SAO
              </Text>
            </Pressable>

            {/* Element dropdown trigger */}
            <Pressable
              onPress={() => setShowElementModal(true)}
              style={[
                styles.filterChip,
                selectedElement != null
                  ? {
                      borderColor: ELEMENT_COLORS[selectedElement] ?? COLORS.primary,
                      backgroundColor:
                        (ELEMENT_COLORS[selectedElement] ?? COLORS.primary) + "25",
                    }
                  : styles.filterChipInactive,
              ]}
            >
              {selectedElement != null && ELEMENT_ICONS[selectedElement] ? (
                <Image
                  source={ELEMENT_ICONS[selectedElement]}
                  style={styles.filterChipIcon}
                />
              ) : (
                <SvgSparkle size={13} color={COLORS.onSurfaceVariant} />
              )}
              <Text
                style={[
                  styles.filterChipText,
                  selectedElement != null
                    ? {
                        color: ELEMENT_COLORS[selectedElement] ?? COLORS.primary,
                        fontWeight: "bold",
                      }
                    : styles.filterChipTextInactive,
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
                selectedWeapon != null
                  ? {
                      borderColor: COLORS.primary,
                      backgroundColor: "rgba(255, 213, 141, 0.25)",
                    }
                  : styles.filterChipInactive,
              ]}
            >
              <SvgSwords
                size={13}
                color={
                  selectedWeapon != null ? COLORS.primary : COLORS.onSurfaceVariant
                }
              />
              <Text
                style={[
                  styles.filterChipText,
                  selectedWeapon != null
                    ? { color: COLORS.primary, fontWeight: "bold" }
                    : styles.filterChipTextInactive,
                ]}
              >
                {selectedWeapon != null
                  ? `${WEAPON_LABELS[selectedWeapon]}`
                  : "Weapon"}{" "}
                ▾
              </Text>
            </Pressable>

            {/* Region dropdown trigger */}
            <Pressable
              onPress={() => setShowRegionModal(true)}
              style={[
                styles.filterChip,
                selectedRegion != null
                  ? {
                      borderColor: COLORS.primary,
                      backgroundColor: "rgba(255, 213, 141, 0.25)",
                    }
                  : styles.filterChipInactive,
              ]}
            >
              <SvgGlobe
                size={13}
                color={
                  selectedRegion != null ? COLORS.primary : COLORS.onSurfaceVariant
                }
              />
              <Text
                style={[
                  styles.filterChipText,
                  selectedRegion != null
                    ? { color: COLORS.primary, fontWeight: "bold" }
                    : styles.filterChipTextInactive,
                ]}
              >
                {selectedRegion != null
                  ? `${REGION_LABELS[selectedRegion] ?? selectedRegion}`
                  : "Region"}{" "}
                ▾
              </Text>
            </Pressable>
          </ScrollView>
        </View>
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
        <FilterModal
          visible={showElementModal}
          onClose={() => setShowElementModal(false)}
          title="Select Element"
          showClear={selectedElement != null}
          onClear={() => {
            setSelectedElement(null);
            setShowElementModal(false);
          }}
        >
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
        </FilterModal>

        {/* ── Weapon Modal ────────────────────────────────────────── */}
        <FilterModal
          visible={showWeaponModal}
          onClose={() => setShowWeaponModal(false)}
          title="Select Weapon"
          showClear={selectedWeapon != null}
          onClear={() => {
            setSelectedWeapon(null);
            setShowWeaponModal(false);
          }}
        >
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
        </FilterModal>

        {/* ── Region Modal ─────────────────────────────────────────── */}
        <FilterModal
          visible={showRegionModal}
          onClose={() => setShowRegionModal(false)}
          title="Select Region"
          showClear={selectedRegion != null}
          onClear={() => {
            setSelectedRegion(null);
            setShowRegionModal(false);
          }}
        >
          <ScrollView
            style={{ maxHeight: SCREEN_HEIGHT * 0.55 }}
            showsVerticalScrollIndicator={false}
          >
            {REGIONS.map((reg) => {
              const isActive = selectedRegion === reg;
              const label = REGION_LABELS[reg] ?? `📍  ${reg}`;
              const [emoji, ...nameParts] = label.split("  ");
              const name = nameParts.join("  ") || reg;
              return (
                <Pressable
                  key={reg}
                  style={[
                    styles.modalOption,
                    isActive && {
                      backgroundColor: "rgba(212,166,80,0.18)",
                    },
                  ]}
                  onPress={() => {
                    setSelectedRegion(isActive ? null : reg);
                    setShowRegionModal(false);
                  }}
                >
                  <Text style={styles.modalWpEmoji}>{emoji}</Text>
                  <Text
                    style={[
                      styles.modalOptionText,
                      isActive && { color: "#D4A650" },
                    ]}
                  >
                    {name}
                  </Text>
                  {isActive && (
                    <Text style={[styles.modalCheck, { color: "#D4A650" }]}>
                      ✓
                    </Text>
                  )}
                </Pressable>
              );
            })}
          </ScrollView>
        </FilterModal>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────
const BG_PRIMARY = "#0e1323";
const BG_SURFACE = "#1a1f2f";
const BORDER_COLOR = "rgba(255, 255, 255, 0.08)";

const styles = StyleSheet.create({
  // Layout
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },

  // ── Header ──────────────────────────────────────────────────────────
  topHeader: {
    height: 56,
    paddingHorizontal: HORIZONTAL_PADDING,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(14, 19, 35, 0.92)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 213, 141, 0.12)",
    zIndex: 10,
  },
  topHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitleCol: {
    flexDirection: "column",
  },
  headerMainTitle: {
    fontFamily: "genshin_font",
    fontSize: scale(16),
    color: COLORS.primary,
    letterSpacing: 0.5,
  },
  headerSubTitle: {
    fontFamily: "montserrat-semi-bold",
    fontSize: scale(9),
    color: COLORS.onSurfaceVariant,
    letterSpacing: 1.5,
  },
  topHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  countBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceHigh,
  },
  countText: {
    fontFamily: "montserrat-semi-bold",
    fontSize: scale(11),
    color: COLORS.primary,
    fontWeight: "bold",
  },
  iconBtn: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarPill: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 2,
  },

  // ── Controls Deck ───────────────────────────────────────────────────
  headerDeck: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: 12,
    paddingBottom: 6,
    gap: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surfaceLow,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 42,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  searchInput: {
    flex: 1,
    fontFamily: "montserrat",
    fontSize: scale(12),
    color: COLORS.onSurface,
    marginLeft: 8,
    padding: 0,
  },
  searchActionBtn: {
    padding: 4,
  },

  // Filters
  filterRow: {
    gap: 8,
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: 2,
  },
  rarityPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  rarityText: {
    fontFamily: "montserrat-semi-bold",
    fontSize: scale(10),
    fontWeight: "bold",
    letterSpacing: 0.8,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterChipInactive: {
    backgroundColor: COLORS.surfaceContainer,
    borderColor: "rgba(255, 255, 255, 0.06)",
  },
  filterChipText: {
    fontFamily: "montserrat-semi-bold",
    fontSize: scale(11),
    letterSpacing: 0.5,
  },
  filterChipTextInactive: {
    color: COLORS.onSurfaceVariant,
  },
  filterChipIcon: {
    width: 16,
    height: 16,
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
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBackdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.72)",
  },
  modalSheet: {
    backgroundColor: "#161b2b",
    borderRadius: 18,
    width: SCREEN_WIDTH * 0.76,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 213, 141, 0.2)",
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
  },
  modalTitle: {
    fontFamily: "genshin_font",
    fontSize: scale(16),
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 6,
  },
  modalDivider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
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
    color: COLORS.onSurfaceVariant,
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
    color: COLORS.error,
  },
});