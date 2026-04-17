// 锻件工艺专家系统核心逻辑

import type { Condition, Rule, RouteStrategy, InferenceResult, ScoredResult, Operator } from '@/types';

// ═══════════════════════════════════════════════════════════════════
//  一、规则库数据结构与知识表达式
// ═══════════════════════════════════════════════════════════════════

// 条件评估
export function evaluateCondition(condition: Condition, fact: Record<string, any>): boolean {
  const actual = fact[condition.field];
  if (actual === undefined || actual === null) return false;
  
  const ops: Record<Operator, (a: any, v: any) => boolean> = {
    '==': (a, v) => a == v,
    '!=': (a, v) => a != v,
    '>': (a, v) => a > v,
    '<': (a, v) => a < v,
    '>=': (a, v) => a >= v,
    '<=': (a, v) => a <= v,
    'in': (a, v) => v.includes(a),
    'not_in': (a, v) => !v.includes(a),
    'contains': (a, v) => a.includes(v),
  };
  
  const fn = ops[condition.operator];
  if (!fn) throw new Error(`未知运算符: ${condition.operator}`);
  
  try {
    return fn(actual, condition.value);
  } catch {
    return false;
  }
}

// 规则匹配
export function matchRule(rule: Rule, fact: Record<string, any>): boolean {
  return rule.conditions.every(c => evaluateCondition(c, fact));
}

// 规则触发
export function fireRule(rule: Rule, workingMemory: Record<string, any>): void {
  for (const action of rule.actions) {
    workingMemory[action.key] = action.value;
  }
}

// 计算规则得分
export function calculateRuleScore(rule: Rule): number {
  const layerBonus: Record<string, number> = { CONSTRAINT: 1000, L1: 3, L2: 2, L3: 1 };
  return (layerBonus[rule.layer] || 1) * rule.priority * rule.confidence;
}

// ═══════════════════════════════════════════════════════════════════
//  二、Rete 网络（简化实现）
// ═══════════════════════════════════════════════════════════════════

interface AlphaNode {
  field: string;
  operator: string;
  rules: Rule[];
}

export class ReteNetwork {
  alphaNodes: Map<string, AlphaNode> = new Map();
  allRules: Rule[] = [];

  compile(rules: Rule[]) {
    this.allRules = rules.filter(r => r.enabled);
    this.alphaNodes.clear();

    for (const rule of this.allRules) {
      for (const cond of rule.conditions) {
        const key = `${cond.field}__${cond.operator}`;
        if (!this.alphaNodes.has(key)) {
          this.alphaNodes.set(key, { field: cond.field, operator: cond.operator, rules: [] });
        }
        this.alphaNodes.get(key)!.rules.push(rule);
      }
    }
  }

  propagate(fact: Record<string, any>): Rule[] {
    const seen = new Set<string>();
    const agenda: Rule[] = [];
    
    for (const rule of this.allRules) {
      if (!seen.has(rule.rule_id) && matchRule(rule, fact)) {
        seen.add(rule.rule_id);
        agenda.push(rule);
      }
    }
    return agenda;
  }
}

// ═══════════════════════════════════════════════════════════════════
//  三、冲突消解策略
// ═══════════════════════════════════════════════════════════════════

export class ConflictResolver {
  resolve(agenda: Rule[]): Rule[] {
    if (!agenda.length) return [];

    const constraints = agenda.filter(r => r.layer === 'CONSTRAINT');
    const others = agenda.filter(r => r.layer !== 'CONSTRAINT');

    const conflictGroups = this.groupConflicts(others);
    const resolvedOthers: Rule[] = [];

    for (const [_, group] of Object.entries(conflictGroups)) {
      if (group.length === 1) {
        resolvedOthers.push(group[0]);
      } else {
        const winner = this.pickWinner(group);
        resolvedOthers.push(winner);
      }
    }

    const final = [...constraints, ...resolvedOthers];
    final.sort((a, b) => calculateRuleScore(b) - calculateRuleScore(a));

    return final;
  }

  private groupConflicts(rules: Rule[]): Record<string, Rule[]> {
    const groups: Record<string, Rule[]> = {};
    for (const rule of rules) {
      for (const action of rule.actions) {
        if (!groups[action.key]) groups[action.key] = [];
        groups[action.key].push(rule);
      }
    }
    return groups;
  }

  private pickWinner(group: Rule[]): Rule {
    return [...group].sort((a, b) => {
      const scoreDiff = calculateRuleScore(b) - calculateRuleScore(a);
      if (scoreDiff !== 0) return scoreDiff;
      return a.rule_id.localeCompare(b.rule_id);
    })[0];
  }
}

// ═══════════════════════════════════════════════════════════════════
//  四、多方案并行推理引擎
// ═══════════════════════════════════════════════════════════════════

