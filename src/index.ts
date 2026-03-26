/**
 * 奇门遁甲排盘 - 主入口
 */

import {
  InputTime, QiMenOptions, QiMenResult, Palace, PalaceIndex,
  YinYangDun, QiJuMethod, School, LiuJiaXunShou, JiuXing, BaMen,
} from './types';
import { dingJu, getZhiFuXing, getZhiShiMen, calculateZhiShiPosition, getHourZhi } from './core/ju';
import { paiPanZhuan } from './core/zhuanpan';
import { paiPanFei } from './core/feipan';
import { identifyPatterns } from './core/pattern';
import { getCurrentSolarTerm, getNextSolarTermName, getSiZhu, getHourGanZhi, getDayGanZhi } from './utils/time';
import { getDiPanArrangement, SAN_QI_LIU_YI, GAN_INDEX } from './data';

// 导出类型
export * from './types';

// 导出数据
export * from './data';
export * from './data/jieqi';
export * from './data/star';
export * from './data/door';
export * from './data/god';

// 导出核心算法
export * from './core/ju';
export * from './core/zhuanpan';
export * from './core/feipan';
export * from './core/pattern';

// 导出工具
export * from './utils/time';

/**
 * 奇门排盘主函数
 * @param time 输入时间
 * @param options 排盘选项
 * @returns 排盘结果
 */
export function paiPan(time: InputTime, options: QiMenOptions = {}): QiMenResult {
  const {
    method = '拆补法',
    school = '转盘奇门',
  } = options;

  // 1. 定局
  const dingJuResult = dingJu(time, method);
  const { yinYang, juShu, solarTerm, nextSolarTerm, yuan } = dingJuResult;

  // 2. 获取四柱
  const siZhu = getSiZhu(time);
  const dayGanZhi = siZhu.day;
  const hourGanZhi = siZhu.hour;

  // 3. 计算旬首
  const { getXunShou } = require('./data');
  const xunShou = getXunShou(hourGanZhi);

  // 4. 找值符星和值符宫位
  const { star: zhiFuStar, position: zhiFuPosition } = getZhiFuXing(xunShou, juShu, yinYang);

  // 5. 找值使门和值使宫位
  const { door: zhiShiDoor, position: zhiShiOriginalPosition } = getZhiShiMen(xunShou, juShu, yinYang);

  // 6. 计算值使门位置（根据时辰数）
  const hourZhi = getHourZhi(time.hour);
  const zhiShiPosition = calculateZhiShiPosition(zhiShiOriginalPosition, hourZhi, yinYang);

  // 7. 找时辰干位置
  const hourGan = hourGanZhi[0];
  const hourGanPosition = findGanPosition(hourGan, juShu, yinYang);

  // 8. 排盘
  let palaces: Palace[];
  if (school === '转盘奇门') {
    palaces = paiPanZhuan(
      juShu, yinYang, zhiFuStar, zhiFuPosition,
      zhiShiDoor, zhiShiPosition, hourGanPosition
    );
  } else {
    palaces = paiPanFei(
      juShu, yinYang, zhiFuStar, zhiFuPosition,
      zhiShiDoor, zhiShiPosition, hourGanPosition
    );
  }

  // 9. 组装结果
  const result: QiMenResult = {
    solarDate: time,
    lunarDate: {
      year: time.year,
      month: time.month,
      day: time.day,
      isLeap: false,
    },
    solarTerm,
    nextSolarTerm,
    yinYang,
    juShu,
    method,
    school,
    yuan,
    xunShou,
    zhiFuXing: zhiFuStar,
    zhiFuPosition,
    zhiShiMen: zhiShiDoor,
    zhiShiPosition,
    palaces,
    hourGanZhi,
    dayGanZhi,
    jiGe: [],
    xiongGe: [],
  };

  // 10. 识别格局
  const patterns = identifyPatterns(result);
  result.jiGe = patterns.jiGe;
  result.xiongGe = patterns.xiongGe;

  return result;
}

/**
 * 查找天干在地盘的位置
 */
