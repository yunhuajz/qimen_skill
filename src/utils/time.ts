/**
 * 时间转换工具
 * 复用 bazi-skill 的逻辑，实现公历转干支、节气计算等
 */

import { InputTime, TianGan, DiZhi } from '../types';

/** 天干索引 */
const GAN_INDEX: Record<string, number> = {
  '甲': 0, '乙': 1, '丙': 2, '丁': 3, '戊': 4,
  '己': 5, '庚': 6, '辛': 7, '壬': 8, '癸': 9,
};

/** 地支索引 */
const ZHI_INDEX: Record<string, number> = {
  '子': 0, '丑': 1, '寅': 2, '卯': 3, '辰': 4, '巳': 5,
  '午': 6, '未': 7, '申': 8, '酉': 9, '戌': 10, '亥': 11,
};

/** 天干数组 */
const TIAN_GAN: TianGan[] = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

/** 地支数组 */
const DI_ZHI: DiZhi[] = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

/**
 * 计算年干支
 * 以立春为界
 */
export function getYearGanZhi(year: number, month: number, day: number): string {
  // 简化计算：假设立春在2月4日左右
  const adjustedYear = (month < 2 || (month === 2 && day < 4)) ? year - 1 : year;

  // 1984年是甲子年
  const ganIndex = (adjustedYear - 4) % 10;
  const zhiIndex = (adjustedYear - 4) % 12;

  return TIAN_GAN[ganIndex] + DI_ZHI[zhiIndex];
}

/**
 * 计算月干支
 * 甲己之年丙作首，乙庚之岁戊为头
 * 丙辛之岁寻庚起，丁壬壬位顺行流
 * 戊癸何方发，甲寅之上好追求
 */
export function getMonthGanZhi(yearGan: string, month: number, day: number): string {
  // 调整为节气月
  // 寅月（立春）为正月，约2月4日
  let zhiIndex = (month + 1) % 12; // 正月建寅
  if (month === 2 && day < 4) zhiIndex = 11; // 立春前还是丑月

  let ganIndex: number;
  switch (yearGan) {
    case '甲': case '己': ganIndex = 2; break; // 丙
    case '乙': case '庚': ganIndex = 4; break; // 戊
    case '丙': case '辛': ganIndex = 6; break; // 庚
    case '丁': case '壬': ganIndex = 8; break; // 壬
    case '戊': case '癸': ganIndex = 0; break; // 甲
    default: ganIndex = 0;
  }

  // 从寅月开始
  ganIndex = (ganIndex + zhiIndex - 2 + 12) % 10;
  zhiIndex = (zhiIndex + 12) % 12;

  return TIAN_GAN[ganIndex] + DI_ZHI[zhiIndex];
}

/**
 * 计算日干支
 * 基于1900年1月31日是甲子的基准
 */
export function getDayGanZhi(year: number, month: number, day: number): string {
  const baseDate = new Date(1900, 0, 31); // 1900年1月31日
  const targetDate = new Date(year, month - 1, day);
  const diffDays = Math.floor((targetDate.getTime() - baseDate.getTime()) / (24 * 60 * 60 * 1000));

  const ganIndex = (diffDays % 10 + 10) % 10;
  const zhiIndex = (diffDays % 12 + 12) % 12;

  return TIAN_GAN[ganIndex] + DI_ZHI[zhiIndex];
}

/**
 * 计算时干支
 * 甲己还加甲，乙庚丙作初
 * 丙辛从戊起，丁壬庚子居
 * 戊癸何方发，壬子是真途
 */
export function getHourGanZhi(dayGan: string, hour: number): string {
  // 时辰地支
  const zhiIndex = Math.floor((hour + 1) / 2) % 12;

  // 时辰天干
  let ganIndex: number;
  switch (dayGan) {
    case '甲': case '己': ganIndex = 0; break; // 甲
    case '乙': case '庚': ganIndex = 2; break; // 丙
    case '丙': case '辛': ganIndex = 4; break; // 戊
    case '丁': case '壬': ganIndex = 6; break; // 庚
    case '戊': case '癸': ganIndex = 8; break; // 壬
    default: ganIndex = 0;
  }

  ganIndex = (ganIndex + zhiIndex) % 10;

  return TIAN_GAN[ganIndex] + DI_ZHI[zhiIndex];
}

