import { paiPan, formatResult, paiPanInteractive } from '../src';
import { InputTime } from '../src/types';

describe('奇门遁甲排盘测试', () => {
  describe('基础功能测试', () => {
    test('基本排盘', () => {
      const time: InputTime = {
        year: 2024,
        month: 12,
        day: 21,
        hour: 0,
      };

      const result = paiPan(time);

      expect(result).toBeDefined();
      expect(result.yinYang).toBeDefined();
      expect(result.juShu).toBeGreaterThanOrEqual(1);
      expect(result.juShu).toBeLessThanOrEqual(9);
      expect(result.palaces).toHaveLength(9);
    });

    test('冬至排盘 - 阳遁', () => {
      const time: InputTime = {
        year: 2024,
        month: 12,
        day: 21,
        hour: 0,
      };

      const result = paiPan(time, { method: '拆补法' });

      expect(result.solarTerm).toBe('冬至');
      expect(result.yinYang).toBe('阳遁');
      expect(result.palaces.length).toBe(9);

      // 验证每个宫位都有基本数据
      for (const palace of result.palaces) {
        expect(palace.index).toBeGreaterThanOrEqual(1);
        expect(palace.index).toBeLessThanOrEqual(9);
        expect(palace.diPan).toBeDefined();
      }
    });

    test('夏至排盘 - 阴遁', () => {
      const time: InputTime = {
        year: 2024,
        month: 6,
        day: 21,
        hour: 0,
      };

      const result = paiPan(time, { method: '拆补法' });

      expect(result.solarTerm).toBe('夏至');
      expect(result.yinYang).toBe('阴遁');
    });
  });

  describe('起局方法测试', () => {
    test('拆补法', () => {
      const time: InputTime = {
        year: 2024,
        month: 12,
        day: 21,
        hour: 0,
      };

      const result = paiPan(time, { method: '拆补法' });
      expect(result.method).toBe('拆补法');
    });

    test('茅山法', () => {
      const time: InputTime = {
        year: 2024,
        month: 12,
        day: 21,
        hour: 0,
      };

      const result = paiPan(time, { method: '茅山法' });
      expect(result.method).toBe('茅山法');
    });
  });

  describe('流派测试', () => {
    test('转盘奇门', () => {
      const time: InputTime = {
        year: 2024,
        month: 12,
        day: 21,
        hour: 0,
      };

      const result = paiPan(time, { school: '转盘奇门' });
      expect(result.school).toBe('转盘奇门');
      expect(result.palaces.length).toBe(9);
    });

    test('飞盘奇门', () => {
      const time: InputTime = {
        year: 2024,
        month: 12,
        day: 21,
        hour: 0,
      };

      const result = paiPan(time, { school: '飞盘奇门' });
      expect(result.school).toBe('飞盘奇门');
      expect(result.palaces.length).toBe(9);
    });
  });

  describe('格局识别测试', () => {
    test('识别吉格', () => {
      const time: InputTime = {
        year: 2024,
        month: 12,
        day: 21,
        hour: 10,
      };

      const result = paiPan(time);

      // 格局字段存在
      expect(result.jiGe).toBeDefined();
      expect(Array.isArray(result.jiGe)).toBe(true);
    });

    test('识别凶格', () => {
      const time: InputTime = {
        year: 2024,
        month: 12,
        day: 21,
        hour: 22,
      };

      const result = paiPan(time);

      expect(result.xiongGe).toBeDefined();
      expect(Array.isArray(result.xiongGe)).toBe(true);
    });
  });

  describe('格式化输出测试', () => {
    test('formatResult', () => {
      const time: InputTime = {
        year: 2024,
        month: 12,
        day: 21,
        hour: 0,
      };

      const result = paiPan(time);
      const formatted = formatResult(result);

      expect(formatted).toContain('奇门遁甲排盘');
      expect(formatted).toContain(result.solarTerm);
      expect(formatted).toContain(result.yinYang);
    });
  });

  describe('交互式排盘测试', () => {
    test('paiPanInteractive', () => {
      const result = paiPanInteractive(2024, 12, 21, 0, '拆补法', '转盘奇门');

      expect(result).toContain('奇门遁甲排盘');
      expect(result).toContain('冬至');
    });
  });

  describe('边界测试', () => {
    test('子时排盘', () => {
      const time: InputTime = {
        year: 2024,
        month: 12,
        day: 21,
        hour: 0,
      };

      const result = paiPan(time);
      expect(result.hourGanZhi).toContain('子');
    });

    test('午时排盘', () => {
      const time: InputTime = {
        year: 2024,
        month: 12,
        day: 21,
        hour: 12,
      };

      const result = paiPan(time);
      expect(result.hourGanZhi).toContain('午');
    });
  });
});
