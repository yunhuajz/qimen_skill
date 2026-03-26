/**
 * 基础数据
 * 干支、三奇六仪、六甲旬首等
 */

import { TianGan, DiZhi, LiuJiaXunShou, SanQiLiuYi, PalaceIndex } from '../types';

/** 十天干 */
export const TIAN_GAN: TianGan[] = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

/** 十二地支 */
export const DI_ZHI: DiZhi[] = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

/** 三奇六仪 */
export const SAN_QI_LIU_YI: SanQiLiuYi[] = ['戊', '己', '庚', '辛', '壬', '癸', '丁', '丙', '乙'];

/** 六甲旬首 */
export const LIU_JIA_XUN_SHOU: LiuJiaXunShou[] = [
  '甲子戊', '甲戌己', '甲申庚', '甲午辛', '甲辰壬', '甲寅癸',
];

/** 旬首对应的天干索引（戊=0, 己=1, ...） */
export const XUN_SHOU_INDEX: Record<LiuJiaXunShou, number> = {
  '甲子戊': 0, '甲戌己': 1, '甲申庚': 2, '甲午辛': 3, '甲辰壬': 4, '甲寅癸': 5,
};

/** 旬首对应的地支起始索引（子=0, 戌=10, 申=8, 午=6, 辰=4, 寅=2） */
export const XUN_SHOU_ZHI_INDEX: Record<LiuJiaXunShou, number> = {
  '甲子戊': 0,  // 子
  '甲戌己': 10, // 戌
  '甲申庚': 8,  // 申
  '甲午辛': 6,  // 午
  '甲辰壬': 4,  // 辰
  '甲寅癸': 2,  // 寅
};

/** 天干索引映射 */
export const GAN_INDEX: Record<string, number> = {
  '甲': 0, '乙': 1, '丙': 2, '丁': 3, '戊': 4,
  '己': 5, '庚': 6, '辛': 7, '壬': 8, '癸': 9,
};

/** 地支索引映射 */
export const ZHI_INDEX: Record<string, number> = {
  '子': 0, '丑': 1, '寅': 2, '卯': 3, '辰': 4, '巳': 5,
  '午': 6, '未': 7, '申': 8, '酉': 9, '戌': 10, '亥': 11,
};

/** 九宫与地支对应 */
export const POSITION_ZHI: Record<PalaceIndex, DiZhi> = {
  1: '子', 2: '丑', 3: '寅', 4: '卯', 5: '辰',
  6: '巳', 7: '午', 8: '未', 9: '申',
};

/** 九宫与八卦对应 */
export const POSITION_BAGUA: Record<PalaceIndex, string> = {
  1: '坎', 2: '坤', 3: '震', 4: '巽', 5: '中',
  6: '乾', 7: '兑', 8: '艮', 9: '离',
};

/** 八卦与宫位对应 */
export const BAGUA_POSITION: Record<string, PalaceIndex> = {
  '坎': 1, '坤': 2, '震': 3, '巽': 4, '中': 5,
  '乾': 6, '兑': 7, '艮': 8, '离': 9,
};

/** 地盘三奇六仪排列（根据局数） */
/** 阳遁：顺布戊己庚辛壬癸丁丙乙 */
/** 阴遁：逆布戊己庚辛壬癸丁丙乙 */
export function getDiPanArrangement(juShu: number, yinYang: '阳遁' | '阴遁'): Record<PalaceIndex, SanQiLiuYi> {
  const arrangement: Record<number, SanQiLiuYi> = {};
  const startIndex = juShu - 1; // 局数从1开始，索引从0开始

  for (let i = 0; i < 9; i++) {
    let position: number;
    if (yinYang === '阳遁') {
      // 阳遁顺排：从局数位置开始，顺时针
      position = ((juShu - 1 + i) % 9) + 1;
    } else {
      // 阴遁逆排：从局数位置开始，逆时针
      position = ((juShu - 1 - i + 9) % 9) + 1;
    }
    arrangement[position] = SAN_QI_LIU_YI[i];
  }

  return arrangement as Record<PalaceIndex, SanQiLiuYi>;
}

/** 获取旬首 */
export function getXunShou(ganZhi: string): LiuJiaXunShou {
  const zhi = ganZhi.slice(1) as DiZhi;
  const zhiIdx = ZHI_INDEX[zhi];

  // 找到对应的旬首
  for (const xunShou of LIU_JIA_XUN_SHOU) {
    const startIdx = XUN_SHOU_ZHI_INDEX[xunShou];
    const endIdx = (startIdx + 9) % 12;
    if (zhiIdx >= startIdx && zhiIdx < startIdx + 10) {
      return xunShou;
    }
    // 处理跨边界情况
    if (startIdx + 10 > 12) {
      const wrappedEnd = (startIdx + 10) % 12;
      if (zhiIdx < wrappedEnd || zhiIdx >= startIdx) {
        return xunShou;
      }
    }
  }

  return '甲子戊';
}

/** 根据时辰干支获取旬首在六仪中的索引（戊=0, 己=1...） */
export function getXunShouLiuYiIndex(hourGanZhi: string): number {
  const xunShou = getXunShou(hourGanZhi);
  return XUN_SHOU_INDEX[xunShou];
}
