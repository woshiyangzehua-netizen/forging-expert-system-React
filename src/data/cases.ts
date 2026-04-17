// 测试用锻件产品数据

import type { ProductCase } from '@/types';

export const PRODUCT_CASES: Record<string, ProductCase> = {
  case_1_rotor: {
    _name: '百万千瓦核电低压转子',
    product_type: '电站转子',
    material: 'SA508Gr3',
    weight_kg: 120000,
    max_diameter: 2100,
    total_length: 5800,
    forging_ratio: 5.5,
    quality_grade: '核级',
    finish_temp: 920,
    required_press_ton: 9000,
    material_yield: 0.80,
    cycle_days: 90
  },
  case_2_roll: {
    _name: '轧机支撑辊',
    product_type: '支撑辊',
    material: '34CrNiMo6',
    weight_kg: 95000,
    max_diameter: 1800,
    total_length: 4200,
    forging_ratio: 4.8,
    quality_grade: '电站级',
    finish_temp: 880,
    required_press_ton: 8000,
    material_yield: 0.78,
    cycle_days: 80
  },
  case_3_pipe: {
    _name: '核电主管道',
    product_type: '核电主管道',
    material: '316LN',
    weight_kg: 35000,
    max_diameter: 900,
    total_length: 3200,
    forging_ratio: 6.0,
    quality_grade: '核级',
    finish_temp: 980,
    required_press_ton: 5000,
    material_yield: 0.75,
    cycle_days: 70
  }
};

// 选项配置
export const PRODUCT_TYPE_OPTIONS = [
  { value: '电站转子', label: '电站转子' },
  { value: '支撑辊', label: '支撑辊' },
  { value: '核电主管道', label: '核电主管道' }
];

export const MATERIAL_OPTIONS = [
  { value: 'SA508Gr3', label: 'SA508Gr3' },
  { value: '34CrNiMo6', label: '34CrNiMo6' },
  { value: '316LN', label: '316LN' }
];

export const QUALITY_GRADE_OPTIONS = [
  { value: '核级', label: '核级' },
  { value: '电站级', label: '电站级' }
];

// 字段显示标签
export const DISPLAY_LABELS: Record<string, string> = {
  product_type: '产品类型',
  material: '材料牌号',
  weight_kg: '锻件重量(kg)',
  max_diameter: '最大直径(mm)',
  total_length: '总长度(mm)',
  forging_ratio: '锻造比',
  quality_grade: '质量等级',
  finish_temp: '当前终锻温度(°C)',
  required_press_ton: '设备需求吨位(t)',
  material_yield: '材料利用率',
  cycle_days: '生产周期(天)',
  route_template: '工艺模板',
  heat_count: '火次',
  process_seq: '工序序列',
  heat_temp_range: '加热温度窗口(°C)',
  finish_temp_min: '终锻温度下限(°C)',
  deformation_rate: '单火次建议变形量',
  recommended_press: '推荐设备',
  ingot_type: '锭型',
  riser_cut_ratio: '冒口切除比',
  quality_risk: '质量风险指数',
  soak_time_formula: '保温时间公式',
  process_flag: '约束标志',
  heat_1_ops: '第1火工序',
  heat_2_ops: '第2火工序',
  heat_3_ops: '第3火工序',
  heat_4_ops: '第4火工序'
};
