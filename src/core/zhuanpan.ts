/**
 * 转盘奇门排布算法
 * 排宫法：天盘、人盘、神盘均围绕值符、值使旋转
 */

import {
  Palace, PalaceIndex, YinYangDun, JiuXing, BaMen, BaShenZhuan,
  SanQiLiuYi, LiuJiaXunShou, QiMenResult,
} from '../types';
import { getDiPanArrangement, SAN_QI_LIU_YI } from '../data';
import { POSITION_STAR, POSITION_DOOR, STAR_ORDER, DOOR_ORDER_CLOCKWISE } from '../data';
import { SHEN_ZHUAN_ORDER } from '../data/god';

/**
 * 排地盘（固定）
 */
export function paiDiPan(juShu: number, yinYang: YinYangDun): Record<PalaceIndex, SanQiLiuYi> {
  return getDiPanArrangement(juShu, yinYang);
}

/**
 * 排天盘（转盘法）
 * 值符星移到时辰干位置，其他星按原顺序跟随
 */
export function paiTianPan(
  zhiFuStar: JiuXing,
  zhiFuPosition: PalaceIndex,
  hourGanPosition: PalaceIndex,
  yinYang: YinYangDun,
  diPan: Record<PalaceIndex, SanQiLiuYi>
): Record<PalaceIndex, { star: JiuXing | null; yi: SanQiLiuYi | null }> {
  const tianPan: Record<number, { star: JiuXing | null; yi: SanQiLiuYi | null }> = {
    1: { star: null, yi: null },
    2: { star: null, yi: null },
    3: { star: null, yi: null },
    4: { star: null, yi: null },
    5: { star: null, yi: null },
    6: { star: null, yi: null },
    7: { star: null, yi: null },
    8: { star: null, yi: null },
    9: { star: null, yi: null },
  };

  // 找到值符星在原始九星序列中的索引
  const zhiFuIndex = STAR_ORDER.indexOf(zhiFuStar);
  if (zhiFuIndex === -1) return tianPan as Record<PalaceIndex, { star: JiuXing | null; yi: SanQiLiuYi | null }>;

  // 计算偏移：值符星从原始位置移到时辰干位置
  const originalZhiFuPos = zhiFuPosition;
  const targetPos = hourGanPosition;

  // 计算旋转偏移量
  let offset: number;
  if (yinYang === '阳遁') {
    offset = targetPos - originalZhiFuPos;
  } else {
    offset = originalZhiFuPos - targetPos;
  }
  offset = (offset + 9) % 9;

  // 排天盘九星
  for (let i = 0; i < 9; i++) {
    const starIndex = (zhiFuIndex + i) % 9;
    const star = STAR_ORDER[starIndex];

    // 计算该星在转盘后的位置
    let position: number;
    if (yinYang === '阳遁') {
      position = ((targetPos - 1 + i) % 9) + 1;
    } else {
      position = ((targetPos - 1 - i + 9) % 9) + 1;
    }

    tianPan[position] = { star, yi: null };
  }

  // 排天盘三奇六仪（随星转动）
  // 时辰旬首所在宫的六仪是起点
  // 简化：天盘的六仪对应星所在宫的地盘六仪
  for (let pos = 1; pos <= 9; pos++) {
    const star = tianPan[pos].star;
    if (star) {
      // 找到该星的原始宫位
      const originalPos = POSITION_STAR[star];
      // 天盘该星携带该原始宫位的地盘六仪
      tianPan[pos].yi = diPan[originalPos];
    }
  }

  return tianPan as Record<PalaceIndex, { star: JiuXing | null; yi: SanQiLiuYi | null }>;
}

/**
 * 排八门（转盘法）
 * 值使门按时辰数移动，其他门按顺序跟随
 */
export function paiBaMen(
  zhiShiDoor: BaMen,
  zhiShiPosition: PalaceIndex,
  yinYang: YinYangDun
): Record<PalaceIndex, BaMen | null> {
  const men: Record<number, BaMen | null> = {
    1: null, 2: null, 3: null, 4: null, 5: null,
    6: null, 7: null, 8: null, 9: null,
  };

  // 找到值使门在八门序列中的索引
  const zhiShiIndex = DOOR_ORDER_CLOCKWISE.indexOf(zhiShiDoor);
  if (zhiShiIndex === -1) return men as Record<PalaceIndex, BaMen | null>;

  // 中五宫没有门，排到坤二宫
  // 转盘八门：阳遁顺时针，阴遁逆时针
  const doorCount = 8;

  for (let i = 0; i < doorCount; i++) {
    const doorIndex = (zhiShiIndex + i) % doorCount;
    const door = DOOR_ORDER_CLOCKWISE[doorIndex];

    // 计算门的位置
    let position: number;
    if (yinYang === '阳遁') {
      // 顺时针：坎1->艮8->震3->巽4->离9->坤2->兑7->乾6
      position = getNextPositionClockwise(zhiShiPosition, i);
    } else {
      // 逆时针：坎1->乾6->兑7->坤2->离9->巽4->震3->艮8
      position = getNextPositionCounterClockwise(zhiShiPosition, i);
    }

    // 中五宫排到坤二宫
    if (position === 5) {
      position = 2;
    }

    men[position] = door;
  }

  return men as Record<PalaceIndex, BaMen | null>;
}

