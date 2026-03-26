/**
 * 格局识别
 * 吉格和凶格的判断
 */

import { Palace, PalaceIndex, QiMenResult, BaMen } from '../types';
import { getDiPanArrangement } from '../data';
import { isDoorPo, POSITION_WUXING, DOOR_WUXING } from '../data/door';
import { STAR_ORIGINAL_POSITION } from '../data/star';
import { DOOR_ORIGINAL_POSITION } from '../data/door';

/**
 * 识别所有格局
 */
export function identifyPatterns(result: QiMenResult): { jiGe: string[]; xiongGe: string[] } {
  const jiGe: string[] = [];
  const xiongGe: string[] = [];

  // 检查每个宫位的格局
  for (const palace of result.palaces) {
    const palacePatterns = identifyPalacePatterns(palace, result);
    palace.patterns = palacePatterns;

    for (const pattern of palacePatterns) {
      if (isJiGe(pattern)) {
        if (!jiGe.includes(pattern)) jiGe.push(pattern);
      } else if (isXiongGe(pattern)) {
        if (!xiongGe.includes(pattern)) xiongGe.push(pattern);
      }
    }
  }

  // 全局格局
  const globalPatterns = identifyGlobalPatterns(result);
  for (const pattern of globalPatterns.jiGe) {
    if (!jiGe.includes(pattern)) jiGe.push(pattern);
  }
  for (const pattern of globalPatterns.xiongGe) {
    if (!xiongGe.includes(pattern)) xiongGe.push(pattern);
  }

  return { jiGe, xiongGe };
}

/**
 * 识别单个宫位的格局
 */
function identifyPalacePatterns(palace: Palace, result: QiMenResult): string[] {
  const patterns: string[] = [];

  if (!palace.tianPan || !palace.diPan) return patterns;

  const { tianPan, diPan, xing, men, shen } = palace;
  const { yinYang } = result;

  // ========== 吉格 ==========

  // 1. 青龙返首（戊+丙）
  if (diPan === '戊' && tianPan === '丙') {
    patterns.push('青龙返首');
  }

  // 2. 飞鸟跌穴（丙+戊）
  if (diPan === '丙' && tianPan === '戊') {
    patterns.push('飞鸟跌穴');
  }

  // 3. 天遁（丙+丁，生门）- 需要门和星配合
  if (diPan === '丙' && tianPan === '丁' && men === '生门') {
    patterns.push('天遁');
  }

  // 4. 地遁（乙+己，开门）
  if (diPan === '乙' && tianPan === '己' && men === '开门') {
    patterns.push('地遁');
  }

  // 5. 人遁（丁+乙，休门）
  if (diPan === '丁' && tianPan === '乙' && men === '休门') {
    patterns.push('人遁');
  }

  // 6. 神遁（丙+丁，神盘值符）
  if (diPan === '丙' && tianPan === '丁' && shen === '值符') {
    patterns.push('神遁');
  }

  // 7. 鬼遁（丁+癸，神盘九地）
  if (diPan === '丁' && tianPan === '癸' && shen === '九地') {
    patterns.push('鬼遁');
  }

  // ========== 凶格 ==========

  // 1. 六仪击刑
  const jiXingPatterns = checkLiuYiJiXing(diPan, palace.index);
  if (jiXingPatterns) patterns.push(jiXingPatterns);

  // 2. 门迫
  if (men && isDoorPo(men, palace.index)) {
    patterns.push('门迫');
  }

  // 3. 六仪入墓
  const ruMuPattern = checkLiuYiRuMu(tianPan, palace.index);
  if (ruMuPattern) patterns.push(ruMuPattern);

  // 4. 悖格（丙加日干）- 需要日干信息
  // 简化：丙+庚也算悖格
  if (diPan === '丙' && tianPan === '庚') {
    patterns.push('悖格');
  }

  // 5. 刑格（庚+日干）
  if (diPan === '庚' && tianPan === '戊') {
    patterns.push('刑格');
  }

  // 6. 天乙伏宫（庚+庚）
  if (diPan === '庚' && tianPan === '庚') {
    patterns.push('天乙伏宫');
  }

  // 7. 天乙飞宫（庚+癸）
  if (diPan === '庚' && tianPan === '癸') {
    patterns.push('天乙飞宫');
  }

  // 8. 荧惑入白（丙+庚）
  if (diPan === '丙' && tianPan === '庚') {
    patterns.push('荧惑入白');
  }

  // 9. 白入荧（庚+丙）
  if (diPan === '庚' && tianPan === '丙') {
    patterns.push('白入荧');
  }

  // 10. 腾蛇夭矫（癸+丁）
  if (diPan === '癸' && tianPan === '丁') {
    patterns.push('腾蛇夭矫');
  }

  // 11. 朱雀投江（丁+癸）
  if (diPan === '丁' && tianPan === '癸') {
    patterns.push('朱雀投江');
  }

  return patterns;
}

