// 输出详情组件

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DISPLAY_LABELS } from '@/data/cases';
import type { InferenceResult } from '@/types';

interface OutputDetailsProps {
  result: InferenceResult;
}

export function OutputDetails({ result }: OutputDetailsProps) {
  const wm = result.working_memory;

  const formatValue = (key: string, value: any): string => {
    if (value === undefined || value === null) return '-';
    if (typeof value === 'number') {
      if (key === 'material_yield' || key === 'deformation_rate' || key === 'riser_cut_ratio') {
        return `${(value * 100).toFixed(0)}%`;
      }
      if (key === 'quality_risk') return value.toFixed(3);
      return value.toString();
    }
    if (Array.isArray(value)) return value.join(' → ');
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  const keyOutputs = [
    'route_template', 'process_seq', 'heat_count', 'heat_1_ops', 'heat_2_ops', 'heat_3_ops', 'heat_4_ops',
    'heat_temp_range', 'finish_temp_min', 'recommended_press', 'soak_time_formula',
    'quality_risk', 'material_yield', 'cycle_days', 'process_flag'
  ];

  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-slate-500 text-white text-xs flex items-center justify-center">3</span>
          推荐输出详情
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="key" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="key">关键输出</TabsTrigger>
            <TabsTrigger value="all">全部字段</TabsTrigger>
            <TabsTrigger value="rules">命中规则</TabsTrigger>
          </TabsList>
          
          <TabsContent value="key" className="mt-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/3">输出项</TableHead>
                    <TableHead>值</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {keyOutputs.map(key => {
                    if (wm[key] === undefined) return null;
                    return (
                      <TableRow key={key}>
                        <TableCell className="font-medium text-slate-600">{DISPLAY_LABELS[key] || key}</TableCell>
                        <TableCell>{formatValue(key, wm[key])}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="all" className="mt-4">
            <div className="rounded-md border max-h-80 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/3">字段</TableHead>
                    <TableHead>值</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(wm)
                    .filter(([key]) => !key.startsWith('_'))
                    .map(([key, value]) => (
                      <TableRow key={key}>
                        <TableCell className="font-medium text-slate-600">{DISPLAY_LABELS[key] || key}</TableCell>
                        <TableCell className="font-mono text-sm">{formatValue(key, value)}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="rules" className="mt-4">
            <div className="space-y-2 max-h-80 overflow-auto">
              {result.fired_rules.map((rule, idx) => (
                <div key={rule.rule_id} className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-muted-foreground">#{idx + 1}</span>
                    <Badge variant={rule.layer === 'CONSTRAINT' ? 'destructive' : 'secondary'} className="text-xs">
                      {rule.layer}
                    </Badge>
                    <span className="font-medium text-sm">[{rule.rule_id}] {rule.name}</span>
                  </div>
                  <div className="text-xs text-muted-foreground ml-6">
                    置信度: {rule.confidence} | 来源: {rule.source}
                  </div>
                  {rule.actions.map((action, aidx) => (
                    <div key={aidx} className="ml-6 mt-1 text-xs">
                      <span className="text-slate-500">→ {DISPLAY_LABELS[action.key] || action.key} = </span>
                      <span className="font-mono">{formatValue(action.key, action.value)}</span>
                      {action.explanation && (
                        <span className="text-slate-400 ml-2">({action.explanation})</span>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
