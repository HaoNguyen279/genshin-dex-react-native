type WeaponMaterial = {
  id: number;
  name: string;
  count: number;
};

type WeaponRefinement = {
  description: string;
  values: string[];
};

type WeaponCosts = {
  ascend1: WeaponMaterial[];
  ascend2: WeaponMaterial[];
  ascend3: WeaponMaterial[];
  ascend4: WeaponMaterial[];
  ascend5: WeaponMaterial[];
  ascend6: WeaponMaterial[];
};

type WeaponImages = {
  filename_icon: string;
  filename_awakenIcon: string;
  filename_gacha: string;
  mihoyo_icon: string;
  mihoyo_awakenIcon: string;
};

type Weapon = {
  id: number;

  name: string;
  description: string;
  descriptionRaw: string;
  story: string;

  weaponType: string;
  weaponText: string;
  rarity: number;

  baseAtkValue: number;

  mainStatType: string;
  mainStatText: string;
  baseStatText: string;

  effectName: string;
  effectTemplateRaw: string;

  r1: WeaponRefinement;
  r2: WeaponRefinement;
  r3: WeaponRefinement;
  r4: WeaponRefinement;
  r5: WeaponRefinement;

  costs: WeaponCosts;

  images: WeaponImages;

  version: string;
};