/**
 * 识别全局格局
 */
function identifyGlobalPatterns(result: QiMenResult): { jiGe: string[]; xiongGe: string[] } {
  const jiGe: string[] = [];
  const xiongGe: string[] = [];

  // 1. 伏吟（天盘九星在本宫不动）
  let fuYinCount = 0;
  for (const palace of result.palaces) {
    if (palace.xing) {
      const originalPos = STAR_ORIGINAL_POSITION[palace.xing];
      if (originalPos === palace.index) {
        fuYinCount++;
      }
    }
  }
  if (fuYinCount >= 6) {
    xiongGe.push('星伏吟');
  }

  // 2. 门伏吟
  let menFuYinCount = 0;
  for (const palace of result.palaces) {
    if (palace.men) {
      const originalPos = DOOR_ORIGINAL_POSITION[palace.men];
      if (originalPos === palace.index) {
        menFuYinCount++;
      }
    }
  }
  if (menFuYinCount >= 6) {
    xiongGe.push('门伏吟');
  }

  // 3. 五不遇时（时干克日干）
  // 简化判断：需要完整干支信息
  const dayGan = result.dayGanZhi[0];
  const hourGan = result.hourGanZhi[0];
  if (isKe(hourGan, dayGan)) {
    xiongGe.push('五不遇时');
  }

  return { jiGe, xiongGe };
}

/**
 * 检查六仪击刑
 * 戊三（震宫）、己二（坤宫）、庚八（艮宫）、辛九（离宫）、壬四（巽宫）、癸一（坎宫）
 */
function checkLiuYiJiXing(yi: string, position: PalaceIndex): string | null {
  const jiXingMap: Record<string, PalaceIndex> = {
    '戊': 3, // 震宫
    '己': 2, // 坤宫
    '庚': 8, // 艮宫
    '辛': 9, // 离宫
    '壬': 4, // 巽宫
    '癸': 1, // 坎宫
  };

  if (jiXingMap[yi] === position) {
    return '六仪击刑';
  }
  return null;
}

/**
 * 检查六仪入墓
 * 戊六（乾宫）、己二（坤宫）、庚八（艮宫）、辛八（艮宫）、壬六（乾宫）、癸六（乾宫）
 */
function checkLiuYiRuMu(yi: string, position: PalaceIndex): string | null {
  const ruMuMap: Record<string, PalaceIndex[]> = {
    '戊': [6],
    '己': [2],
    '庚': [8],
    '辛': [8],
    '壬': [6],
    '癸': [6],
  };

  if (ruMuMap[yi]?.includes(position)) {
    return '六仪入墓';
  }
  return null;
}

/**
 * 判断天干相克（A克B）
 * 甲乙木，丙丁火，戊己土，庚辛金，壬癸水
 * 金克木，木克土，土克水，水克火，火克金
 */
function isKe(ganA: string, ganB: string): boolean {
  const wuxing: Record<string, string> = {
    '甲': '木', '乙': '木',
    '丙': '火', '丁': '火',
    '戊': '土', '己': '土',
    '庚': '金', '辛': '金',
    '壬': '水', '癸': '水',
  };

  const keRelations: Record<string, string> = {
    '金': '木', '木': '土', '土': '水', '水': '火', '火': '金',
  };

  const wxA = wuxing[ganA];
  const wxB = wuxing[ganB];

  if (!wxA || !wxB) return false;

  return keRelations[wxA] === wxB;
}

/**
 * 判断是否为吉格
 */
function isJiGe(pattern: string): boolean {
  const jiGeList = [
    '青龙返首', '飞鸟跌穴', '天遁', '地遁', '人遁', '风遁', '云遁',
    '龙遁', '虎遁', '神遁', '鬼遁', '三奇得使', '玉女守门', '三诈五假',
    '天辅时', '天三门', '地四户',
  ];
  return jiGeList.includes(pattern);
}

/**
 * 判断是否为凶格
 */
function isXiongGe(pattern: string): boolean {
  const xiongGeList = [
    '伏吟', '星伏吟', '门伏吟', '反吟', '六仪击刑', '门迫', '六仪入墓',
    '五不遇时', '悖格', '刑格', '年月日时格', '天乙伏宫', '天乙飞宫',
    '荧惑入白', '白入荧', '腾蛇夭矫', '朱雀投江',
  ];
  return xiongGeList.includes(pattern);
}
