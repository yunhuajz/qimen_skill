/**
 * 九星数据
 * 天蓬、天任、天冲、天辅、天英、天芮、天柱、天心、天禽
 */

import { JiuXing, PalaceIndex, StarInfo } from '../types';

/** 九星基础信息 */
export const STARS: StarInfo[] = [
  { name: '天蓬', originalPosition: 1, wuxing: '水', yinyang: '阳' },
  { name: '天任', originalPosition: 8, wuxing: '土', yinyang: '阳' },
  { name: '天冲', originalPosition: 3, wuxing: '木', yinyang: '阳' },
  { name: '天辅', originalPosition: 4, wuxing: '木', yinyang: '阳' },
  { name: '天英', originalPosition: 9, wuxing: '火', yinyang: '阴' },
  { name: '天芮', originalPosition: 2, wuxing: '土', yinyang: '阴' },
  { name: '天柱', originalPosition: 7, wuxing: '金', yinyang: '阴' },
  { name: '天心', originalPosition: 6, wuxing: '金', yinyang: '阴' },
  { name: '天禽', originalPosition: 5, wuxing: '土', yinyang: '阳' },
];

/** 九星顺序（用于转盘排布） */
export const STAR_ORDER: JiuXing[] = [
  '天蓬', '天任', '天冲', '天辅', '天英', '天芮', '天柱', '天心', '天禽',
];

/** 九星原始宫位映射 */
export const STAR_ORIGINAL_POSITION: Record<JiuXing, PalaceIndex> = {
  '天蓬': 1, '天任': 8, '天冲': 3, '天辅': 4, '天英': 9,
  '天芮': 2, '天柱': 7, '天心': 6, '天禽': 5,
};

/** 宫位对应的九星（原始位置） */
export const POSITION_STAR: Record<PalaceIndex, JiuXing> = {
  1: '天蓬', 2: '天芮', 3: '天冲', 4: '天辅', 5: '天禽',
  6: '天心', 7: '天柱', 8: '天任', 9: '天英',
};

/** 根据星名获取信息 */
export function getStarInfo(name: JiuXing): StarInfo | undefined {
  return STARS.find(star => star.name === name);
}

/** 根据宫位获取原始星 */
export function getStarByPosition(position: PalaceIndex): JiuXing {
  return POSITION_STAR[position];
}

/** 获取星所在原始宫位 */
export function getStarPosition(name: JiuXing): PalaceIndex {
  return STAR_ORIGINAL_POSITION[name];
}
