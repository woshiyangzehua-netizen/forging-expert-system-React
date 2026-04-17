// 锻件工艺专家系统 - 类型定义

// 条件操作符
export type Operator = '==' | '!=' | '>' | '<' | '>=' | '<=' | 'in' | 'not_in' | 'contains';

// 条件
export interface Condition {
  field: string;
  operator: Operator;
  value: any;
}

// 动作
export interface Action {
  key: string;
  value: any;
  explanation: string;
}

// 规则
export interface Rule {
  rule_id: string;
  name: string;
  layer: 'CONSTRAINT' | 'L1' | 'L2' | 'L3';
  conditions: Condition[];
  actions: Action[];
  confidence: number;
  priority: number;
  source: string;
  enabled: boolean;
}

// 策略
export interface RouteStrategy {
  name: string;
  label: 'A' | 'B' | 'C';
  weight_bias: Record<string, number>;
  description: string;
}

// 推理结果
export interface InferenceResult {
  strategy: RouteStrategy;
  working_memory: Record<string, any>;
  fired_rules: Rule[];
  elapsed_ms: number;
  confidence: number;
}

// 产品案例
export interface ProductCase {
  _name: string;
  product_type: string;
  material: string;
  weight_kg: number;
  max_diameter: number;
  total_length: number;
  forging_ratio: number;
  quality_grade: string;
  finish_temp: number;
  required_press_ton: number;
  material_yield: number;
  cycle_days: number;
  [key: string]: any;
}

// TOPSIS评分结果
export interface ScoredResult {
  score: number;
  result: InferenceResult;
}

// 选项配置
export interface SelectOption {
  value: string;
  label: string;
}
