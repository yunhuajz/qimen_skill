# qimen-skill

奇门遁甲排盘与分析工具 - 中国传统占卜术奇门遁甲排盘系统

## 简介

`qimen-skill` 是一个专业的奇门遁甲排盘工具，支持：

- 奇门遁甲排盘（九宫、天盘、地盘、人盘、神盘）
- 多种起局方法（拆补法、置闰法、茅山法）
- 多流派支持（转盘奇门、飞盘奇门）
- 格局识别（吉格、凶格）

## 安装

```bash
npm install qimen-skill
```

## 快速开始

```typescript
import { paiPan, formatResult } from 'qimen-skill';

// 输入时间（公历）
const time = {
  year: 2024,
  month: 12,
  day: 21,
  hour: 10,
};

// 获取排盘结果
const result = paiPan(time);

// 获取格式化输出
const output = formatResult(result);
console.log(output);
```

## API文档

### paiPan(time, options?)

计算奇门遁甲排盘，返回完整的排盘结果对象。

```typescript
const result = paiPan({
  year: 2024,   // 公历年份
  month: 12,    // 公历月份（1-12）
  day: 21,      // 公历日期（1-31）
  hour: 10,     // 小时（0-23）
  minute?: 0,   // 分钟（可选）
}, {
  method?: '拆补法',      // 起局方法：拆补法、置闰法、茅山法
  school?: '转盘奇门',    // 流派：转盘奇门、飞盘奇门
});
```

### paiPanInteractive(year, month, day, hour, method, school)

交互式排盘，返回格式化字符串（供Claude Skill使用）。

```typescript
const output = paiPanInteractive(
  2024, 12, 21, 10,     // 年月日时
  '拆补法',             // 起局方法
  '转盘奇门'            // 流派
);
```

## 排盘结果结构

```typescript
interface QiMenResult {
  // 时间信息
  solarDate: InputTime;       // 公历日期
  lunarDate: LunarDate;       // 农历日期
  solarTerm: string;          // 当前节气

  // 局信息
  yinYang: '阳遁' | '阴遁';   // 阴阳遁
  juShu: number;              // 局数 1-9
  method: string;             // 起局方法
  school: string;             // 流派
  yuan: string;               // 上元/中元/下元

  // 关键位置
  xunShou: string;            // 旬首
  zhiFuXing: string;          // 值符星
  zhiFuPosition: number;      // 值符所在宫
  zhiShiMen: string;          // 值使门
  zhiShiPosition: number;     // 值使所在宫

  // 九宫数据
  palaces: Palace[];          // 九宫格详细信息

  // 格局
  jiGe: string[];             // 吉格列表
  xiongGe: string[];          // 凶格列表
}
```

## 九宫格信息

每个宫位包含：

```typescript
interface Palace {
  index: number;          // 宫位索引 1-9
  bagua: string;          // 八卦名称
  dizhi: string;          // 地支
  diPan: string;          // 地盘三奇六仪
  tianPan: string;        // 天盘三奇六仪
  xing: string;           // 九星
  men: string;            // 八门
  shen: string;           // 八神
  patterns: string[];     // 本宫格局
}
```

## 支持的格局

### 吉格
- 青龙返首（戊+丙）
- 飞鸟跌穴（丙+戊）
- 天遁（丙+丁，生门）
- 地遁（乙+己，开门）
- 人遁（丁+乙，休门）
- 神遁、鬼遁、风遁、云遁、龙遁、虎遁

### 凶格
- 伏吟、反吟
- 六仪击刑
- 门迫
- 六仪入墓
- 五不遇时
- 悖格、刑格
- 天乙伏宫、天乙飞宫
- 荧惑入白、白入荧
- 腾蛇夭矫、朱雀投江

## 项目结构

```
qimen-skill/
├── src/
│   ├── index.ts           # 主入口
│   ├── types/             # 类型定义
│   ├── data/              # 基础数据
│   │   ├── jieqi.ts       # 节气与局数
│   │   ├── star.ts        # 九星数据
│   │   ├── door.ts        # 八门数据
│   │   ├── god.ts         # 八神数据
│   │   └── index.ts       # 基础数据
│   ├── core/              # 核心算法
│   │   ├── ju.ts          # 定局数
│   │   ├── zhuanpan.ts    # 转盘排布
│   │   ├── feipan.ts      # 飞盘排布
│   │   └── pattern.ts     # 格局识别
│   └── utils/             # 工具函数
│       └── time.ts        # 时间转换
├── tests/                 # 测试用例
├── package.json
├── tsconfig.json
└── README.md
```

## 开发

```bash
# 安装依赖
npm install

# 运行测试
npm test

# 运行测试并生成覆盖率报告
npm run test:coverage

# 构建项目
npm run build
```

## 测试

```bash
npm test
```

测试覆盖率要求：
- 分支覆盖率 > 80%
- 函数覆盖率 > 80%
- 行覆盖率 > 80%

## 许可证

MIT

## 参考资料

- 《奇门遁甲统宗》
- 《奇门遁甲秘笈全书》
- 《御定奇门宝鉴》
