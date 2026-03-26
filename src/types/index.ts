/**
 * 奇门遁甲类型定义
 */

/** 阴阳遁类型 */
export type YinYangDun = '阳遁' | '阴遁';

/** 起局方法 */
export type QiJuMethod = '拆补法' | '置闰法' | '茅山法';

/** 流派 */
export type School = '转盘奇门' | '飞盘奇门';

/** 九宫索引 1-9 */
export type PalaceIndex = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

/** 八卦名称 */
export type BaGua = '坎' | '坤' | '震' | '巽' | '中' | '乾' | '兑' | '艮' | '离';

/** 九星 */
export type JiuXing = '天蓬' | '天任' | '天冲' | '天辅' | '天英' | '天芮' | '天柱' | '天心' | '天禽';

/** 八门 */
export type BaMen = '休门' | '生门' | '伤门' | '杜门' | '景门' | '死门' | '惊门' | '开门';

/** 八神（转盘） */
export type BaShenZhuan = '值符' | '螣蛇' | '太阴' | '六合' | '白虎' | '玄武' | '九地' | '九天';

/** 八神（飞盘） */
export type BaShenFei = '值符' | '螣蛇' | '太阴' | '六合' | '勾陈' | '朱雀' | '九地' | '九天';

/** 三奇六仪 */
export type SanQiLiuYi = '戊' | '己' | '庚' | '辛' | '壬' | '癸' | '丁' | '丙' | '乙';

/** 六甲旬首 */
export type LiuJiaXunShou = '甲子戊' | '甲戌己' | '甲申庚' | '甲午辛' | '甲辰壬' | '甲寅癸';

/** 十二地支 */
export type DiZhi = '子' | '丑' | '寅' | '卯' | '辰' | '巳' | '午' | '未' | '申' | '酉' | '戌' | '亥';

/** 十天干 */
export type TianGan = '甲' | '乙' | '丙' | '丁' | '戊' | '己' | '庚' | '辛' | '壬' | '癸';

/** 宫位信息 */
export interface Palace {
  /** 宫位索引 1-9 */
  index: PalaceIndex;

  /** 八卦名称 */
  bagua: BaGua;

  /** 地支 */
  dizhi: DiZhi;

  /** 地盘三奇六仪（固定） */
  diPan: SanQiLiuYi | null;

  /** 天盘三奇六仪（随局变化） */
  tianPan: SanQiLiuYi | null;

  /** 九星 */
  xing: JiuXing | null;

  /** 八门 */
  men: BaMen | null;

  /** 八神 */
  shen: BaShenZhuan | BaShenFei | null;

  /** 本宫格局 */
  patterns: string[];
}

/** 节气信息 */
export interface SolarTerm {
  /** 节气名称 */
  name: string;

  /** 公历月份 */
  month: number;

  /** 公历日期 */
  day: number;

  /** 阳遁局数 [上元, 中元, 下元] */
  yangDun: [number, number, number];

  /** 阴遁局数 [上元, 中元, 下元] */
  yinDun: [number, number, number];
}

/** 输入时间 */
export interface InputTime {
  /** 公历年 */
  year: number;

  /** 公历月 1-12 */
  month: number;

  /** 公历日 1-31 */
  day: number;

  /** 小时 0-23 */
  hour: number;

  /** 分钟 0-59 */
  minute?: number;
}

/** 农历日期 */
export interface LunarDate {
  /** 农历年 */
  year: number;

  /** 农历月 1-12 */
  month: number;

  /** 农历日 1-30 */
  day: number;

  /** 是否闰月 */
  isLeap: boolean;
}

/** 奇门排盘结果 */
export interface QiMenResult {
  /** 公历日期 */
  solarDate: InputTime;

  /** 农历日期 */
  lunarDate: LunarDate;

  /** 当前节气 */
  solarTerm: string;

  /** 下一个节气（用于显示） */
  nextSolarTerm?: string;

  /** 阴阳遁 */
  yinYang: YinYangDun;

  /** 局数 1-9 */
  juShu: number;

  /** 起局方法 */
  method: QiJuMethod;

  /** 流派 */
  school: School;

  /** 元（上/中/下） */
  yuan: string;

  /** 旬首 */
  xunShou: LiuJiaXunShou;

  /** 值符星 */
  zhiFuXing: JiuXing;

  /** 值符所在宫位 */
  zhiFuPosition: PalaceIndex;

  /** 值使门 */
  zhiShiMen: BaMen;

  /** 值使所在宫位 */
  zhiShiPosition: PalaceIndex;

  /** 九宫数据 */
  palaces: Palace[];

  /** 时辰干支 */
  hourGanZhi: string;

  /** 日干支 */
  dayGanZhi: string;

  /** 吉格列表 */
  jiGe: string[];

  /** 凶格列表 */
  xiongGe: string[];
}

/** 排盘选项 */
export interface QiMenOptions {
  /** 起局方法，默认拆补法 */
  method?: QiJuMethod;

  /** 流派，默认转盘奇门 */
  school?: School;

  /** 是否使用真太阳时 */
  useTrueSolar?: boolean;

  /** 经度，使用真太阳时时需要提供 */
  longitude?: number;

  /** 纬度，可选 */
  latitude?: number;
}

/** 六甲旬首对应关系 */
export interface XunShouInfo {
  /** 旬首名称 */
  name: LiuJiaXunShou;

  /** 对应的天干序号（戊=0, 己=1...） */
  index: number;

  /** 对应的地支序号（子=0, 丑=1...） */
  zhiIndex: number;
}

/** 九星信息 */
export interface StarInfo {
  /** 星名 */
  name: JiuXing;

  /** 原始宫位（坎1、坤2...） */
  originalPosition: PalaceIndex;

  /** 五行 */
  wuxing: string;

  /** 阴阳 */
  yinyang: string;
}

/** 八门信息 */
export interface DoorInfo {
  /** 门名 */
  name: BaMen;

  /** 原始宫位 */
  originalPosition: PalaceIndex;

  /** 五行 */
  wuxing: string;
}

/** 格局定义 */
export interface PatternDefinition {
  /** 格局名称 */
  name: string;

  /** 类型：吉格/凶格 */
  type: '吉格' | '凶格';

  /** 判断条件 */
  condition: (palace: Palace, result: QiMenResult) => boolean;

  /** 描述 */
  description: string;
}
