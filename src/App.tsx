// 锻件工艺专家系统 - 主应用

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InputForm } from '@/components/InputForm';
import { ResultCards } from '@/components/ResultCards';
import { OutputDetails } from '@/components/OutputDetails';
import { RuleLibrary } from '@/components/RuleLibrary';
import { inferAll, topsisEvaluate } from '@/lib/expertSystem';
import { RULES } from '@/data/rules';
import { PRODUCT_CASES } from '@/data/cases';
import type { ProductCase, InferenceResult, ScoredResult } from '@/types';
import { Play, RotateCcw, BookOpen, Cpu, Scale, GitBranch, Lightbulb } from 'lucide-react';

function App() {
  const [selectedCase, setSelectedCase] = useState<string>('case_1_rotor');
  const [fact, setFact] = useState<ProductCase>(PRODUCT_CASES.case_1_rotor);
  const [results, setResults] = useState<InferenceResult[] | null>(null);
  const [scored, setScored] = useState<ScoredResult[] | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleRunInference = () => {
    setIsRunning(true);
    // 模拟异步推理
    setTimeout(() => {
      const inferenceResults = inferAll(fact, RULES);
      const scoredResults = topsisEvaluate(inferenceResults);
      setResults(inferenceResults);
      setScored(scoredResults);
      setIsRunning(false);
    }, 100);
  };

  const handleReset = () => {
    setResults(null);
    setScored(null);
  };

  const bestResult = scored?.[0]?.result;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f1e8] via-[#faf8f3] to-[#f0ebe0]">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-amber-200/30 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-xl shadow-lg">
                ⚙️
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">锻件工艺专家系统</h1>
                <p className="text-xs text-slate-500">技术路线验证原型 - 多目标工艺路线推理引擎</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-amber-50 border-amber-200">
                <BookOpen className="w-3 h-3 mr-1" />
                {RULES.length} 条规则
              </Badge>
              <Badge variant="outline" className="bg-blue-50 border-blue-200">
                <GitBranch className="w-3 h-3 mr-1" />
                Rete网络
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* 四大技术特点 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <TechCard 
            num="01" 
            title="规则库表达" 
            desc="IF-AND-THEN 规则结构，支持条件评估与动作执行"
            icon={<BookOpen className="w-4 h-4" />}
            color="amber"
          />
          <TechCard 
            num="02" 
            title="Rete快速匹配" 
            desc="Alpha节点预编译，高效筛选候选规则"
            icon={<Cpu className="w-4 h-4" />}
            color="blue"
          />
          <TechCard 
            num="03" 
            title="冲突消解" 
            desc="层级、优先级、置信度综合评分机制"
            icon={<Scale className="w-4 h-4" />}
            color="purple"
          />
          <TechCard 
            num="04" 
            title="多策略并行" 
            desc="材料/质量/工期三导向方案并行生成"
            icon={<GitBranch className="w-4 h-4" />}
            color="green"
          />
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* 左侧：输入 */}
          <div className="lg:col-span-4 space-y-4">
            <InputForm 
              value={fact} 
              onChange={setFact} 
              selectedCase={selectedCase}
              onCaseChange={setSelectedCase}
            />
            
            {/* 运行按钮 */}
            <div className="flex gap-2">
              <Button 
                onClick={handleRunInference} 
                disabled={isRunning}
                className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg"
              >
                <Play className="w-4 h-4 mr-2" />
                {isRunning ? '推理中...' : '开始推理'}
              </Button>
              {results && (
                <Button variant="outline" onClick={handleReset}>
                  <RotateCcw className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {/* 右侧：结果 */}
          <div className="lg:col-span-8 space-y-4">
            {results && scored ? (
              <Tabs defaultValue="results" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="results">方案结果</TabsTrigger>
                  <TabsTrigger value="details">输出详情</TabsTrigger>
                  <TabsTrigger value="rules">规则库</TabsTrigger>
                </TabsList>
                
                <TabsContent value="results" className="mt-4">
                  <ResultCards scored={scored} />
                </TabsContent>
                
                <TabsContent value="details" className="mt-4">
                  {bestResult && <OutputDetails result={bestResult} />}
                </TabsContent>
                
                <TabsContent value="rules" className="mt-4">
                  <RuleLibrary />
                </TabsContent>
              </Tabs>
            ) : (
              <Card className="border-dashed border-2 border-slate-200 bg-slate-50/50">
                <CardContent className="py-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                    <Lightbulb className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-700 mb-2">准备就绪</h3>
                  <p className="text-sm text-slate-500 max-w-md mx-auto mb-4">
                    选择或输入锻件案例参数，点击"开始推理"按钮，
                    系统将基于规则库进行多策略并行推理，并给出最优工艺方案推荐。
                  </p>
                  <div className="flex justify-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      材料导向
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      质量导向
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      工期导向
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/50 mt-8">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <p className="text-center text-xs text-slate-400">
            锻件工艺专家系统技术路线验证 | 基于规则引擎的智能工艺推荐
          </p>
        </div>
      </footer>
    </div>
  );
}

function TechCard({ num, title, desc, icon, color }: { 
  num: string; 
  title: string; 
  desc: string; 
  icon: React.ReactNode;
  color: 'amber' | 'blue' | 'purple' | 'green';
}) {
  const colorClasses = {
    amber: 'from-amber-50 to-amber-100/50 border-amber-200',
    blue: 'from-blue-50 to-blue-100/50 border-blue-200',
    purple: 'from-purple-50 to-purple-100/50 border-purple-200',
    green: 'from-emerald-50 to-emerald-100/50 border-emerald-200'
  };

  const numColors = {
    amber: 'text-amber-600',
    blue: 'text-blue-600',
    purple: 'text-purple-600',
    green: 'text-emerald-600'
  };

  return (
    <div className={`p-4 rounded-xl border bg-gradient-to-br ${colorClasses[color]} hover:shadow-md transition-shadow`}>
      <div className="flex items-center gap-2 mb-2">
        <span className={`text-xs font-bold ${numColors[color]}`}>{num}</span>
        {icon}
      </div>
      <h3 className="font-semibold text-sm text-slate-800 mb-1">{title}</h3>
      <p className="text-xs text-slate-600 leading-relaxed">{desc}</p>
    </div>
  );
}

export default App;