/**
 * 获取完整的四柱干支
 */
export function getSiZhu(time: InputTime): {
  year: string;
  month: string;
  day: string;
  hour: string;
} {
  const yearGanZhi = getYearGanZhi(time.year, time.month, time.day);
  const monthGanZhi = getMonthGanZhi(yearGanZhi[0], time.month, time.day);
  const dayGanZhi = getDayGanZhi(time.year, time.month, time.day);
  const hourGanZhi = getHourGanZhi(dayGanZhi[0], time.hour);

  return {
    year: yearGanZhi,
    month: monthGanZhi,
    day: dayGanZhi,
    hour: hourGanZhi,
  };
}

/**
 * 根据公历日期计算当前节气
 * 简化版：使用固定日期估算
 */
export function getCurrentSolarTerm(year: number, month: number, day: number): string {
  // 24节气在公历中的大致日期
  const termDates: Record<string, [number, number]> = {
    '小寒': [1, 5], '大寒': [1, 20], '立春': [2, 4], '雨水': [2, 19],
    '惊蛰': [3, 5], '春分': [3, 20], '清明': [4, 5], '谷雨': [4, 20],
    '立夏': [5, 5], '小满': [5, 21], '芒种': [6, 6], '夏至': [6, 21],
    '小暑': [7, 7], '大暑': [7, 23], '立秋': [8, 7], '处暑': [8, 23],
    '白露': [9, 7], '秋分': [9, 23], '寒露': [10, 8], '霜降': [10, 23],
    '立冬': [11, 7], '小雪': [11, 22], '大雪': [12, 7], '冬至': [12, 21],
  };

  const terms = Object.entries(termDates);

  // 找到当前日期所在的节气
  let currentTerm = '冬至';
  for (const [name, [termMonth, termDay]] of terms) {
    if (month < termMonth || (month === termMonth && day < termDay)) {
      break;
    }
    currentTerm = name;
  }

  return currentTerm;
}

/**
 * 获取节气的精确日期（简化版）
 */
export function getSolarTermDate(year: number, termName: string): Date {
  const termDates: Record<string, [number, number]> = {
    '小寒': [1, 5], '大寒': [1, 20], '立春': [2, 4], '雨水': [2, 19],
    '惊蛰': [3, 5], '春分': [3, 20], '清明': [4, 5], '谷雨': [4, 20],
    '立夏': [5, 5], '小满': [5, 21], '芒种': [6, 6], '夏至': [6, 21],
    '小暑': [7, 7], '大暑': [7, 23], '立秋': [8, 7], '处暑': [8, 23],
    '白露': [9, 7], '秋分': [9, 23], '寒露': [10, 8], '霜降': [10, 23],
    '立冬': [11, 7], '小雪': [11, 22], '大雪': [12, 7], '冬至': [12, 21],
  };

  const [month, day] = termDates[termName] || [1, 1];
  return new Date(year, month - 1, day);
}

/**
 * 获取下一个节气
 */
export function getNextSolarTermName(currentTerm: string): string {
  const terms = [
    '冬至', '小寒', '大寒', '立春', '雨水', '惊蛰',
    '春分', '清明', '谷雨', '立夏', '小满', '芒种',
    '夏至', '小暑', '大暑', '立秋', '处暑', '白露',
    '秋分', '寒露', '霜降', '立冬', '小雪', '大雪',
  ];
  const index = terms.indexOf(currentTerm);
  return terms[(index + 1) % terms.length];
}

/**
 * 根据节气日期计算元（上元、中元、下元）
 * 每节气15天，每元5天
 */
export function getYuanByDate(termStartDate: Date, currentDate: Date): 1 | 2 | 3 {
  const diffDays = Math.floor((currentDate.getTime() - termStartDate.getTime()) / (24 * 60 * 60 * 1000));

  if (diffDays < 5) return 1; // 上元
  if (diffDays < 10) return 2; // 中元
  return 3; // 下元
}
