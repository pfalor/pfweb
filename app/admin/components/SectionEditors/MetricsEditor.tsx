'use client'

import { AIToolbar } from '../AIToolbar'

type AIProvider = 'openai' | 'anthropic'

interface MetricData {
  id: number
  value: number
  suffix: string
  prefix?: string
  label: string
  description: string
  category: string
}

interface MetricsEditorProps {
  data: MetricData[]
  onChange: (data: MetricData[]) => void
  provider: AIProvider
}

const CATEGORIES = ['Security', 'Operations', 'Business Impact', 'Innovation', 'Efficiency', 'Growth']

export function MetricsEditor({ data, onChange, provider }: MetricsEditorProps) {
  const updateMetric = (id: number, updates: Partial<MetricData>) => {
    onChange(data.map(m => m.id === id ? { ...m, ...updates } : m))
  }

  const addMetric = () => {
    const newId = Math.max(...data.map(m => m.id), 0) + 1
    onChange([...data, {
      id: newId,
      value: 0,
      suffix: '%',
      label: 'New Metric',
      description: 'Description of this metric',
      category: 'Operations'
    }])
  }

  const removeMetric = (id: number) => {
    onChange(data.filter(m => m.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Impact Metrics</h2>
        <button
          onClick={addMetric}
          className="px-4 py-2 bg-accent hover:bg-accent/90 text-white text-sm rounded-lg
                   transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Metric
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map((metric) => (
          <div
            key={metric.id}
            className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Prefix</label>
                    <input
                      type="text"
                      value={metric.prefix || ''}
                      onChange={(e) => updateMetric(metric.id, { prefix: e.target.value || undefined })}
                      placeholder="$"
                      className="w-full px-2 py-1.5 bg-slate-900/50 border border-slate-700 rounded-md
                               text-white text-sm focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Value</label>
                    <input
                      type="number"
                      value={metric.value}
                      onChange={(e) => updateMetric(metric.id, { value: parseFloat(e.target.value) || 0 })}
                      className="w-full px-2 py-1.5 bg-slate-900/50 border border-slate-700 rounded-md
                               text-white text-sm focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Suffix</label>
                    <input
                      type="text"
                      value={metric.suffix}
                      onChange={(e) => updateMetric(metric.id, { suffix: e.target.value })}
                      placeholder="%"
                      className="w-full px-2 py-1.5 bg-slate-900/50 border border-slate-700 rounded-md
                               text-white text-sm focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Label</label>
                  <input
                    type="text"
                    value={metric.label}
                    onChange={(e) => updateMetric(metric.id, { label: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-md
                             text-white text-sm focus:outline-none focus:border-accent transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Category</label>
                  <select
                    value={metric.category}
                    onChange={(e) => updateMetric(metric.id, { category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-md
                             text-white text-sm focus:outline-none focus:border-accent transition-colors"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Description</label>
                  <textarea
                    value={metric.description}
                    onChange={(e) => updateMetric(metric.id, { description: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-md
                             text-white text-sm focus:outline-none focus:border-accent transition-colors resize-none"
                  />
                  <div className="mt-2">
                    <AIToolbar
                      content={metric.description}
                      onRewrite={(newContent) => updateMetric(metric.id, { description: newContent })}
                      provider={provider}
                      context={`Metric: ${metric.prefix || ''}${metric.value}${metric.suffix} ${metric.label}`}
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={() => removeMetric(metric.id)}
                className="ml-2 p-1 text-slate-500 hover:text-red-400 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Preview */}
            <div className="pt-3 border-t border-slate-700/50">
              <p className="text-xs text-slate-500 mb-1">Preview:</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-white">
                  {metric.prefix}{metric.value}{metric.suffix}
                </span>
                <span className="text-sm text-slate-400">{metric.label}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
