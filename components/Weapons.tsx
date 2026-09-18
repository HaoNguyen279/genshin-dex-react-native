import React, { useRef, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  FlatList,
  Modal,
  ScrollView,
  Dimensions,
  StatusBar,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { scale } from "react-native-size-matters";
import {
  COLORS,
  SvgSparkle,
  SvgArrowUp,
  SvgClose,
  SvgMic,
  SvgSearch,
  SvgSwords,
  SvgStar,
  SvgSort,
  SvgHeart,
  SvgUpgrade,
  SvgCompare,
  SvgTune,
  SvgPerson,
} from "./ui/svg-icon";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const HORIZONTAL_MARGIN = 16;



// ─── Element Icons Map ────────────────────────────────────────────────
const ELEMENT_ICONS: Record<string, any> = {
  Pyro: require("../assets/element_icons/Element_Pyro.webp"),
  Hydro: require("../assets/element_icons/Element_Hydro.webp"),
  Electro: require("../assets/element_icons/Element_Electro.webp"),
  Cryo: require("../assets/element_icons/Element_Cryo.webp"),
  Dendro: require("../assets/element_icons/Element_Dendro.webp"),
  Anemo: require("../assets/element_icons/Element_Anemo.webp"),
  Geo: require("../assets/element_icons/Element_Geo.webp"),
};

// ─── Vector SVG Icons ─────────────────────────────────────────────────



// ─── Archetype Types & Data ───────────────────────────────────────────
type WeaponType = "All" | "Sword" | "Claymore" | "Polearm" | "Catalyst" | "Bow";

interface ArchetypeOption {
  key: WeaponType;
  label: string;
}

const ARCHETYPES: ArchetypeOption[] = [
  { key: "All", label: "Tất Cả" },
  { key: "Sword", label: "Đơn Kiếm" },
  { key: "Claymore", label: "Đại Kiếm" },
  { key: "Polearm", label: "Vũ Khí Cán Dài" },
  { key: "Catalyst", label: "Pháp Khí" },
  { key: "Bow", label: "Cung" },
];

// ─── Weapon Interface & Mock Data ─────────────────────────────────────
export interface WeaponItem {
  id: number;
  name: string;
  englishName: string;
  archetypeText: string;
  weaponType: WeaponType;
  rarity: 3 | 4 | 5;
  defaultRefinement: "R1" | "R2" | "R3" | "R4" | "R5";
  accentGradient: [string, string, string];
  glowColor: string;
  imageUrl: string;
  statsByLevel: {
    1: { atk: number; subValue: string };
    70: { atk: number; subValue: string };
    90: { atk: number; subValue: string };
  };
  atkTag?: string;
  subType: string;
  passiveName: string;
  passiveRefinements: Record<string, string>;
  compatibleCharacters: Array<{ name: string; element: string }>;
  lore: string;
}

const INITIAL_WEAPONS: WeaponItem[] = [
  {
    id: 0,
    name: "N/a",
    englishName: "N/a",
    archetypeText: "N/a",
    weaponType: "All",
    rarity: 5,
    defaultRefinement: "R1",
    accentGradient: ["N/a", "N/a", "N/a"],
    glowColor: "N/a",
    imageUrl: "N/a",

    statsByLevel: {
      1: { atk: 0, subValue: "N/a" },
      70: { atk: 0, subValue: "N/a" },
      90: { atk: 0, subValue: "N/a" },
    },

    atkTag: "N/a",
    subType: "N/a",
    passiveName: "N/a",

    passiveRefinements: {
      R1: "N/a",
      R2: "N/a",
      R3: "N/a",
      R4: "N/a",
      R5: "N/a",
    },

    compatibleCharacters: [
      { name: "N/a", element: "N/a" },
    ],

    lore: "N/a",
  },
];

// ─── Main Weapons Component ───────────────────────────────────────────
export default function Weapons() {
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList>(null);

  // States
  const [searchText, setSearchText] = useState("");
  const [selectedArchetype, setSelectedArchetype] = useState<WeaponType>("All");
  const [selectedRarity, setSelectedRarity] = useState<number | null>(null);
  const [previewLevel, setPreviewLevel] = useState<1 | 70 | 90>(90);
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [favorites, setFavorites] = useState<Record<number, boolean>>({ 11509: true, 13501: true });

  // Modal State
  const [activeWeaponDetail, setActiveWeaponDetail] = useState<WeaponItem | null>(null);
  const [modalRefinement, setModalRefinement] = useState<string>("R1");

  // Toggle favorite
  const toggleFavorite = (id: number) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Open detail modal
  const openDetail = (weapon: WeaponItem) => {
    setActiveWeaponDetail(weapon);
    setModalRefinement(weapon.defaultRefinement);
  };

  // Filter & Sort Logic
  const filteredWeapons = useMemo(() => {
    return INITIAL_WEAPONS.filter((item) => {
      // Search
      const matchSearch =
        !searchText.trim() ||
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.englishName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.passiveName.toLowerCase().includes(searchText.toLowerCase()) ||
        Object.values(item.passiveRefinements).some((desc) =>
          desc.toLowerCase().includes(searchText.toLowerCase())
        );

      // Archetype
      const matchArchetype =
        selectedArchetype === "All" || item.weaponType === selectedArchetype;

      // Rarity
      const matchRarity = selectedRarity === null || item.rarity === selectedRarity;

      return matchSearch && matchArchetype && matchRarity;
    }).sort((a, b) => {
      const atkA = a.statsByLevel[previewLevel].atk;
      const atkB = b.statsByLevel[previewLevel].atk;
      return sortOrder === "desc" ? atkB - atkA : atkA - atkB;
    });
  }, [searchText, selectedArchetype, selectedRarity, previewLevel, sortOrder]);

  // Scroll to top handler
  const scrollToTop = () => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  // Render Header & Controls Deck
  const renderHeader = () => (
    <View style={styles.headerDeck}>
      {/* Search Input Container */}
      <View style={styles.searchContainer}>
        <SvgSearch size={18} color={COLORS.primary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm tên vũ khí, hiệu ứng nội tại..."
          placeholderTextColor={COLORS.outline}
          value={searchText}
          onChangeText={setSearchText}
          selectionColor={COLORS.primary}
        />
        {searchText.length > 0 ? 
          <Pressable onPress={() => setSearchText("")} hitSlop={10} style={styles.searchActionBtn}>
            <SvgClose size={16} color={COLORS.onSurfaceVariant} />
          </Pressable>
          :
          <Pressable onPress={() => {}} hitSlop={10} style={styles.searchActionBtn}>
            <SvgMic size={16} color={COLORS.onSurfaceVariant} />
          </Pressable>
        }
         
        
      </View>

      {/* Archetype Filter Horizontal Carousel */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.archetypeScroll}
      >
        {ARCHETYPES.map((arch) => {
          const isActive = selectedArchetype === arch.key;
          return (
            <Pressable
              key={arch.key}
              onPress={() => setSelectedArchetype(arch.key)}
              style={[
                styles.archetypeChip,
                isActive ? styles.archetypeChipActive : styles.archetypeChipInactive,
              ]}
            >
              {arch.key === "All" ? (
                <SvgSparkle size={14} color={isActive ? COLORS.onPrimaryContainer : COLORS.onSurfaceVariant} />
              ) : (
                <SvgSwords size={14} color={isActive ? COLORS.onPrimaryContainer : COLORS.onSurfaceVariant} />
              )}
              <Text
                style={[
                  styles.archetypeText,
                  isActive ? styles.archetypeTextActive : styles.archetypeTextInactive,
                ]}
              >
                {arch.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Star Rarity Pills & Sorter */}
      <View style={styles.raritySorterRow}>
        <View style={styles.rarityGroup}>
          {[5, 4, 3].map((star) => {
            const isSelected = selectedRarity === star;
            const starColor =
              star === 5 ? COLORS.primary : star === 4 ? COLORS.secondary : COLORS.tertiary;
            return (
              <Pressable
                key={star}
                onPress={() => setSelectedRarity(isSelected ? null : star)}
                style={[
                  styles.rarityPill,
                  {
                    backgroundColor: isSelected ? `${starColor}33` : `${starColor}15`,
                    borderColor: isSelected ? starColor : "transparent",
                  },
                ]}
              >
                <SvgStar size={12} color={starColor} filled />
                <Text style={[styles.rarityText, { color: starColor }]}>{star} SAO</Text>
              </Pressable>
            );
          })}
        </View>

        {/* Sort Button */}
        <Pressable
          onPress={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
          style={styles.sorterBtn}
        >
          <Text style={styles.sorterText}>ATK {sortOrder === "desc" ? "↓" : "↑"}</Text>
          <SvgSort size={14} color={COLORS.onSurfaceVariant} />
        </Pressable>
      </View>

      {/* Global Level Preview Stepper Bar */}
      <View style={styles.stepperContainer}>
        <View style={styles.stepperLabelRow}>
          <SvgSparkle size={14} color={COLORS.primary} />
          <Text style={styles.stepperLabel}>XEM THỬ CẤP ĐỘ:</Text>
        </View>
        <View style={styles.stepperButtons}>
          {[1, 90].map((lvl) => {
            const isActive = previewLevel === lvl;
            return (
              <Pressable
                key={lvl}
                onPress={() => setPreviewLevel(lvl as 1 | 70 | 90)}
                style={[styles.lvlBtn, isActive && styles.lvlBtnActive]}
              >
                <Text style={[styles.lvlBtnText, isActive && styles.lvlBtnTextActive]}>
                  Lv.{lvl}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );

  // Render a Single Weapon Card
  const renderWeaponCard = ({ item }: { item: WeaponItem }) => {
    const isFav = favorites[item.id] || false;
    const currentStats = item.statsByLevel[previewLevel];
    const isFiveStar = item.rarity === 5;
    const isFourStar = item.rarity === 4;
    const rarityColor = isFiveStar ? COLORS.primary : isFourStar ? COLORS.secondary : COLORS.tertiary;

    return (
      <View style={styles.cardWrapper}>
        {/* Top Gilded Accent Strip */}
        <LinearGradient
          colors={item.accentGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.accentStrip}
        />

        {/* Header Ribbon: Name & Archetype */}
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderInfo}>
            <View style={styles.rarityStarRow}>
              <View
                style={[
                  styles.rarityBadge,
                  { backgroundColor: `${rarityColor}25` },
                ]}
              >
                <Text style={[styles.rarityBadgeText, { color: rarityColor }]}>
                  {item.rarity} SAO
                </Text>
              </View>
              <View style={styles.starsCluster}>
                {Array.from({ length: item.rarity }).map((_, i) => (
                  <SvgStar key={i} size={11} color={rarityColor} filled />
                ))}
              </View>
            </View>

            <Text style={styles.weaponName} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.weaponSubtitle} numberOfLines={1}>
              {item.archetypeText}
            </Text>
          </View>

          {/* Refinement & Favorite Action */}
          <View style={styles.cardActions}>
            <View style={styles.refinementBadge}>
              <Text style={styles.refinementText}>{item.defaultRefinement}</Text>
            </View>
            <Pressable
              onPress={() => toggleFavorite(item.id)}
              style={styles.favBtn}
              hitSlop={8}
            >
              <SvgHeart size={16} filled={isFav} color={isFav ? COLORS.primary : COLORS.onSurfaceVariant} />
            </Pressable>
          </View>
        </View>

        {/* Showcase Banner Area */}
        <View style={styles.showcaseBanner}>
          {/* Ambient Rarity Glow */}
          <View
            style={[
              styles.ambientGlow,
              { backgroundColor: item.glowColor },
            ]}
          />

          {/* Stats Overview on Left */}
          <View style={styles.statsColumn}>
            <View style={styles.levelTag}>
              <Text style={styles.levelTagText}>
                Lv. {previewLevel}/90 {previewLevel === 90 ? "(Đột Phá 6)" : previewLevel === 70 ? "(Đột Phá 4)" : "(Cơ Bản)"}
              </Text>
            </View>

            <View style={styles.statItem}>
              <Text style={styles.statLabel}>TẤN CÔNG CƠ BẢN</Text>
              <View style={styles.statValueRow}>
                <Text style={styles.statNumberLarge}>{currentStats.atk}</Text>
                {item.atkTag && <Text style={styles.statBonusTag}>{item.atkTag}</Text>}
              </View>
            </View>

            <View style={styles.statItem}>
              <Text style={styles.statLabel}>THUỘC TÍNH PHỤ</Text>
              <View style={styles.statValueRow}>
                <Text
                  style={[
                    styles.statNumberSub,
                    { color: isFiveStar ? COLORS.secondary : COLORS.tertiary },
                  ]}
                >
                  {currentStats.subValue}
                </Text>
                <Text style={styles.statSubName}>{item.subType}</Text>
              </View>
            </View>
          </View>

          {/* Realistic Artwork Representation */}
          <View style={styles.artworkContainer}>
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.weaponImage}
              contentFit="contain"
              transition={300}
            />
          </View>
        </View>

        {/* Passive Skill Container */}
        <View style={styles.passiveContainer}>
          <View style={styles.passiveHeader}>
            <View style={styles.passiveTitleRow}>
              <SvgSparkle size={15} color={rarityColor} />
              <Text style={[styles.passiveTitle, { color: rarityColor }]}>
                Nội Tại: {item.passiveName}
              </Text>
            </View>
            <Text style={styles.passiveTier}>
              Tầng Tinh Luyện {item.defaultRefinement.replace("R", "")}
            </Text>
          </View>

          <Text style={styles.passiveDescription}>
            {item.passiveRefinements[item.defaultRefinement]}
          </Text>

          {/* Compatible Characters Chips */}
          <View style={styles.affinityBlock}>
            <Text style={styles.affinityLabel}>NHÂN VẬT TƯƠNG THÍCH HÀNG ĐẦU</Text>
            <View style={styles.affinityChipsRow}>
              {item.compatibleCharacters.map((char) => (
                <View key={char.name} style={styles.affinityChip}>
                  {ELEMENT_ICONS[char.element] && (
                    <Image
                      source={ELEMENT_ICONS[char.element]}
                      style={styles.affinityElementIcon}
                    />
                  )}
                  <Text style={styles.affinityCharName}>{char.name}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Action Buttons Row */}
        <View style={styles.cardFooterActions}>
          <Pressable
            style={styles.detailCtaBtn}
            onPress={() => openDetail(item)}
          >
            <LinearGradient
              colors={isFourStar ? [COLORS.secondary, COLORS.secondaryContainer] : [COLORS.primary, COLORS.primaryContainer]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.detailCtaGradient}
            >
              <SvgUpgrade size={16} color={isFourStar ? "#ffffff" : COLORS.onPrimary} />
              <Text style={[styles.detailCtaText, { color: isFourStar ? "#ffffff" : COLORS.onPrimary }]}>
                Xem Chi Tiết & Đột Phá
              </Text>
            </LinearGradient>
          </Pressable>

          <Pressable
            style={styles.compareBtn}
            onPress={() => openDetail(item)}
            hitSlop={8}
          >
            <SvgCompare size={18} color={COLORS.onSurfaceVariant} />
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.surface} />

      {/* Sticky App Header */}
      <View style={styles.topHeader}>
        <View style={styles.topHeaderLeft}>
          <SvgSparkle size={20} color={COLORS.primary} />
          <View style={styles.headerTitleCol}>
            <Text style={styles.headerMainTitle}>Weapons</Text>
            <Text style={styles.headerSubTitle}>VŨ KHÍ</Text>
          </View>
        </View>

        <View style={styles.topHeaderRight}>
          <View style={styles.countBadge}>
            <SvgSwords size={13} color={COLORS.primary} />
            <Text style={styles.countText}>{filteredWeapons.length}</Text>
          </View>
        </View>
      </View>

      {/* Main Content FlatList */}
      <FlatList
        ref={listRef}
        data={filteredWeapons}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderWeaponCard}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 80 },
        ]}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <View style={styles.footerRow}>
            <Text style={styles.footerCount}>
              Đang hiển thị {filteredWeapons.length} / {INITIAL_WEAPONS.length} vũ khí
            </Text>
            <Pressable style={styles.scrollTopBtn} onPress={scrollToTop}>
              <Text style={styles.scrollTopText}>Lên Đầu Trang</Text>
              <SvgArrowUp size={13} color={COLORS.primary} />
            </Pressable>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <SvgSwords size={48} color={COLORS.outline} />
            <Text style={styles.emptyTitle}>Không tìm thấy vũ khí phù hợp</Text>
            <Text style={styles.emptySub}>Thử thay đổi từ khoá hoặc bỏ chọn các bộ lọc phía trên.</Text>
          </View>
        }
      />

      {/* Modal Xem Chi Tiết & Đột Phá */}
      <Modal
        visible={activeWeaponDetail !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setActiveWeaponDetail(null)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setActiveWeaponDetail(null)}
          />
          {activeWeaponDetail && (
            <View style={[styles.modalSheet, { paddingBottom: insets.bottom + 16 }]}>
              {/* Modal Drag Handle */}
              <View style={styles.modalHandle} />

              <View style={styles.modalHeaderRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.modalWeaponName}>
                    {activeWeaponDetail.name}
                  </Text>
                  <Text style={styles.modalWeaponEn}>
                    {activeWeaponDetail.englishName} • {activeWeaponDetail.rarity} SAO
                  </Text>
                </View>
                <Pressable
                  style={styles.modalCloseBtn}
                  onPress={() => setActiveWeaponDetail(null)}
                  hitSlop={10}
                >
                  <SvgClose size={20} color={COLORS.onSurfaceVariant} />
                </Pressable>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 420 }}>
                {/* Visual Image & Stats in Modal */}
                <View style={styles.modalShowcase}>
                  <Image
                    source={{ uri: activeWeaponDetail.imageUrl }}
                    style={styles.modalImage}
                    contentFit="contain"
                  />
                  <View style={styles.modalStatsRight}>
                    <Text style={styles.modalStatLabel}>TẤN CÔNG CƠ BẢN (Lv.{previewLevel})</Text>
                    <Text style={styles.modalStatNumber}>
                      {activeWeaponDetail.statsByLevel[previewLevel].atk}
                    </Text>

                    <Text style={[styles.modalStatLabel, { marginTop: 8 }]}>THUỘC TÍNH PHỤ</Text>
                    <Text style={styles.modalStatSubNumber}>
                      {activeWeaponDetail.statsByLevel[previewLevel].subValue}
                    </Text>
                    <Text style={styles.modalStatSubTitle}>
                      {activeWeaponDetail.subType}
                    </Text>
                  </View>
                </View>

                {/* Refinement Stepper (R1 - R5) */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>CẤP ĐỘ TINH LUYỆN</Text>
                  <View style={styles.modalRefineRow}>
                    {(["R1", "R2", "R3", "R4", "R5"] as const).map((r) => {
                      const isActive = modalRefinement === r;
                      return (
                        <Pressable
                          key={r}
                          onPress={() => setModalRefinement(r)}
                          style={[
                            styles.modalRefineChip,
                            isActive && styles.modalRefineChipActive,
                          ]}
                        >
                          <Text
                            style={[
                              styles.modalRefineText,
                              isActive && styles.modalRefineTextActive,
                            ]}
                          >
                            {r}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                  <Text style={styles.modalPassiveDesc}>
                    {activeWeaponDetail.passiveRefinements[modalRefinement] ||
                      activeWeaponDetail.passiveRefinements.R1}
                  </Text>
                </View>

                {/* Lore Section */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>CÂU CHUYỆN VŨ KHÍ</Text>
                  <Text style={styles.modalLoreText}>{activeWeaponDetail.lore}</Text>
                </View>
              </ScrollView>
            </View>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ─── Stylesheet ───────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },

  // ── Header ──────────────────────────────────────────────────────────
  topHeader: {
    height: 56,
    paddingHorizontal: HORIZONTAL_MARGIN,
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
    justifyContent: "center",
    alignItems: "flex-start",
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
    marginLeft: 2,
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
    paddingHorizontal: HORIZONTAL_MARGIN,
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

  // Archetype Carousel
  archetypeScroll: {
    gap: 8,
    paddingVertical: 2,
  },
  archetypeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  archetypeChipActive: {
    backgroundColor: COLORS.primaryContainer,
    borderColor: COLORS.primary,
  },
  archetypeChipInactive: {
    backgroundColor: COLORS.surfaceContainer,
    borderColor: "rgba(255, 255, 255, 0.06)",
  },
  archetypeText: {
    fontFamily: "montserrat-semi-bold",
    fontSize: scale(11),
    letterSpacing: 0.5,
  },
  archetypeTextActive: {
    color: COLORS.onPrimaryContainer,
    fontWeight: "bold",
  },
  archetypeTextInactive: {
    color: COLORS.onSurfaceVariant,
  },

  // Rarity & Sorter
  raritySorterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rarityGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  rarityPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  rarityText: {
    fontFamily: "montserrat-semi-bold",
    fontSize: scale(10),
    fontWeight: "bold",
    letterSpacing: 0.8,
  },
  sorterBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: COLORS.surfaceHigh,
  },
  sorterText: {
    fontFamily: "montserrat-semi-bold",
    fontSize: scale(10),
    color: COLORS.onSurfaceVariant,
  },

  // Level Stepper
  stepperContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.surfaceContainer,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  stepperLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  stepperLabel: {
    fontFamily: "montserrat-semi-bold",
    fontSize: scale(10),
    color: COLORS.onSurfaceVariant,
    letterSpacing: 0.8,
  },
  stepperButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  lvlBtn: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  lvlBtnActive: {
    backgroundColor: COLORS.primary,
  },
  lvlBtnText: {
    fontFamily: "montserrat-semi-bold",
    fontSize: scale(11),
    color: COLORS.onSurfaceVariant,
  },
  lvlBtnTextActive: {
    color: COLORS.onPrimary,
    fontWeight: "bold",
  },

  // ── List & Weapon Cards ─────────────────────────────────────────────
  listContent: {
    paddingTop: 4,
  },
  cardWrapper: {
    marginHorizontal: HORIZONTAL_MARGIN,
    marginTop: 12,
    borderRadius: 16,
    backgroundColor: COLORS.surfaceContainer,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.07)",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },
  accentStrip: {
    height: 5,
    width: "100%",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 8,
  },
  cardHeaderInfo: {
    flex: 1,
    paddingRight: 8,
  },
  rarityStarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  rarityBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  rarityBadgeText: {
    fontFamily: "montserrat-semi-bold",
    fontSize: scale(9),
    fontWeight: "bold",
  },
  starsCluster: {
    flexDirection: "row",
    alignItems: "center",
    gap: 1,
  },
  weaponName: {
    fontFamily: "genshin_font",
    fontSize: scale(16),
    color: COLORS.primary,
    letterSpacing: 0.3,
  },
  weaponSubtitle: {
    fontFamily: "montserrat",
    fontSize: scale(10),
    color: COLORS.onSurfaceVariant,
    marginTop: 2,
    textTransform: "uppercase",
  },
  cardActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  refinementBadge: {
    backgroundColor: COLORS.surfaceHighest,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  refinementText: {
    fontFamily: "montserrat-semi-bold",
    fontSize: scale(11),
    color: COLORS.primary,
    fontWeight: "bold",
  },
  favBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surfaceHigh,
    alignItems: "center",
    justifyContent: "center",
  },

  // Showcase Banner
  showcaseBanner: {
    position: "relative",
    height: 155,
    backgroundColor: COLORS.surfaceLow,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    overflow: "hidden",
  },
  ambientGlow: {
    position: "absolute",
    right: 15,
    top: "20%",
    width: 130,
    height: 130,
    borderRadius: 65,
    opacity: 0.6,
  },
  statsColumn: {
    flex: 1,
    zIndex: 2,
    gap: 8,
  },
  levelTag: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.surfaceHighest,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  levelTagText: {
    fontFamily: "montserrat-semi-bold",
    fontSize: scale(10),
    color: COLORS.primary,
  },
  statItem: {
    gap: 1,
  },
  statLabel: {
    fontFamily: "montserrat-semi-bold",
    fontSize: scale(9),
    color: COLORS.outline,
    letterSpacing: 0.5,
  },
  statValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
  },
  statNumberLarge: {
    fontFamily: "montserrat-semi-bold",
    fontSize: scale(20),
    color: COLORS.onSurface,
    fontWeight: "bold",
  },
  statBonusTag: {
    fontFamily: "montserrat-semi-bold",
    fontSize: scale(10),
    color: COLORS.primary,
    fontWeight: "bold",
  },
  statNumberSub: {
    fontFamily: "montserrat-semi-bold",
    fontSize: scale(13),
    fontWeight: "bold",
  },
  statSubName: {
    fontFamily: "montserrat",
    fontSize: scale(10),
    color: COLORS.onSurfaceVariant,
  },
  artworkContainer: {
    width: 135,
    height: 135,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  weaponImage: {
    width: "100%",
    height: "100%",
  },

  // Passive block
  passiveContainer: {
    padding: 14,
    backgroundColor: "rgba(36, 41, 58, 0.4)",
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.04)",
  },
  passiveHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  passiveTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  passiveTitle: {
    fontFamily: "genshin_font",
    fontSize: scale(13),
  },
  passiveTier: {
    fontFamily: "montserrat-semi-bold",
    fontSize: scale(10),
    color: COLORS.secondary,
    fontWeight: "bold",
  },
  passiveDescription: {
    fontFamily: "montserrat",
    fontSize: scale(11),
    color: COLORS.onSurfaceVariant,
    lineHeight: 18,
  },
  affinityBlock: {
    marginTop: 4,
    gap: 4,
  },
  affinityLabel: {
    fontFamily: "montserrat-semi-bold",
    fontSize: scale(9),
    color: COLORS.outline,
    letterSpacing: 0.5,
  },
  affinityChipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  affinityChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: COLORS.surfaceHighest,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  affinityElementIcon: {
    width: 14,
    height: 14,
  },
  affinityCharName: {
    fontFamily: "montserrat",
    fontSize: scale(10),
    color: COLORS.onSurface,
  },

  // Footer Actions
  cardFooterActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingBottom: 14,
    paddingTop: 8,
  },
  detailCtaBtn: {
    flex: 1,
    borderRadius: 10,
    overflow: "hidden",
  },
  detailCtaGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 9,
    paddingHorizontal: 12,
  },
  detailCtaText: {
    fontFamily: "genshin_font",
    fontSize: scale(12),
    fontWeight: "600",
  },
  compareBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: COLORS.surfaceHighest,
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Footer ──────────────────────────────────────────────────────────
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: HORIZONTAL_MARGIN,
    paddingTop: 20,
    paddingBottom: 10,
  },
  footerCount: {
    fontFamily: "montserrat",
    fontSize: scale(10),
    color: COLORS.outline,
    textTransform: "uppercase",
  },
  scrollTopBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  scrollTopText: {
    fontFamily: "montserrat-semi-bold",
    fontSize: scale(10),
    color: COLORS.primary,
  },

  // ── Empty State ─────────────────────────────────────────────────────
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
    paddingHorizontal: 30,
    gap: 12,
  },
  emptyTitle: {
    fontFamily: "genshin_font",
    fontSize: scale(15),
    color: COLORS.onSurface,
    textAlign: "center",
  },
  emptySub: {
    fontFamily: "montserrat",
    fontSize: scale(11),
    color: COLORS.outline,
    textAlign: "center",
    lineHeight: 18,
  },

  // ── Modal Sheet ─────────────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: "#161b2b",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 213, 141, 0.2)",
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  modalHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.outlineVariant,
    alignSelf: "center",
    marginBottom: 10,
  },
  modalHeaderRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  modalWeaponName: {
    fontFamily: "genshin_font",
    fontSize: scale(17),
    color: COLORS.primary,
  },
  modalWeaponEn: {
    fontFamily: "montserrat",
    fontSize: scale(11),
    color: COLORS.onSurfaceVariant,
    marginTop: 2,
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalShowcase: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    gap: 12,
  },
  modalImage: {
    width: 90,
    height: 90,
  },
  modalStatsRight: {
    flex: 1,
  },
  modalStatLabel: {
    fontFamily: "montserrat-semi-bold",
    fontSize: scale(9),
    color: COLORS.outline,
  },
  modalStatNumber: {
    fontFamily: "montserrat-semi-bold",
    fontSize: scale(18),
    color: COLORS.onSurface,
    fontWeight: "bold",
  },
  modalStatSubNumber: {
    fontFamily: "montserrat-semi-bold",
    fontSize: scale(14),
    color: COLORS.secondary,
    fontWeight: "bold",
  },
  modalStatSubTitle: {
    fontFamily: "montserrat",
    fontSize: scale(10),
    color: COLORS.onSurfaceVariant,
  },
  modalSection: {
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    gap: 8,
  },
  modalSectionTitle: {
    fontFamily: "montserrat-semi-bold",
    fontSize: scale(10),
    color: COLORS.primary,
    letterSpacing: 0.8,
  },
  modalRefineRow: {
    flexDirection: "row",
    gap: 8,
  },
  modalRefineChip: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: COLORS.surfaceHigh,
  },
  modalRefineChipActive: {
    backgroundColor: COLORS.primary,
  },
  modalRefineText: {
    fontFamily: "montserrat-semi-bold",
    fontSize: scale(11),
    color: COLORS.onSurfaceVariant,
  },
  modalRefineTextActive: {
    color: COLORS.onPrimary,
    fontWeight: "bold",
  },
  modalPassiveDesc: {
    fontFamily: "montserrat",
    fontSize: scale(11),
    color: COLORS.onSurface,
    lineHeight: 18,
  },
  modalLoreText: {
    fontFamily: "montserrat",
    fontSize: scale(11),
    color: COLORS.onSurfaceVariant,
    lineHeight: 18,
    fontStyle: "italic",
  },
});
