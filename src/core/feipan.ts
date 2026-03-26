/**
 * 飞盘奇门排布算法
 * 飞宫法：星、门、神按九宫数字顺序飞布
 */

import {
  Palace, PalaceIndex, YinYangDun, JiuXing, BaMen, BaShenFei,
  SanQiLiuYi,
} from '../types';
import { getDiPanArrangement, SAN_QI_LIU_YI } from '../data';
import { STAR_ORDER, POSITION_STAR } from '../data/star';
import { DOOR_ORDER_CLOCKWISE } from '../data/door';
import { SHEN_FEI_ORDER } from '../data/god';

/**
 * 飞盘天盘排布
 * 阳遁顺飞（1→2→3...），阴遁逆飞（1→9→8...）
 */
export function paiTianPanFei(
  zhiFuStar: JiuXing,
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

  // 找到值符星索引
  const zhiFuIndex = STAR_ORDER.indexOf(zhiFuStar);
  if (zhiFuIndex === -1) return tianPan as Record<PalaceIndex, { star: JiuXing | null; yi: SanQiLiuYi | null }>;

  // 飞布九星
  for (let i = 0; i < 9; i++) {
    const starIndex = (zhiFuIndex + i) % 9;
    const star = STAR_ORDER[starIndex];

    // 计算飞布位置
    let position: number;
    if (yinYang === '阳遁') {
      // 顺飞：按九宫数字顺序
      position = ((hourGanPosition - 1 + i) % 9) + 1;
    } else {
      // 逆飞：按九宫数字逆序
      position = ((hourGanPosition - 1 - i + 9) % 9) + 1;
    }

    tianPan[position] = { star, yi: null };
  }

  // 天盘三奇六仪
  for (let pos = 1; pos <= 9; pos++) {
    const star = tianPan[pos].star;
    if (star) {
      const originalPos = POSITION_STAR[star];
      tianPan[pos].yi = diPan[originalPos];
    }
  }

  return tianPan as Record<PalaceIndex, { star: JiuXing | null; yi: SanQiLiuYi | null }>;
}

/**
 * 飞盘八门排布
 * 阳遁顺飞，阴遁逆飞
 */
export function paiBaMenFei(
  zhiShiDoor: BaMen,
  zhiShiPosition: PalaceIndex,
  yinYang: YinYangDun
): Record<PalaceIndex, BaMen | null> {
  const men: Record<number, BaMen | null> = {
    1: null, 2: null, 3: null, 4: null, 5: null,
    6: null, 7: null, 8: null, 9: null,
  };

  // 找到值使门索引
  const zhiShiIndex = DOOR_ORDER_CLOCKWISE.indexOf(zhiShiDoor);
  if (zhiShiIndex === -1) return men as Record<PalaceIndex, BaMen | null>;

  // 飞布八门（跳5宫）
  let doorCount = 0;
  for (let i = 0; i < 9; i++) {
    const doorIndex = (zhiShiIndex + doorCount) % 8;
    const door = DOOR_ORDER_CLOCKWISE[doorIndex];

    // 计算飞布位置
    let position: number;
    if (yinYang === '阳遁') {
      position = ((zhiShiPosition - 1 + i) % 9) + 1;
    } else {
      position = ((zhiShiPosition - 1 - i + 9) % 9) + 1;
    }

    // 跳过中五宫
    if (position === 5) {
      continue;
    }

    men[position] = door;
    doorCount++;
  }

  return men as Record<PalaceIndex, BaMen | null>;
}

/**
 * 飞盘八神排布
 * 阳遁顺飞，阴遁逆飞
 * 飞盘八神顺序：值符、螣蛇、太阴、六合、勾陈、朱雀、九地、九天
 */
export function paiBaShenFei(
  zhiFuPosition: PalaceIndex,
  yinYang: YinYangDun
): Record<PalaceIndex, BaShenFei | null> {
  const shen: Record<number, BaShenFei | null> = {
    1: null, 2: null, 3: null, 4: null, 5: null,
    6: null, 7: null, 8: null, 9: null,
  };

  const shenOrder = SHEN_FEI_ORDER;

  // 飞布八神（跳5宫）
  let shenCount = 0;
  for (let i = 0; i < 9; i++) {
    const position: number = yinYang === '阳遁'
      ? ((zhiFuPosition - 1 + i) % 9) + 1
      : ((zhiFuPosition - 1 - i + 9) % 9) + 1;

    // 跳过中五宫
    if (position === 5) {
      continue;
    }

    shen[position] = shenOrder[shenCount];
    shenCount++;
  }

  return shen as Record<PalaceIndex, BaShenFei | null>;
}

/**
 * 完整飞盘排盘
 */
export function paiPanFei(
  juShu: number,
  yinYang: YinYangDun,
  zhiFuStar: JiuXing,
  zhiFuPosition: PalaceIndex,
  zhiShiDoor: BaMen,
  zhiShiPosition: PalaceIndex,
  hourGanPosition: PalaceIndex
): Palace[] {
  // 1. 排地盘
  const diPan = getDiPanArrangement(juShu, yinYang);

  // 2. 排天盘
  const tianPan = paiTianPanFei(zhiFuStar, hourGanPosition, yinYang, diPan);

  // 3. 排八门
  const men = paiBaMenFei(zhiShiDoor, zhiShiPosition, yinYang);

  // 4. 排八神
  // 找到天盘值符星所在位置
  let tianPanZhiFuPosition: PalaceIndex = zhiFuPosition;
  for (let pos = 1; pos <= 9; pos++) {
    if (tianPan[pos as PalaceIndex]?.star === zhiFuStar) {
      tianPanZhiFuPosition = pos as PalaceIndex;
      break;
    }
  }
  const shen = paiBaShenFei(tianPanZhiFuPosition, yinYang);

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