function findGanPosition(gan: string, juShu: number, yinYang: YinYangDun): PalaceIndex {
  const diPan = getDiPanArrangement(juShu, yinYang);

  for (let pos = 1; pos <= 9; pos++) {
    if (diPan[pos as PalaceIndex] === gan) {
      return pos as PalaceIndex;
    }
  }

  return 1 as PalaceIndex;
}

/**
 * 格式化输出排盘结果
 */
export function formatResult(result: QiMenResult): string {
  const lines: string[] = [];

  lines.push('╔══════════════════════════════════════════════════════════════════╗');
  lines.push('║                        奇 门 遁 甲 排 盘                          ║');
  lines.push('╠══════════════════════════════════════════════════════════════════╣');

  // 基本信息
  lines.push(`║ 公历：${result.solarDate.year}年${result.solarDate.month}月${result.solarDate.day}日 ${String(result.solarDate.hour).padStart(2, '0')}:${String(result.solarDate.minute || 0).padStart(2, '0')}`);
  lines.push(`║ 干支：${result.dayGanZhi}日 ${result.hourGanZhi}时`);
  lines.push(`║ 节气：${result.solarTerm} (${result.yuan})`);
  lines.push(`║ 起局：${result.yinYang}${result.juShu}局 (${result.method})`);
  lines.push(`║ 流派：${result.school}`);
  lines.push(`║ 旬首：${result.xunShou}`);
  lines.push(`║ 值符：${result.zhiFuXing} (${result.zhiFuPosition}宫)`);
  lines.push(`║ 值使：${result.zhiShiMen} (${result.zhiShiPosition}宫)`);

  lines.push('╠══════════════════════════════════════════════════════════════════╣');

  // 九宫格展示
  lines.push('║ 九宫排盘：');
  lines.push('║');

  // 按九宫格式输出（3x3）
  const grid = formatNinePalaces(result.palaces);
  for (const row of grid) {
    lines.push(`║ ${row}`);
  }

  lines.push('╠══════════════════════════════════════════════════════════════════╣');

  // 格局
  if (result.jiGe.length > 0) {
    lines.push(`║ 吉格：${result.jiGe.join('、')}`);
  }
  if (result.xiongGe.length > 0) {
    lines.push(`║ 凶格：${result.xiongGe.join('、')}`);
  }

  lines.push('╚══════════════════════════════════════════════════════════════════╝');

  return lines.join('\n');
}

/**
 * 格式化九宫格
 */
function formatNinePalaces(palaces: Palace[]): string[] {
  // 九宫布局：
  // 4 9 2
  // 3 5 7
  // 8 1 6
  const layout = [
    [4, 9, 2],
    [3, 5, 7],
    [8, 1, 6],
  ];

  const lines: string[] = [];

  for (const row of layout) {
    const palaceStrs: string[] = [];
    for (const idx of row) {
      const palace = palaces.find(p => p.index === idx);
      if (palace) {
        const parts: string[] = [`[${idx}宫]`];
        if (palace.shen) parts.push(palace.shen);
        if (palace.xing) parts.push(palace.xing);
        if (palace.men) parts.push(palace.men);
        if (palace.tianPan) parts.push(`天${palace.tianPan}`);
        if (palace.diPan) parts.push(`地${palace.diPan}`);
        palaceStrs.push(parts.join(' '));
      }
    }
    lines.push(palaceStrs.join(' | '));
  }

  return lines;
}

/**
 * 交互式排盘（供Claude Skill使用）
 */
export function paiPanInteractive(
  year: number,
  month: number,
  day: number,
  hour: number,
  method: string = '拆补法',
  school: string = '转盘奇门'
): string {
  const methodMap: Record<string, QiJuMethod> = {
    '拆补法': '拆补法',
    '置闰法': '置闰法',
    '茅山法': '茅山法',
  };

  const schoolMap: Record<string, School> = {
    '转盘奇门': '转盘奇门',
    '飞盘奇门': '飞盘奇门',
  };

  const time: InputTime = { year, month, day, hour };
  const options: QiMenOptions = {
    method: methodMap[method] || '拆补法',
    school: schoolMap[school] || '转盘奇门',
  };

  const result = paiPan(time, options);
  return formatResult(result);
}

/**
 * 版本号
 */
export const VERSION = '1.0.0';
