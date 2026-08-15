import { Battery, Wifi } from 'lucide-react'
import { DonutChart } from '@/components/charts'

const MACRO_SEGMENTS = [
  { label: 'Proteínas', grams: 120, percent: 30, color: '#554FE8' },
  { label: 'Carboidratos', grams: 210, percent: 50, color: '#8390F6' },
  { label: 'Gorduras', grams: 47, percent: 20, color: '#E7BD5B' },
]

/**
 * Decorative preview of the product inside a phone frame, showing an
 * example calculation. Deliberately shows only what the app actually
 * does: three calculators plus an account to save the results under.
 * No name/avatar and no "vs. yesterday"/streak-style trend charts —
 * the dashboard that would track those over time isn't built yet
 * (Milestone 4/5), so showing them here would misrepresent the product.
 */
export function PhonePreview() {
  return (
    <div aria-hidden="true" className="relative w-[280px] sm:w-[340px]">
      <div className="rounded-[52px] bg-[#0E1018] p-[7px] shadow-[0_35px_80px_rgba(38,49,108,0.26)]">
        <div className="overflow-hidden rounded-[46px] bg-[#F8F9FF]">
          {/* Status bar */}
          <div className="flex items-center justify-between px-6 pt-4 text-[11px] font-semibold text-text-primary">
            <span>9:41</span>
            <div className="flex items-center gap-1.5 text-text-primary">
              <Wifi className="h-3.5 w-3.5" strokeWidth={2.2} />
              <Battery className="h-3.5 w-3.5" strokeWidth={2.2} />
            </div>
          </div>

          {/* Header */}
          <div className="px-6 pt-5">
            <p className="text-lg font-semibold text-text-primary">Seus resultados</p>
            <p className="text-xs text-text-muted">Crie uma conta e acompanhe sua evolução.</p>
          </div>

          {/* Tabs: the three calculators the app actually has */}
          <div className="mx-6 mt-4 flex gap-1 rounded-full bg-[#F0F1FB] p-1 text-[11px] font-semibold">
            <span className="flex-1 rounded-full bg-gradient-to-r from-[#625CF3] to-primary-hover py-2 text-center text-white">
              IMC
            </span>
            <span className="flex-1 py-2 text-center text-text-secondary">TDEE</span>
            <span className="flex-1 py-2 text-center text-text-secondary">Macros</span>
          </div>

          {/* IMC card */}
          <div className="mx-6 mt-4 rounded-2xl bg-white p-4 shadow-[0_8px_24px_rgba(36,47,102,0.06)]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-text-secondary">IMC</span>
              <span className="text-[10px] text-text-muted">Saudável 18,5–24,9</span>
            </div>
            <p className="mt-1 text-[28px] font-bold tracking-tight text-text-primary">23,4</p>
            <p className="flex items-center gap-1 text-[11px] font-medium text-success">
              <span className="h-1.5 w-1.5 rounded-full bg-success" /> Peso normal
            </p>
          </div>

          {/* TDEE card */}
          <div className="mx-6 mt-3 rounded-2xl bg-white p-4 shadow-[0_8px_24px_rgba(36,47,102,0.06)]">
            <span className="text-[11px] font-semibold text-text-secondary">TDEE</span>
            <p className="text-2xl font-bold tracking-tight text-text-primary">2.350 kcal</p>
            <p className="text-[11px] text-text-muted">Gasto energético diário</p>
          </div>

          {/* Meta calórica */}
          <div className="mx-6 mt-3 rounded-2xl bg-white p-4 shadow-[0_8px_24px_rgba(36,47,102,0.06)]">
            <span className="text-[11px] font-semibold text-text-secondary">Meta calórica</span>
            <p className="text-2xl font-bold tracking-tight text-text-primary">2.100 kcal</p>
            <p className="text-[11px] text-text-muted">Déficit leve para perder peso</p>
          </div>

          {/* Macros */}
          <div className="mx-6 my-3 rounded-2xl bg-white p-4 shadow-[0_8px_24px_rgba(36,47,102,0.06)]">
            <span className="text-[11px] font-semibold text-text-secondary">Macros</span>
            <div className="mt-2 flex items-center gap-4">
              <DonutChart
                segments={MACRO_SEGMENTS.map((m) => ({ value: m.percent, color: m.color }))}
                size={60}
                strokeWidth={9}
              />
              <ul className="flex-1 space-y-1">
                {MACRO_SEGMENTS.map((macro) => (
                  <li key={macro.label} className="flex items-center justify-between text-[10px]">
                    <span className="flex items-center gap-1.5 text-text-secondary">
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: macro.color }}
                      />
                      {macro.label}
                    </span>
                    <span className="font-semibold text-text-primary">
                      {macro.grams}g · {macro.percent}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
