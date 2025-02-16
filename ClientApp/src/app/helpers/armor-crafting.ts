export class ArmorResult {
  constructor(
    public id: number,
    public weight: number,
    public surfaceArea: number,
    public constructionType: ConstructionType,
    public timeToEquip: number,
    public damageResistnce: number,
    public materialCost: number,
    public armorCost: number,
    public workTimeInDays: number,
    public bodyParts: BodyPart[],
  ){}
}

export class BodyPart {
  constructor(
    public name: string,
    public areaCoverage: number,
    public isSelected: boolean
  ) { }
}

export class ConstructionType {
  constructor(
    public name: string,
    public tl: number,
    public weightMultiplier: number,
    public costMultiplier: number,
    public timeToEquipPerSquareFoot: number,
    public minDr: number,
    public special: string
  ){
  }
}

export class CT {
  static Fabric = new ConstructionType('Fabric', 0, 1, 1, 2.14, 1, '-1 DR vs. impaling.')
  static LayeredFabric = new ConstructionType('Layered Fabric', 0, 1.2, 1, 4.28, 2, '')
  static Scales = new ConstructionType('Scales', 1, 1.1, 0.8, 4.28, 2, '-1 DR vs. crushing unless armor is DR 5+')
  static Mail = new ConstructionType('Mail', 2, 0.9, 1.2, 2.14, 2, '-2 DR vs. crushing. If mail has DR 10 or more, it has -20% DR vs. crushing damage instead of subtracting 2')
  static SegmentedPlate = new ConstructionType('Segmented Plate', 2, 1.45, 1.5, 6.42, 3, '')
  static Plate = new ConstructionType('Plate', 1, 0.8, 5, 6.42, 3, 'If made of iron or steel it is TL4 when used for any location except the head.')
  static Solid = new ConstructionType('Solid', 1, 1, 1, 2, 0, 'If made of iron or steel it is TL4 when used for any location except the head.')
}

export class ArmorMaterial {
  constructor(
    public name: string,
    public tl: number,
    public weightModifier: number,
    public workUnitCost: number,
    public materialUnitCost: number,
    public drPerInch: number,
    public drMax: number,
    public special: string,
    public constructionTypes: ConstructionType[]
  ) { }
}

export const AvailibleMaterials = [
  new ArmorMaterial('Bone', 0, 1, 12.5, 3.55, 8, 4, 's', [CT.Scales, CT.Solid]),
  new ArmorMaterial('Horn', 0, 1, 12.5, 3.55, 8, 4, '-', [CT.Scales, CT.Solid]),
  new ArmorMaterial('Cloth', 0, 0.85, 8, 1.15, 4, 4, 'CF', [CT.Fabric, CT.LayeredFabric]),
  new ArmorMaterial('Leather', 0, 0.9, 10, 3, 8, 4, 'CF', [CT.Fabric, CT.LayeredFabric, CT.Scales]),
  new ArmorMaterial('Wood', 0, 1.4, 3, 0.25, 1.5, 2, 'CS', [CT.Scales, CT.Solid]),
  new ArmorMaterial('Bronze, cheap', 1, 0.9, 60, 60, 48, 9, '', [CT.Mail, CT.Plate, CT.Scales, CT.Solid]),
  new ArmorMaterial('Bronze, good', 1, 0.6, 100, 62.5, 68, 14, '', [CT.Mail, CT.Plate, CT.Scales, CT.Solid]),
  new ArmorMaterial('Copper', 1, 1.6, 80, 62.5, 30, 5, '', [CT.Mail, CT.Plate, CT.Scales, CT.Solid]),
  new ArmorMaterial('Stone', 1, 1.2, 12.5, 0.25, 13, 5, 'S', [CT.Scales, CT.Solid]),
  new ArmorMaterial('Iron, cheap', 2, 0.8, 15, 15, 52, 10, '-', [CT.Mail, CT.Plate, CT.Scales, CT.Solid]),
  new ArmorMaterial('Iron, good', 2, 0.6, 25, 6.90, 68, 14, '-', [CT.Mail, CT.Plate, CT.Scales, CT.Solid]),
  new ArmorMaterial('Lead', 2, 2, 12.5, 4.30, 30, 4, '-', [CT.Plate, CT.Scales, CT.Solid]),
  new ArmorMaterial('Steel, strong', 3, 0.58, 50, 50, 70, 14, '-', [CT.Mail, CT.Plate, CT.Scales, CT.Solid]),
  new ArmorMaterial('Steel, hard', 4, 0.5, 250, 250, 81, 16, '-', [CT.Mail, CT.Plate, CT.Scales, CT.Solid]),
  new ArmorMaterial('Adamant', 0, 0.33, 900, 22.5, 27, 15, 'S', [CT.Scales, CT.Solid]),
  new ArmorMaterial('Orichalcum', 0, 0.2, 3000, 1875, 204, 41, '-', [CT.Mail, CT.Plate, CT.Scales, CT.Solid])
]

