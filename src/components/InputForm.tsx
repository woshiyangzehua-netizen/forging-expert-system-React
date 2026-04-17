// 输入表单组件

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { PRODUCT_CASES, PRODUCT_TYPE_OPTIONS, MATERIAL_OPTIONS, QUALITY_GRADE_OPTIONS } from '@/data/cases';
import type { ProductCase } from '@/types';

interface InputFormProps {
  value: ProductCase;
  onChange: (value: ProductCase) => void;
  selectedCase: string;
  onCaseChange: (caseKey: string) => void;
}

export function InputForm({ value, onChange, selectedCase, onCaseChange }: InputFormProps) {

  const handleCaseSelect = (caseKey: string) => {
    onCaseChange(caseKey);
    if (caseKey !== 'custom') {
      onChange({ ...PRODUCT_CASES[caseKey] });
    }
  };

  const updateField = (field: keyof ProductCase, val: any) => {
    onChange({ ...value, [field]: val });
  };

  return (
    <Card className="border-amber-200/50 bg-gradient-to-br from-white to-amber-50/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs flex items-center justify-center">1</span>
          案例输入
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 案例选择 */}
        <div className="space-y-2">
          <Label>选择案例</Label>
          <Select value={selectedCase} onValueChange={handleCaseSelect}>
            <SelectTrigger className="bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="case_1_rotor">百万千瓦核电低压转子</SelectItem>
              <SelectItem value="case_2_roll">轧机支撑辊</SelectItem>
              <SelectItem value="case_3_pipe">核电主管道</SelectItem>
              <SelectItem value="custom">自定义案例</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 案例名称 */}
        <div className="space-y-2">
          <Label>案例名称</Label>
          <Input
            value={value._name}
            onChange={(e) => updateField('_name', e.target.value)}
            className="bg-white"
            placeholder="输入案例名称"
          />
        </div>

        {/* 产品类型 */}
        <div className="space-y-2">
          <Label>产品类型</Label>
          <Select value={value.product_type} onValueChange={(v) => updateField('product_type', v)}>
            <SelectTrigger className="bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRODUCT_TYPE_OPTIONS.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 材料牌号 */}
        <div className="space-y-2">
          <Label>材料牌号</Label>
          <Select value={value.material} onValueChange={(v) => updateField('material', v)}>
            <SelectTrigger className="bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MATERIAL_OPTIONS.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 质量等级 */}
        <div className="space-y-2">
          <Label>质量等级</Label>
          <Select value={value.quality_grade} onValueChange={(v) => updateField('quality_grade', v)}>
            <SelectTrigger className="bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {QUALITY_GRADE_OPTIONS.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 数值输入 */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>锻件重量(kg)</Label>
            <Input
              type="number"
              value={value.weight_kg}
              onChange={(e) => updateField('weight_kg', Number(e.target.value))}
              className="bg-white"
              min={1000}
              step={1000}
            />
          </div>
          <div className="space-y-2">
            <Label>最大直径(mm)</Label>
            <Input
              type="number"
              value={value.max_diameter}
              onChange={(e) => updateField('max_diameter', Number(e.target.value))}
              className="bg-white"
              min={100}
              step={50}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>总长度(mm)</Label>
            <Input
              type="number"
              value={value.total_length}
              onChange={(e) => updateField('total_length', Number(e.target.value))}
              className="bg-white"
              min={100}
              step={100}
            />
          </div>
          <div className="space-y-2">
            <Label>锻造比</Label>
            <Input
              type="number"
              value={value.forging_ratio}
              onChange={(e) => updateField('forging_ratio', Number(e.target.value))}
              className="bg-white"
              min={1}
              step={0.1}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>终锻温度(°C)</Label>
            <Input
              type="number"
              value={value.finish_temp}
              onChange={(e) => updateField('finish_temp', Number(e.target.value))}
              className="bg-white"
              min={600}
              step={10}
            />
          </div>
          <div className="space-y-2">
            <Label>设备需求吨位(t)</Label>
            <Input
              type="number"
              value={value.required_press_ton}
              onChange={(e) => updateField('required_press_ton', Number(e.target.value))}
              className="bg-white"
              min={1000}
              step={500}
            />
          </div>
        </div>

        {/* 滑块 */}
        <div className="space-y-3 pt-2">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>材料利用率</Label>
              <span className="text-sm text-muted-foreground">{(value.material_yield * 100).toFixed(0)}%</span>
            </div>
            <Slider
              value={[value.material_yield]}
              onValueChange={([v]) => updateField('material_yield', v)}
              min={0.5}
              max={0.95}
              step={0.01}
              className="py-2"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>计划周期(天)</Label>
              <span className="text-sm text-muted-foreground">{value.cycle_days}天</span>
            </div>
            <Slider
              value={[value.cycle_days]}
              onValueChange={([v]) => updateField('cycle_days', v)}
              min={20}
              max={140}
              step={5}
              className="py-2"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
