import { LucideIcon, TrendingUp } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
  color?: "purple" | "indigo" | "emerald" | "amber"
  trend?: string
}

const colorMap = {
  purple: { bg: "bg-purple-50", iconBg: "bg-purple-600", text: "text-purple-600", border: "border-purple-100" },
  indigo: { bg: "bg-indigo-50", iconBg: "bg-indigo-600", text: "text-indigo-600", border: "border-indigo-100" },
  emerald: { bg: "bg-emerald-50", iconBg: "bg-emerald-600", text: "text-emerald-600", border: "border-emerald-100" },
  amber: { bg: "bg-amber-50", iconBg: "bg-amber-500", text: "text-amber-600", border: "border-amber-100" },
}

export function StatsCard({ title, value, icon: Icon, description, color = "purple", trend }: StatsCardProps) {
  const c = colorMap[color]
  return (
    <div className={`bg-white rounded-2xl border ${c.border} p-6 flex flex-col gap-4 hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-between">
        <div className={`w-11 h-11 rounded-xl ${c.iconBg} flex items-center justify-center shadow-sm`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full px-2 py-0.5">
            <TrendingUp className="w-3 h-3" />
            {trend}
          </div>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 leading-none mb-1">{value}</p>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        {description && <p className="text-xs text-gray-400 mt-1">{description}</p>}
      </div>
    </div>
  )
}
