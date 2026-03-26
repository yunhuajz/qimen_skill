/**
 * 奇门遁甲基础核心
 * 定局数、旬首计算等基础逻辑
 */

import {
  InputTime, QiMenOptions, YinYangDun, QiJuMethod,
  PalaceIndex, LiuJiaXunShou, JiuXing, BaMen,
} from '../types';
import { getCurrentSolarTerm, getSolarTermDate, getYuanByDate, getHourGanZhi, getDayGanZhi } from '../utils/time';
import { getYinYangDun, getJuShu, SOLAR_TERMS } from '../data/jieqi';
import { getXunShou, XUN_SHOU_INDEX, getDiPanArrangement, LIU_JIA_XUN_SHOU } from '../data';
import { POSITION_STAR, POSITION_DOOR } from '../data';

/**
 * 定局结果
 */
export interface DingJuResult {
  /** 阴阳遁 */
  yinYang: YinYangDun;
  /** 局数 1-9 */
  juShu: number;
  /** 节气 */
  solarTerm: string;
  /** 下一个节气 */
  nextSolarTerm: string;
  /** 元（上/中/下） */
  yuan: string;
}

/**
 * 根据时间定局
 * 支持拆补法、置闰法、茅山法
 */
export function dingJu(
  time: InputTime,
  method: QiJuMethod = '拆补法'
): DingJuResult {
  const date = new Date(time.year, time.month - 1, time.day, time.hour, time.minute || 0);

  switch (method) {
    case '拆补法':
      return dingJuChaibu(time, date);
    case '置闰法':
      return dingJuZhirun(time, date);
    case '茅山法':
      return dingJuMaoshan(time, date);
    default:
      return dingJuChaibu(time, date);
  }
}

/**
 * 拆补法定局
 * 按节气三元直接定局，余数归入下一元
 */
function dingJuChaibu(time: InputTime, date: Date): DingJuResult {
  // 获取当前节气
  const solarTerm = getCurrentSolarTerm(time.year, time.month, time.day);
  const yinYang = getYinYangDun(solarTerm);

  // 计算当前节气的起始日期
  const termStartDate = getSolarTermDate(time.year, solarTerm);

  // 计算元
  const yuan = getYuanByDate(termStartDate, date);

  // 查表得局数
  const juShu = getJuShu(solarTerm, yuan);

  // 获取下一个节气
  const terms = SOLAR_TERMS.map(t => t.name);
  const currentIndex = terms.indexOf(solarTerm);
  const nextSolarTerm = terms[(currentIndex + 1) % terms.length];

  const yuanNames = ['', '上元', '中元', '下元'];

  return {
    yinYang,
    juShu,
    solarTerm,
    nextSolarTerm,
    yuan: yuanNames[yuan],
  };
}

/**
 * 置闰法定局
 * 简化实现：与拆补法基本一致，但在特定节气置闰
 */
function dingJuZhirun(time: InputTime, date: Date): DingJuResult {
  // 置闰法较为复杂，先使用拆补法作为基础
  // 实际置闰法需要在芒种和大雪节气处理超神接气
  const result = dingJuChaibu(time, date);

  // 置闰法特殊处理：当出现超神（节气未到，干支先到）时置闰
  // 这里简化处理，实际需计算节气精确时刻

  return result;
}

/**
 * 茅山法定局
 * 按节气交接时刻直接分三元
 */
function dingJuMaoshan(time: InputTime, date: Date): DingJuResult {
  // 茅山法以节气交接时刻为界，直接分三元
  // 每元固定从交接时刻开始计算

  const solarTerm = getCurrentSolarTerm(time.year, time.month, time.day);
  const yinYang = getYinYangDun(solarTerm);

  // 茅山法：节气内直接分三等分
  const termStartDate = getSolarTermDate(time.year, solarTerm);
  const diffHours = (date.getTime() - termStartDate.getTime()) / (60 * 60 * 1000);
  const totalHours = 15 * 24; // 节气约15天

  let yuan: number;
  if (diffHours < totalHours / 3) {
    yuan = 1;
  } else if (diffHours < totalHours * 2 / 3) {
    yuan = 2;
  } else {
    yuan = 3;
  }

  const juShu = getJuShu(solarTerm, yuan);

  const terms = SOLAR_TERMS.map(t => t.name);
  const currentIndex = terms.indexOf(solarTerm);
  const nextSolarTerm = terms[(currentIndex + 1) % terms.length];

  const yuanNames = ['', '上元', '中元', '下元'];

  return {
    yinYang,
    juShu,
    solarTerm,
    nextSolarTerm,
    yuan: yuanNames[yuan],
  };
}

/**
 * 计算旬首
 */
export function calculateXunShou(hourGanZhi: string): LiuJiaXunShou {
  return getXunShou(hourGanZhi);
}

/**
 * 获取值符星
 * 旬首所在宫位的星
 */
export function getZhiFuXing(xunShou: LiuJiaXunShou, juShu: number, yinYang: YinYangDun): {
  star: JiuXing;
  position: PalaceIndex;
} {
  // 根据局数排地盘
  const diPan = getDiPanArrangement(juShu, yinYang);

  // 找出旬首六仪所在的宫位
  const xunShouLiuYi = xunShou.slice(2); // 甲子戊 -> 戊
  const position = Object.entries(diPan).find(([_, yi]) => yi === xunShouLiuYi)?.[0];

  if (!position) {
    return { star: '天蓬', position: 1 };
  }

  const pos = parseInt(position) as PalaceIndex;
  const star = POSITION_STAR[pos];

  return { star, position: pos };
}

/**
 * 获取值使门
 * 旬首所在宫位的门
 */
export function getZhiShiMen(xunShou: LiuJiaXunShou, juShu: number, yinYang: YinYangDun): {
  door: BaMen;
  position: PalaceIndex;
} {
  // 根据局数排地盘
  const diPan = getDiPanArrangement(juShu, yinYang);

  // 找出旬首六仪所在的宫位
  const xunShouLiuYi = xunShou.slice(2);
  const position = Object.entries(diPan).find(([_, yi]) => yi === xunShouLiuYi)?.[0];

  if (!position) {
    return { door: '休门', position: 1 };
  }

  const pos = parseInt(position) as PalaceIndex;
  const door = POSITION_DOOR[pos];

  if (!door) {
    return { door: '休门', position: 1 };
  }

  return { door, position: pos };
}

/**
 * 计算值使门位置
 * 根据时辰数确定值使门的位置
 */
export function calculateZhiShiPosition(
  originalPosition: PalaceIndex,
  hourZhi: string,
  yinYang: YinYangDun
): PalaceIndex {
  // 地支顺序
  const zhiOrder = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  const hourIndex = zhiOrder.indexOf(hourZhi);

  if (hourIndex === -1) return originalPosition;

  // 计算偏移（从子时开始）
  // 阳遁顺行，阴遁逆行
  if (yinYang === '阳遁') {
    const pos = originalPosition + hourIndex;
    return ((pos - 1) % 9) + 1 as PalaceIndex;
  } else {
    const pos = originalPosition - hourIndex;
    return ((pos - 1 + 9) % 9) + 1 as PalaceIndex;
  }
}

/**
 * 获取时辰地支
 */
export function getHourZhi(hour: number): string {
  const zhiOrder = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  const index = Math.floor((hour + 1) / 2) % 12;
  return zhiOrder[index];
}
