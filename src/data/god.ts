/**
 * 八神数据
 * 转盘奇门：值符、螣蛇、太阴、六合、白虎、玄武、九地、九天
 * 飞盘奇门：值符、螣蛇、太阴、六合、勾陈、朱雀、九地、九天
 */

import { BaShenZhuan, BaShenFei, PalaceIndex } from '../types';

/** 转盘八神顺序（阳遁顺排） */
export const SHEN_ZHUAN_ORDER: BaShenZhuan[] = [
  '值符', '螣蛇', '太阴', '六合', '白虎', '玄武', '九地', '九天',
];

/** 飞盘八神顺序 */
export const SHEN_FEI_ORDER: BaShenFei[] = [
  '值符', '螣蛇', '太阴', '六合', '勾陈', '朱雀', '九地', '九天',
];

/** 转盘八神：阳遁顺排，阴遁逆排 */
/** 飞盘八神：阳遁顺飞，阴遁逆飞 */

/** 获取转盘八神在宫位的位置 */
export function getZhuanShenPosition(
  shen: BaShenZhuan,
  zhiFuPosition: PalaceIndex,
  yinYang: '阳遁' | '阴遁'
): PalaceIndex {
  const index = SHEN_ZHUAN_ORDER.indexOf(shen);
  if (index === -1) return zhiFuPosition;

  // 阳遁顺排：1→2→3→4→5→6→7→8→9
  // 阴遁逆排：1→9→8→7→6→5→4→3→2
  if (yinYang === '阳遁') {
    const pos = zhiFuPosition + index;
    return pos > 9 ? (pos - 9) as PalaceIndex : pos as PalaceIndex;
  } else {
    const pos = zhiFuPosition - index;
    return pos < 1 ? (pos + 9) as PalaceIndex : pos as PalaceIndex;
  }
}

/** 获取飞盘八神在宫位的位置（按九宫数字飞布） */
export function getFeiShenPosition(
  shen: BaShenFei,
  zhiFuPosition: PalaceIndex,
  yinYang: '阳遁' | '阴遁'
): PalaceIndex {
  const index = SHEN_FEI_ORDER.indexOf(shen);
  if (index === -1) return zhiFuPosition;

  // 飞盘按九宫数字顺序飞布
  // 阳遁顺飞：1→2→3→4→5→6→7→8→9
  // 阴遁逆飞：1→9→8→7→6→5→4→3→2
  if (yinYang === '阳遁') {
    const pos = zhiFuPosition + index;
    return pos > 9 ? (pos - 9) as PalaceIndex : pos as PalaceIndex;
  } else {
    const pos = zhiFuPosition - index;
    return pos < 1 ? (pos + 9) as PalaceIndex : pos as PalaceIndex;
  }
}

/** 根据位置获取转盘八神 */
export function getZhuanShenByPosition(
  position: PalaceIndex,
  zhiFuPosition: PalaceIndex,
  yinYang: '阳遁' | '阴遁'
): BaShenZhuan {
  // 计算相对于值符位置的偏移
  let offset: number;
  if (yinYang === '阳遁') {
    offset = position - zhiFuPosition;
    if (offset < 0) offset += 9;
  } else {
    offset = zhiFuPosition - position;
    if (offset < 0) offset += 9;
  }

  return SHEN_ZHUAN_ORDER[offset % 8] || '值符';
}

/** 八神五行属性（用于分析） */
export const SHEN_WUXING: Record<string, string> = {
  '值符': '土',
  '螣蛇': '火',
  '太阴': '金',
  '六合': '木',
  '白虎': '金',
  '玄武': '水',
  '勾陈': '土',
  '朱雀': '火',
  '九地': '土',
  '九天': '金',
};