export const HumanBodyParts = [
  new BodyPart('foot_right_front', 0.35, true),
  new BodyPart('foot_left_front', 0.35, true),
  new BodyPart('shin_right_front', 1.75, true),
  new BodyPart('shin_left_front', 1.75, true),
  new BodyPart('knee_right_front', 0.175, true),
  new BodyPart('knee_left_front', 0.175, true),
  new BodyPart('thigh_right_front', 1.575, true),
  new BodyPart('thigh_left_front', 1.575, true),
  new BodyPart('hand_right_front', 0.35, true),
  new BodyPart('hand_left_front', 0.35, true),
  new BodyPart('forearm_right_front', 0.875, true),
  new BodyPart('forearm_left_front', 0.875, true),
  new BodyPart('elbow_right_front', 0.175, true),
  new BodyPart('elbow_left_front', 0.175, true),
  new BodyPart('upperArm_right_front', 0.35, true),
  new BodyPart('upperArm_left_front', 0.35, true),
  new BodyPart('shoulder_right_front', 0.35, true),
  new BodyPart('shoulder_left_front', 0.35, true),
  new BodyPart('groin', 0.35, true),
  new BodyPart('abdomen_front', 1.4, true),
  new BodyPart('chest_front', 5.25, true),
  new BodyPart('neck_front', 0.35, true),
  new BodyPart('face', 0.7, true),
  new BodyPart('eyes', 1, false),
  new BodyPart('skull', 1.4, true)
];


export const HumanBodyPartsFront = [
  new BodyPart('foot_right_front', 0.175, true),
  new BodyPart('foot_left_front', 0.175, true),
  new BodyPart('shin_right_front', 0.875, true),
  new BodyPart('shin_left_front', 0.875, true),
  new BodyPart('knee_right_front', 0.0875, true),
  new BodyPart('knee_left_front', 0.0875, true),
  new BodyPart('thigh_right_front', 0.7875, true),
  new BodyPart('thigh_left_front', 0.7875, true),
  new BodyPart('hand_right_front', 0.175, true),
  new BodyPart('hand_left_front', 0.175, true),
  new BodyPart('forearm_right_front', 0.4375, true),
  new BodyPart('forearm_left_front', 0.4375, true),
  new BodyPart('elbow_right_front', 0.0875, true),
  new BodyPart('elbow_left_front', 0.0875, true),
  new BodyPart('upperArm_right_front', 0.175, true),
  new BodyPart('upperArm_left_front', 0.175, true),
  new BodyPart('shoulder_right_front', 0.175, true),
  new BodyPart('shoulder_left_front', 0.175, true),
  new BodyPart('groin', 0.35, true),
  new BodyPart('abdomen_front', 0.525, true),
  new BodyPart('chest_front', 2.625, true),
  new BodyPart('neck_front', 0.175, true),
  new BodyPart('face', 0.35, true),
  new BodyPart('eyes', 1, false),
  new BodyPart('skull', 0.7, true)
];

export const HumanBodyPartsBack = [
  new BodyPart('foot_right_back', 0.175, true),
  new BodyPart('foot_left_back', 0.175, true),
  new BodyPart('shin_right_back', 0.875, true),
  new BodyPart('shin_left_back', 0.875, true),
  new BodyPart('knee_right_back', 0.0875, true),
  new BodyPart('knee_left_back', 0.0875, true),
  new BodyPart('thigh_right_back', 0.7875, true),
  new BodyPart('thigh_left_back', 0.7875, true),
  new BodyPart('hand_right_back', 0.175, true),
  new BodyPart('hand_left_back', 0.175, true),
  new BodyPart('forearm_right_back', 0.4375, true),
  new BodyPart('forearm_left_back', 0.4375, true),
  new BodyPart('elbow_right_back', 0.0875, true),
  new BodyPart('elbow_left_back', 0.0875, true),
  new BodyPart('upperArm_right_back', 0.175, true),
  new BodyPart('upperArm_left_back', 0.175, true),
  new BodyPart('shoulder_right_back', 0.175, true),
  new BodyPart('shoulder_left_back', 0.175, true),
  new BodyPart('abdomen_back', 0.875, true),
  new BodyPart('chest_back', 2.625, true),
  new BodyPart('neck_back', 0.175, true),
  new BodyPart('head_back', 1.05, true)
];