export const STRATEGIES: RouteStrategy[] = [
  {
    name: '材料利用率导向',
    label: 'A',
    weight_bias: { R_MAT_OPT: 1.8, R_QUALITY_GUARD: 0.6, R_CYCLE_OPT: 0.5 },
    description: '激进锭型选择，冒口切除比最小化，材料利用率最大化'
  },
  {
    name: '质量保证导向',
    label: 'B',
    weight_bias: { R_QUALITY_GUARD: 2.0, R_MAT_OPT: 0.4, R_CYCLE_OPT: 0.3 },
    description: '增加火次数，保守变形量，降低内部缺陷风险'
  },
  {
    name: '工期导向',
    label: 'C',
    weight_bias: { R_CYCLE_OPT: 2.0, R_QUALITY_GUARD: 0.5, R_MAT_OPT: 0.8 },
    description: '合并工序，压缩火次，交货周期最短'
  }
];

const STRATEGY_SEEDS: Record<string, Record<string, any>> = {
  A: { material_yield: 0.75, quality_risk: 0.20, cycle_days_bias: 0 },
  B: { material_yield: 0.80, quality_risk: 0.25, heat_count_min: 4 },
  C: { material_yield: 0.82, quality_risk: 0.18, cycle_days: 100 }
};

export function inferSingle(
  fact: Record<string, any>,
  strategy: RouteStrategy,
  baseRules: Rule[]
): InferenceResult {
  const startTime = performance.now();

  // 克隆规则并应用策略权重
  const rules: Rule[] = baseRules.map(rule => ({
    ...rule,
    priority: Math.round(rule.priority * (strategy.weight_bias[rule.rule_id] || 1))
  }));

  // 构建Rete网络
  const rete = new ReteNetwork();
  rete.compile(rules);

  // 注入策略种子
  const wm: Record<string, any> = { ...fact };
  const seeds = STRATEGY_SEEDS[strategy.label] || {};
  Object.assign(wm, seeds);

  // 传播事实
  const agenda = rete.propagate(wm);
  const resolver = new ConflictResolver();
  const resolved = resolver.resolve(agenda);

  // 触发规则
  const fired: Rule[] = [];
  for (const rule of resolved) {
    fireRule(rule, wm);
    fired.push(rule);
  }

  // 计算综合置信度
  let conf = 1.0;
  for (const r of fired) conf *= r.confidence;
  conf = Math.round(conf * 10000) / 10000;

  const elapsed = performance.now() - startTime;

  return {
    strategy,
    working_memory: wm,
    fired_rules: fired,
    elapsed_ms: elapsed,
    confidence: conf
  };
}

export function inferAll(fact: Record<string, any>, baseRules: Rule[]): InferenceResult[] {
  return STRATEGIES.map(s => inferSingle(fact, s, baseRules));
}

// ═══════════════════════════════════════════════════════════════════
//  五、TOPSIS 多目标综合评价
// ═══════════════════════════════════════════════════════════════════

export function topsisEvaluate(results: InferenceResult[]): ScoredResult[] {
  const weights: Record<string, [number, 'max' | 'min']> = {
    material_yield: [0.30, 'max'],
    heat_count: [0.25, 'min'],
    quality_risk: [0.25, 'min'],
    cycle_days: [0.15, 'min'],
    confidence: [0.05, 'max']
  };

  const getVal = (r: InferenceResult, key: string): number => {
    if (key === 'confidence') return r.confidence;
    return Number(r.working_memory[key] || 0);
  };

  // 构建决策矩阵
  const matrix: Record<string, number[]> = {};
  for (const key of Object.keys(weights)) {
    matrix[key] = results.map(r => getVal(r, key));
  }

  // 归一化
  const norm: Record<string, number[]> = {};
  for (const [key, vals] of Object.entries(matrix)) {
    const denom = Math.sqrt(vals.reduce((sum, v) => sum + v * v, 0)) || 1e-9;
    norm[key] = vals.map(v => v / denom);
  }

  // 加权
  const weighted: Record<string, number[]> = {};
  for (const [key, [w, _]] of Object.entries(weights)) {
    weighted[key] = norm[key].map(v => v * w);
  }

  // 理想解 & 负理想解
  const idealPos: Record<string, number> = {};
  const idealNeg: Record<string, number> = {};
  for (const [key, [_, direction]] of Object.entries(weights)) {
    const vals = weighted[key];
    if (direction === 'max') {
      idealPos[key] = Math.max(...vals);
      idealNeg[key] = Math.min(...vals);
    } else {
      idealPos[key] = Math.min(...vals);
      idealNeg[key] = Math.max(...vals);
    }
  }

  // 计算与理想解距离
  const scored: ScoredResult[] = [];
  for (let i = 0; i < results.length; i++) {
    let dPos = 0, dNeg = 0;
    for (const key of Object.keys(weights)) {
      dPos += Math.pow(weighted[key][i] - idealPos[key], 2);
      dNeg += Math.pow(weighted[key][i] - idealNeg[key], 2);
    }
    dPos = Math.sqrt(dPos);
    dNeg = Math.sqrt(dNeg);
    const score = (dPos + dNeg) > 0 ? dNeg / (dPos + dNeg) : 0;
    scored.push({ score: Math.round(score * 10000) / 10000, result: results[i] });
  }

  return scored.sort((a, b) => b.score - a.score);
}
