/**
 * 节气与局数数据
 * 奇门遁甲18局：冬至至芒种为阳遁（9局），夏至至大雪为阴遁（9局）
 */

import { SolarTerm } from '../types';

/** 24节气数据，包含阴阳遁局数 */
export const SOLAR_TERMS: SolarTerm[] = [
  // 阳遁局（冬至到芒种）
  { name: '冬至', month: 12, day: 21, yangDun: [1, 7, 4], yinDun: [0, 0, 0] },
  { name: '小寒', month: 1, day: 5, yangDun: [2, 8, 5], yinDun: [0, 0, 0] },
  { name: '大寒', month: 1, day: 20, yangDun: [3, 9, 6], yinDun: [0, 0, 0] },
  { name: '立春', month: 2, day: 4, yangDun: [8, 5, 2], yinDun: [0, 0, 0] },
  { name: '雨水', month: 2, day: 19, yangDun: [9, 6, 3], yinDun: [0, 0, 0] },
  { name: '惊蛰', month: 3, day: 5, yangDun: [1, 7, 4], yinDun: [0, 0, 0] },
  { name: '春分', month: 3, day: 20, yangDun: [3, 9, 6], yinDun: [0, 0, 0] },
  { name: '清明', month: 4, day: 5, yangDun: [4, 1, 7], yinDun: [0, 0, 0] },
  { name: '谷雨', month: 4, day: 20, yangDun: [5, 2, 8], yinDun: [0, 0, 0] },
  { name: '立夏', month: 5, day: 5, yangDun: [4, 1, 7], yinDun: [0, 0, 0] },
  { name: '小满', month: 5, day: 21, yangDun: [5, 2, 8], yinDun: [0, 0, 0] },
  { name: '芒种', month: 6, day: 6, yangDun: [6, 3, 9], yinDun: [0, 0, 0] },

  // 阴遁局（夏至到大雪）
  { name: '夏至', month: 6, day: 21, yangDun: [0, 0, 0], yinDun: [9, 3, 6] },
  { name: '小暑', month: 7, day: 7, yangDun: [0, 0, 0], yinDun: [8, 2, 5] },
  { name: '大暑', month: 7, day: 22, yangDun: [0, 0, 0], yinDun: [7, 1, 4] },
  { name: '立秋', month: 8, day: 7, yangDun: [0, 0, 0], yinDun: [2, 5, 8] },
  { name: '处暑', month: 8, day: 23, yangDun: [0, 0, 0], yinDun: [1, 4, 7] },
  { name: '白露', month: 9, day: 7, yangDun: [0, 0, 0], yinDun: [9, 3, 6] },
  { name: '秋分', month: 9, day: 23, yangDun: [0, 0, 0], yinDun: [7, 1, 4] },
  { name: '寒露', month: 10, day: 8, yangDun: [0, 0, 0], yinDun: [6, 9, 3] },
  { name: '霜降', month: 10, day: 23, yangDun: [0, 0, 0], yinDun: [5, 8, 2] },
  { name: '立冬', month: 11, day: 7, yangDun: [0, 0, 0], yinDun: [6, 9, 3] },
  { name: '小雪', month: 11, day: 22, yangDun: [0, 0, 0], yinDun: [5, 8, 2] },
  { name: '大雪', month: 12, day: 7, yangDun: [0, 0, 0], yinDun: [4, 7, 1] },
];

/** 节气顺序（用于计算） */
export const SOLAR_TERM_ORDER = [
  '冬至', '小寒', '大寒', '立春', '雨水', '惊蛰',
  '春分', '清明', '谷雨', '立夏', '小满', '芒种',
  '夏至', '小暑', '大暑', '立秋', '处暑', '白露',
  '秋分', '寒露', '霜降', '立冬', '小雪', '大雪',
];

/** 获取节气信息 */
export function getSolarTermInfo(name: string): SolarTerm | undefined {
  return SOLAR_TERMS.find(term => term.name === name);
}

/** 获取下一个节气 */
export function getNextSolarTerm(currentTerm: string): string {
  const index = SOLAR_TERM_ORDER.indexOf(currentTerm);
  if (index === -1) return SOLAR_TERM_ORDER[0];
  return SOLAR_TERM_ORDER[(index + 1) % SOLAR_TERM_ORDER.length];
}

/** 判断是阳遁还是阴遁 */
export function getYinYangDun(termName: string): '阳遁' | '阴遁' {
  const term = getSolarTermInfo(termName);
  if (!term) throw new Error(`未知节气: ${termName}`);

  // 检查阳遁局数
  if (term.yangDun[0] > 0) return '阳遁';
  return '阴遁';
}

/** 根据节气和元数获取局数 */
export function getJuShu(termName: string, yuan: number): number {
  const term = getSolarTermInfo(termName);
  if (!term) throw new Error(`未知节气: ${termName}`);

  const index = yuan - 1; // 上元=0, 中元=1, 下元=2
  const dun = getYinYangDun(termName);

  if (dun === '阳遁') {
    return term.yangDun[index];
  } else {
    return term.yinDun[index];
  }
}
