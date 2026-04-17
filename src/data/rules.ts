// 锻件工艺规则库

import type { Rule } from '@/types';

export const RULES: Rule[] = [
  // ── CONSTRAINT 硬约束 ─────────────────────────────────────────
  {
    rule_id: 'C001',
    name: 'SA508最高终锻温度约束',
    layer: 'CONSTRAINT',
    priority: 1000,
    confidence: 1.0,
    source: 'ASME SA-508 §7.3',
    enabled: true,
    conditions: [
      { field: 'material', operator: '==', value: 'SA508Gr3' },
      { field: 'finish_temp', operator: '<', value: 850 }
    ],
    actions: [
      { key: 'process_flag', value: 'STOP_FORGE', explanation: '终锻温度低于850℃，必须停锻回炉，否则产生脆裂' }
    ]
  },
  {
    rule_id: 'C002',
    name: '设备吨位不足约束',
    layer: 'CONSTRAINT',
    priority: 1000,
    confidence: 1.0,
    source: '设备能力手册',
    enabled: true,
    conditions: [
      { field: 'required_press_ton', operator: '>', value: 12500 }
    ],
    actions: [
      { key: 'process_flag', value: 'EQUIP_OVERLOAD', explanation: '超出最大压机12500t额定载荷，禁止执行' }
    ]
  },

  // ── L1 宏观工艺路线模板选择 ───────────────────────────────────
  {
    rule_id: 'L1_001',
    name: '大型电站转子 - 二次镦拔策略',
    layer: 'L1',
    priority: 120,
    confidence: 0.95,
    source: '专家访谈 ZhangWei-2024 + 《大型转子锻造规范》§4.2.3',
    enabled: true,
    conditions: [
      { field: 'product_type', operator: '==', value: '电站转子' },
      { field: 'max_diameter', operator: '>', value: 1500 },
      { field: 'forging_ratio', operator: '>=', value: 5.0 }
    ],
    actions: [
      { key: 'route_template', value: 'SHAFT_HEAVY_BIupset', explanation: '大长径比+高锻造比→选二次镦粗-拔长模板' },
      { key: 'heat_count', value: 3, explanation: '最少3火次' },
      { key: 'process_seq', value: ['镦粗', '拔长', '压痕', '镦粗', '拔长', '滚圆'], explanation: '经典二次镦拔+滚圆序列' }
    ]
  },
  {
    rule_id: 'L1_002',
    name: '大型电站转子 - 一次镦拔策略（轻量级）',
    layer: 'L1',
    priority: 100,
    confidence: 0.88,
    source: '历史案例库 Case#1892',
    enabled: true,
    conditions: [
      { field: 'product_type', operator: '==', value: '电站转子' },
      { field: 'max_diameter', operator: '<=', value: 1500 },
      { field: 'forging_ratio', operator: '>=', value: 4.0 }
    ],
    actions: [
      { key: 'route_template', value: 'SHAFT_MED_UPSET', explanation: '直径≤1500mm，一次镦拔即可满足锻造比' },
      { key: 'heat_count', value: 2, explanation: '2火次' },
      { key: 'process_seq', value: ['镦粗', '拔长', '修整'], explanation: '一次镦拔+修整' }
    ]
  },
  {
    rule_id: 'L1_003',
    name: '核电主管道 - 短粗锭挤压策略',
    layer: 'L1',
    priority: 130,
    confidence: 0.92,
    source: '核电工艺规范 NB/T 20009',
    enabled: true,
    conditions: [
      { field: 'product_type', operator: '==', value: '核电主管道' },
      { field: 'material', operator: '==', value: '316LN' }
    ],
    actions: [
      { key: 'route_template', value: 'PIPE_EXTRUSION', explanation: '奥氏体不锈钢主管道→短粗锭镦粗+冲孔+扩孔策略' },
      { key: 'heat_count', value: 4, explanation: '不锈钢需要4火次充分变形' },
      { key: 'process_seq', value: ['镦粗', '冲孔', '扩孔', '芯棒拔长', '修整'], explanation: '核级管道经典五工序' }
    ]
  },
  {
    rule_id: 'L1_004',
    name: '大型轧辊 - 宽砧拔长策略',
    layer: 'L1',
    priority: 115,
    confidence: 0.93,
    source: '《轧辊锻造工艺手册》§3.1',
    enabled: true,
    conditions: [
      { field: 'product_type', operator: '==', value: '支撑辊' },
      { field: 'weight_kg', operator: '>', value: 80000 }
    ],
    actions: [
      { key: 'route_template', value: 'ROLL_WIDE_DRAW', explanation: '重型支撑辊→宽砧强压心部压实' },
      { key: 'heat_count', value: 3, explanation: '大截面需3火次确保心部压实' },
      { key: 'process_seq', value: ['镦粗', '宽砧拔长', '压实', '精整'], explanation: '心部压实为核心目标' }
    ]
  },

  // ── L2 火次与工序规划 ─────────────────────────────────────────
  {
    rule_id: 'R_QUALITY_GUARD',
    name: '高质量要求 - 增加火次',
    layer: 'L2',
    priority: 90,
    confidence: 0.91,
    source: '质量控制标准 Q/YZ-201',
    enabled: true,
    conditions: [
      { field: 'quality_grade', operator: '==', value: '核级' },
      { field: 'heat_count', operator: '<', value: 4 }
    ],
    actions: [
      { key: 'heat_count', value: 4, explanation: '核级产品强制4火次保证组织均匀性' },
      { key: 'quality_risk', value: 0.12, explanation: '增加火次后质量风险指数降至0.12' }
    ]
  },
  {
    rule_id: 'R_MAT_OPT',
    name: '激进材料优化 - 减少冒口切除',
    layer: 'L2',
    priority: 80,
    confidence: 0.87,
    source: '材料成本优化经验',
    enabled: true,
    conditions: [
      { field: 'quality_grade', operator: '!=', value: '核级' },
      { field: 'material_yield', operator: '<', value: 0.85 }
    ],
    actions: [
      { key: 'riser_cut_ratio', value: 0.18, explanation: '非核级产品冒口切除比降至18%提升利用率' },
      { key: 'material_yield', value: 0.86, explanation: '利用率提升至86%' }
    ]
  },
  {
    rule_id: 'R_CYCLE_OPT',
    name: '工期优化 - 合并工序',
    layer: 'L2',
    priority: 75,
    confidence: 0.85,
    source: '生产节拍优化',
    enabled: true,
    conditions: [
      { field: 'cycle_days', operator: '>', value: 60 },
      { field: 'quality_grade', operator: '!=', value: '核级' }
    ],
    actions: [
      { key: 'heat_count', value: 2, explanation: '合并火次缩短周期' },
      { key: 'cycle_days', value: 45, explanation: '目标周期压缩到45天' }
    ]
  },
  {
    rule_id: 'L2_HEAT3_STD',
    name: '标准3火次工序分配',
    layer: 'L2',
    priority: 60,
    confidence: 0.90,
    source: '企业标准 Q/YZ-101',
    enabled: true,
    conditions: [
      { field: 'heat_count', operator: '==', value: 3 },
      { field: 'route_template', operator: 'contains', value: 'SHAFT' }
    ],
    actions: [
      { key: 'heat_1_ops', value: ['镦粗', '拔长', '压痕'], explanation: '第1火：镦粗压实心部+初步拔长' },
      { key: 'heat_2_ops', value: ['镦粗', '拔长', '滚圆'], explanation: '第2火：二次镦粗+拔长+滚圆整形' },
      { key: 'heat_3_ops', value: ['修整', '精整'], explanation: '第3火：精整到成品尺寸' },
      { key: 'cycle_days', value: 55, explanation: '3火次标准周期55天' }
    ]
  },
  {
    rule_id: 'L2_HEAT4_NUC',
    name: '核级4火次工序分配',
    layer: 'L2',
    priority: 70,
    confidence: 0.93,
    source: '核电锻件制造规程 HAF 102',
    enabled: true,
    conditions: [
      { field: 'heat_count', operator: '==', value: 4 },
      { field: 'quality_grade', operator: '==', value: '核级' }
    ],
    actions: [
      { key: 'heat_1_ops', value: ['镦粗', '拔长'], explanation: '第1火：初始成形' },
      { key: 'heat_2_ops', value: ['镦粗', '拔长', '压痕'], explanation: '第2火：强化锻造比' },
      { key: 'heat_3_ops', value: ['镦粗', '拔长', '滚圆'], explanation: '第3火：均匀化组织' },
      { key: 'heat_4_ops', value: ['精整', '修整'], explanation: '第4火：精整到核级精度' },
      { key: 'cycle_days', value: 75, explanation: '核级4火次周期75天' },
      { key: 'quality_risk', value: 0.08, explanation: '核级4火次质量风险指数0.08' }
    ]
  },

  // ── L3 参数精细计算 ───────────────────────────────────────────
  {
    rule_id: 'L3_TEMP_SA508',
    name: 'SA508Gr3 加热温度规范',
    layer: 'L3',
    priority: 40,
    confidence: 0.96,
    source: 'ASME SA-508 + 专家经验',
    enabled: true,
    conditions: [
      { field: 'material', operator: '==', value: 'SA508Gr3' }
    ],
    actions: [
      { key: 'heat_temp_range', value: [1200, 1260], explanation: 'SA508Gr3的最优加热温度窗口' },
      { key: 'finish_temp_min', value: 900, explanation: '终锻温度下限，低于此值须回炉' },
      { key: 'deformation_rate', value: 0.30, explanation: '每火次推荐变形量30%' }
    ]
  },
  {
    rule_id: 'L3_TEMP_316LN',
    name: '316LN 奥氏体不锈钢加热规范',
    layer: 'L3',
    priority: 40,
    confidence: 0.95,
    source: '不锈钢锻造技术规范 GB/T 4232',
    enabled: true,
    conditions: [
      { field: 'material', operator: '==', value: '316LN' }
    ],
    actions: [
      { key: 'heat_temp_range', value: [1150, 1220], explanation: '316LN奥氏体区加热窗口（避免δ铁素体）' },
      { key: 'finish_temp_min', value: 950, explanation: '奥氏体不锈钢终锻温度下限更高' },
      { key: 'deformation_rate', value: 0.20, explanation: '奥氏体钢变形抗力大，单次变形量控制在20%' }
    ]
  },
  {
    rule_id: 'L3_PRESS_CALC',
    name: '压机吨位需求计算',
    layer: 'L3',
    priority: 35,
    confidence: 0.89,
    source: '金属塑性成形力学',
    enabled: true,
    conditions: [
      { field: 'max_diameter', operator: '>=', value: 1000 },
      { field: 'material', operator: 'in', value: ['SA508Gr3', '34CrNiMo6'] }
    ],
    actions: [
      { key: 'required_press_ton', value: 8000, explanation: 'σflow≈120MPa × 接触面积→约8000t' },
      { key: 'recommended_press', value: '1.2万吨水压机', explanation: '推荐设备，留30%安全余量' }
    ]
  },
  {
    rule_id: 'L3_INGOT_SELECT',
    name: '锭型优选规则',
    layer: 'L3',
    priority: 38,
    confidence: 0.90,
    source: '锭型数据库 + 材料利用率优化',
    enabled: true,
    conditions: [
      { field: 'weight_kg', operator: '>=', value: 50000 },
      { field: 'quality_grade', operator: '==', value: '电站级' }
    ],
    actions: [
      { key: 'ingot_type', value: '多棱锭', explanation: '大型电站锻件优选多棱锭，偏析带控制更好' },
      { key: 'riser_cut_ratio', value: 0.20, explanation: '多棱锭冒口切除比20%' },
      { key: 'material_yield', value: 0.83, explanation: '标准利用率83%（多棱锭优于圆锭）' },
      { key: 'quality_risk', value: 0.15, explanation: '多棱锭心部质量风险指数0.15' }
    ]
  },
  {
    rule_id: 'L3_SOAK_TIME',
    name: '保温时间计算（壁厚法则）',
    layer: 'L3',
    priority: 30,
    confidence: 0.92,
    source: '企业内控标准 §5.2.1',
    enabled: true,
    conditions: [
      { field: 'max_diameter', operator: '>', value: 800 }
    ],
    actions: [
      { key: 'soak_time_formula', value: '壁厚(mm)/25 + 2 (小时)', explanation: '经典壁厚法则，确保心部均匀透热' }
    ]
  }
];
