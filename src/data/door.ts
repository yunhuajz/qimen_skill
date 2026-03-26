/**
 * 八门数据
 * 休门、生门、伤门、杜门、景门、死门、惊门、开门
 */

import { BaMen, PalaceIndex, DoorInfo } from '../types';

/** 八门基础信息 */
export const DOORS: DoorInfo[] = [
  { name: '休门', originalPosition: 1, wuxing: '水' },
  { name: '生门', originalPosition: 8, wuxing: '土' },
  { name: '伤门', originalPosition: 3, wuxing: '木' },
  { name: '杜门', originalPosition: 4, wuxing: '木' },
  { name: '景门', originalPosition: 9, wuxing: '火' },
  { name: '死门', originalPosition: 2, wuxing: '土' },
  { name: '惊门', originalPosition: 7, wuxing: '金' },
  { name: '开门', originalPosition: 6, wuxing: '金' },
];

/** 八门顺序（转盘顺时针） */
export const DOOR_ORDER_CLOCKWISE: BaMen[] = [
  '休门', '生门', '伤门', '杜门', '景门', '死门', '惊门', '开门',
];

/** 八门原始宫位映射 */
export const DOOR_ORIGINAL_POSITION: Record<BaMen, PalaceIndex> = {
  '休门': 1, '生门': 8, '伤门': 3, '杜门': 4,
  '景门': 9, '死门': 2, '惊门': 7, '开门': 6,
};

/** 宫位对应的八门（原始位置） */
export const POSITION_DOOR: Partial<Record<PalaceIndex, BaMen>> = {
  1: '休门', 2: '死门', 3: '伤门', 4: '杜门',
  6: '开门', 7: '惊门', 8: '生门', 9: '景门',
};

/** 八门五行克制宫位五行时为"门迫"（凶） */
export const DOOR_WUXING: Record<BaMen, string> = {
  '休门': '水', '生门': '土', '伤门': '木', '杜门': '木',
  '景门': '火', '死门': '土', '惊门': '金', '开门': '金',
};

/** 宫位五行 */
export const POSITION_WUXING: Record<PalaceIndex, string> = {
  1: '水',  // 坎
  2: '土',  // 坤
  3: '木',  // 震
  4: '木',  // 巽
  5: '土',  // 中
  6: '金',  // 乾
  7: '金',  // 兑
  8: '土',  // 艮
  9: '火',  // 离
};

/** 根据门名获取信息 */
export function getDoorInfo(name: BaMen): DoorInfo | undefined {
  return DOORS.find(door => door.name === name);
}

/** 根据宫位获取原始门 */
export function getDoorByPosition(position: PalaceIndex): BaMen | undefined {
  return POSITION_DOOR[position];
}

/** 获取门所在原始宫位 */
export function getDoorPosition(name: BaMen): PalaceIndex {
  return DOOR_ORIGINAL_POSITION[name];
}

/** 判断是否为门迫（门克宫） */
export function isDoorPo(door: BaMen, position: PalaceIndex): boolean {
  const doorWuxing = DOOR_WUXING[door];
  const posWuxing = POSITION_WUXING[position];

  // 五行相克：金克木，木克土，土克水，水克火，火克金
  const keRelations: Record<string, string> = {
    '金': '木', '木': '土', '土': '水', '水': '火', '火': '金',
  };

  return keRelations[doorWuxing] === posWuxing;
}
