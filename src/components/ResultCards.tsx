// 结果卡片组件

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, TrendingUp, AlertTriangle, Award } from 'lucide-react';
import type { ScoredResult } from '@/types';

interface ResultCardsProps {
  scored: ScoredResult[];
}

const STRATEGY_COLORS: Record<string, { bg: string; border: string; badge: string }> = {
  A: { bg: 'from-emerald-50 to-emerald-100/50', border: 'border-emerald-200', badge: 'bg-emerald-500' },
  B: { bg: 'from-blue-50 to-blue-100/50', border: 'border-blue-200', badge: 'bg-blue-500' },
  C: { bg: 'from-amber-50 to-amber-100/50', border: 'border-amber-200', badge: 'bg-amber-500' }
};

export function ResultCards({ scored }: ResultCardsProps) {
  const bestResult = scored[0]?.result;

  return (
    <div className="space-y-4">
      {/* 推荐方案 */}
      {bestResult && (
        <Card className="border-green-200 bg-gradient-to-br from-green-50/80 to-emerald-50/50 overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-green-600" />
                <CardTitle className="text-lg text-green-800">推荐方案</CardTitle>
              </div>
              <Badge className="bg-green-500 text-white">
                TOPSIS {scored[0].score.toFixed(4)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 mb-3">
              <span className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${STRATEGY_COLORS[bestResult.strategy.label].badge}`}>
                {bestResult.strategy.label}
              </span>
              <div>
                <div className="font-semibold text-lg">{bestResult.strategy.name}</div>
                <div className="text-sm text-muted-foreground">{bestResult.strategy.description}</div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3 mt-4">
              <MetricBox 
                label="材料利用率" 
                value={`${(bestResult.working_memory.material_yield * 100).toFixed(0)}%`}
                icon={<TrendingUp className="w-4 h-4" />}
              />
              <MetricBox 
                label="火次" 
                value={bestResult.working_memory.heat_count}
                icon={<span className="text-sm font-bold">🔥</span>}
              />
              <MetricBox 
                label="质量风险" 
                value={bestResult.working_memory.quality_risk?.toFixed(3) || '-'}
                icon={<AlertTriangle className="w-4 h-4" />}
              />
              <MetricBox 
                label="周期" 
                value={`${bestResult.working_memory.cycle_days}天`}
                icon={<Clock className="w-4 h-4" />}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* 所有方案对比 */}
      <div className="grid gap-3">
        {scored.map(({ score, result }, idx) => (
          <Card 
            key={result.strategy.label}
            className={`border ${STRATEGY_COLORS[result.strategy.label].border} bg-gradient-to-br ${STRATEGY_COLORS[result.strategy.label].bg} ${idx === 0 ? 'ring-2 ring-green-400/50' : ''}`}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${STRATEGY_COLORS[result.strategy.label].badge}`}>
                    {result.strategy.label}
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">#{idx + 1}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{result.strategy.name}</span>
                    {idx === 0 && <Badge className="bg-green-500 text-white text-xs">推荐</Badge>}
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">{result.strategy.description}</div>
                  <div className="grid grid-cols-5 gap-2 text-sm">
                    <MetricInline label="利用率" value={`${(result.working_memory.material_yield * 100).toFixed(0)}%`} />
                    <MetricInline label="火次" value={result.working_memory.heat_count} />
                    <MetricInline label="风险" value={result.working_memory.quality_risk?.toFixed(3) || '-'} />
                    <MetricInline label="周期" value={`${result.working_memory.cycle_days}天`} />
                    <MetricInline label="置信度" value={result.confidence.toFixed(4)} />
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-slate-700">{score.toFixed(4)}</div>
                  <div className="text-xs text-muted-foreground">TOPSIS</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function MetricBox({ label, value, icon }: { label: string; value: React.ReactNode; icon: React.ReactNode }) {
  return (
    <div className="bg-white/70 rounded-lg p-2 text-center">
      <div className="text-muted-foreground text-xs mb-1 flex items-center justify-center gap-1">{icon}{label}</div>
      <div className="font-semibold text-slate-700">{value}</div>
    </div>
  );
}

function MetricInline({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="bg-white/60 rounded px-2 py-1">
      <span className="text-muted-foreground text-xs">{label}:</span>
      <span className="ml-1 font-medium">{value}</span>
    </div>
  );
}
