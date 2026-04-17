// 规则库展示组件

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RULES } from '@/data/rules';

const LAYER_COLORS: Record<string, string> = {
  CONSTRAINT: 'bg-red-100 text-red-700 border-red-200',
  L1: 'bg-blue-100 text-blue-700 border-blue-200',
  L2: 'bg-amber-100 text-amber-700 border-amber-200',
  L3: 'bg-green-100 text-green-700 border-green-200'
};

export function RuleLibrary() {
  // 统计各层级规则数量
  const layerStats = RULES.reduce((acc, rule) => {
    acc[rule.layer] = (acc[rule.layer] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Alpha节点统计
  const alphaNodes = new Map<string, Set<string>>();
  RULES.forEach(rule => {
    rule.conditions.forEach(cond => {
      const key = `${cond.field}__${cond.operator}`;
      if (!alphaNodes.has(key)) {
        alphaNodes.set(key, new Set());
      }
      alphaNodes.get(key)!.add(rule.rule_id);
    });
  });

  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-slate-500 text-white text-xs flex items-center justify-center">2</span>
          规则库与Rete网络
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="summary">概览</TabsTrigger>
            <TabsTrigger value="rules">规则列表</TabsTrigger>
            <TabsTrigger value="alpha">Alpha节点</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="mt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(layerStats).map(([layer, count]) => (
                <div key={layer} className={`p-4 rounded-lg border ${LAYER_COLORS[layer]}`}>
                  <div className="text-2xl font-bold">{count}</div>
                  <div className="text-sm opacity-80">
                    {layer === 'CONSTRAINT' ? '硬约束' : 
                     layer === 'L1' ? 'L1 宏观路线' :
                     layer === 'L2' ? 'L2 火次规划' : 'L3 参数计算'}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-slate-50 rounded-lg">
              <div className="text-sm text-slate-600">
                <span className="font-medium">规则总数:</span> {RULES.length} 条
              </div>
              <div className="text-sm text-slate-600 mt-1">
                <span className="font-medium">Alpha节点:</span> {alphaNodes.size} 个
              </div>
              <div className="text-sm text-slate-600 mt-1">
                <span className="font-medium">技术特点:</span> IF-AND-THEN规则、Rete网络快速匹配、冲突消解、多策略并行推理
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="rules" className="mt-4">
            <div className="rounded-md border max-h-96 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">ID</TableHead>
                    <TableHead>名称</TableHead>
                    <TableHead className="w-24">层级</TableHead>
                    <TableHead className="w-20">优先级</TableHead>
                    <TableHead className="w-20">置信度</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {RULES.map(rule => (
                    <TableRow key={rule.rule_id} className="cursor-pointer hover:bg-slate-50">
                      <TableCell className="font-mono text-xs">{rule.rule_id}</TableCell>
                      <TableCell className="text-sm">{rule.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-xs ${LAYER_COLORS[rule.layer]}`}>
                          {rule.layer}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{rule.priority}</TableCell>
                      <TableCell className="text-sm">{rule.confidence}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="alpha" className="mt-4">
            <div className="rounded-md border max-h-96 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Alpha节点</TableHead>
                    <TableHead>字段</TableHead>
                    <TableHead>操作符</TableHead>
                    <TableHead>关联规则数</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from(alphaNodes.entries())
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([key, rules]) => {
                      const [field, operator] = key.split('__');
                      return (
                        <TableRow key={key}>
                          <TableCell className="font-mono text-xs">{key}</TableCell>
                          <TableCell className="text-sm">{field}</TableCell>
                          <TableCell className="text-sm">{operator}</TableCell>
                          <TableCell className="text-sm">{rules.size}</TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