/**
 * 获取顺时针下一个宫位
 * 转盘顺序：1->8->3->4->9->2->7->6->1 (跳5)
 */
function getNextPositionClockwise(current: number, steps: number): number {
  const clockwiseOrder = [1, 8, 3, 4, 9, 2, 7, 6];
  const currentIndex = clockwiseOrder.indexOf(current);
  if (currentIndex === -1) return current;

  const newIndex = (currentIndex + steps) % 8;
  return clockwiseOrder[newIndex];
}

/**
 * 获取逆时针下一个宫位
 * 逆时针顺序：1->6->7->2->9->4->3->8
 */
function getNextPositionCounterClockwise(current: number, steps: number): number {
  const counterClockwiseOrder = [1, 6, 7, 2, 9, 4, 3, 8];
  const currentIndex = counterClockwiseOrder.indexOf(current);
  if (currentIndex === -1) return current;

  const newIndex = (currentIndex + steps) % 8;
  return counterClockwiseOrder[newIndex];
}

/**
 * 排八神（转盘法）
 * 值符随天盘值符星，阳遁顺排、阴遁逆排
 */
export function paiBaShen(
  zhiFuPosition: PalaceIndex,
  yinYang: YinYangDun
): Record<PalaceIndex, BaShenZhuan | null> {
  const shen: Record<number, BaShenZhuan | null> = {
    1: null, 2: null, 3: null, 4: null, 5: null,
    6: null, 7: null, 8: null, 9: null,
  };

  // 八神顺序
  const shenOrder = SHEN_ZHUAN_ORDER;

  // 阳遁顺排，阴遁逆排
  for (let i = 0; i < shenOrder.length; i++) {
    let position: number;
    if (yinYang === '阳遁') {
      // 顺排
      position = ((zhiFuPosition - 1 + i) % 9) + 1;
    } else {
      // 逆排
      position = ((zhiFuPosition - 1 - i + 9) % 9) + 1;
    }

    // 中五宫排到坤二宫
    if (position === 5) {
      position = 2;
    }

    shen[position] = shenOrder[i];
  }

  return shen as Record<PalaceIndex, BaShenZhuan | null>;
}

/**
 * 完整转盘排盘
 */
export function paiPanZhuan(
  juShu: number,
  yinYang: YinYangDun,
  zhiFuStar: JiuXing,
  zhiFuPosition: PalaceIndex,
  zhiShiDoor: BaMen,
  zhiShiPosition: PalaceIndex,
  hourGanPosition: PalaceIndex
): Palace[] {
  // 1. 排地盘
  const diPan = paiDiPan(juShu, yinYang);

  // 2. 排天盘
  const tianPan = paiTianPan(zhiFuStar, zhiFuPosition, hourGanPosition, yinYang, diPan);

  // 3. 排八门
  const men = paiBaMen(zhiShiDoor, zhiShiPosition, yinYang);

  // 4. 排八神（值符随天盘值符星）
  // 找到天盘值符星所在位置
  let tianPanZhiFuPosition: PalaceIndex = zhiFuPosition;
  for (let pos = 1; pos <= 9; pos++) {
    if (tianPan[pos as PalaceIndex]?.star === zhiFuStar) {
      tianPanZhiFuPosition = pos as PalaceIndex;
      break;
    }
  }
  const shen = paiBaShen(tianPanZhiFuPosition, yinYang);

  // 5. 组装九宫数据
  const palaces: Palace[] = [];
  const positionNames = ['', '坎', '坤', '震', '巽', '中', '乾', '兑', '艮', '离'];
  const positionZhi = ['', '子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申'] as const;

  for (let i = 1; i <= 9; i++) {
    const pos = i as PalaceIndex;
    palaces.push({
      index: pos,
      bagua: positionNames[i] as any,
      dizhi: positionZhi[i],
      diPan: diPan[pos] || null,
      tianPan: tianPan[pos]?.yi || null,
      xing: tianPan[pos]?.star || null,
      men: men[pos] || null,
      shen: shen[pos] || null,
      patterns: [],
    });
  }

  return palaces;
}
