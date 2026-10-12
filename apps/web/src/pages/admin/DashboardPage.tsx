import { useNavigate } from '@tanstack/react-router'
import { useDashboardMetricsQuery } from '../../services/dashboard/hook'

export default function DashboardPage() {
  const navigate = useNavigate()
  const { data, isLoading, error } = useDashboardMetricsQuery()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-body-md text-secondary font-label-md">Loading metrics...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="p-lg bg-error-container/20 border border-error rounded-xl text-center">
        <p className="text-on-surface font-headline-md">Failed to load dashboard metrics.</p>
        <p className="text-secondary font-body-md mt-1">Please make sure the NestJS backend is running.</p>
      </div>
    )
  }

  const { metrics, recentActivity, stockAlerts } = data

  return (
    <div className="flex flex-col gap-lg md:gap-xl w-full">
      <section aria-label="Key Metrics" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-md md:gap-gutter">
        {metrics.map((m) => (
          <div key={m.title} className="bg-surface-container-lowest border border-surface-variant rounded-xl p-md sm:p-lg shadow-[0px_4px_20px_rgba(26,26,26,0.06)] flex flex-col gap-xs sm:gap-sm relative overflow-hidden group">
            <div className={`absolute -right-4 -top-4 w-24 h-24 ${m.bgDeco} rounded-full group-hover:scale-150 transition-transform duration-500 ease-out`} />
            <div className="flex justify-between items-start">
              <h2 className="font-label-sm sm:font-label-md text-label-sm sm:text-label-md text-secondary uppercase tracking-wider">{m.title}</h2>
              <span className={`material-symbols-outlined ${m.iconColor}`} style={{ fontVariationSettings: "'FILL' 1" }}>{m.icon}</span>
            </div>
            <div className="font-headline-lg sm:font-headline-xl text-headline-lg sm:text-headline-xl text-on-surface mt-1 sm:mt-2 font-bold">{m.value}</div>
            {m.trend && (
              <div className="flex items-center gap-1 mt-0.5">
                <span className={`material-symbols-outlined ${m.trend.color} text-sm`} style={{ fontVariationSettings: "'FILL' 1" }}>{m.trend.icon}</span>
                <span className={`font-label-sm text-label-sm ${m.trend.color}`}>{m.trend.label}</span>
              </div>
            )}
            {m.sub && (
              <div className="flex items-center gap-1 mt-0.5">
                <span className="font-label-sm text-label-sm text-tertiary">{m.sub}</span>
              </div>
            )}
            {m.alert && (
              <div className="flex items-center gap-1 mt-0.5">
                <span className={`material-symbols-outlined ${m.alert.color} text-sm`} style={{ fontVariationSettings: "'FILL' 1" }}>{m.alert.icon}</span>
                <span className={`font-label-sm text-label-sm ${m.alert.color}`}>{m.alert.label}</span>
              </div>
            )}
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg md:gap-xl">
        <div className="lg:col-span-2 flex flex-col gap-lg md:gap-xl">
          <section aria-label="Recent Activity" className="bg-surface-container-lowest border border-surface-variant rounded-xl shadow-[0px_4px_20px_rgba(26,26,26,0.06)] overflow-hidden">
            <div className="p-md sm:p-lg border-b border-surface-variant flex justify-between items-center">
              <h2 className="font-headline-md text-headline-md text-on-surface font-bold">Recent Activity</h2>
              <button onClick={() => navigate({ to: '/admin/orders' })} className="font-label-md text-label-md text-primary-container hover:underline cursor-pointer bg-transparent border-none">View All</button>
            </div>
            {recentActivity.length === 0 ? (
              <div className="p-lg text-center text-secondary font-body-md">No recent activity found.</div>
            ) : (
              <ul className="divide-y divide-surface-variant">
                {recentActivity.map((item, i) => (
                  <li key={i} onClick={() => navigate({ to: '/admin/orders' })} className="p-md sm:p-lg flex items-center justify-between gap-md hover:bg-surface-container-low transition-colors group cursor-pointer">
                    <div className="flex items-center gap-3 sm:gap-md min-w-0">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${item.bg} flex items-center justify-center ${item.color} shrink-0`}>
                        <span className="material-symbols-outlined text-[20px] sm:text-[24px]">{item.icon}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-label-md text-label-md text-on-surface group-hover:text-primary-container transition-colors truncate font-bold">{item.title}</p>
                        <p className="font-label-sm text-label-sm text-secondary mt-0.5 truncate">{item.sub}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-label-md text-label-md text-on-surface font-bold">{item.amount}</p>
                      <span className={`inline-flex items-center px-2 py-0.5 mt-0.5 rounded-full text-[10px] sm:text-xs font-medium ${item.badgeBg} ${item.badgeText}`}>{item.badge}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section aria-label="Quick Actions">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-sm sm:mb-md font-bold">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-md sm:gap-gutter">
              <button onClick={() => navigate({ to: '/admin/products' })} className="bg-primary-container text-on-primary font-label-md text-label-md py-md sm:py-lg px-md rounded-xl shadow-md hover:bg-[#B71C1C] transition-all flex flex-row sm:flex-col items-center justify-center gap-sm active:scale-95 cursor-pointer border-none font-bold">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>inventory_2</span>
                Manage Products
              </button>
              <button onClick={() => navigate({ to: '/admin/orders' })} className="bg-surface-container-lowest text-on-surface border border-surface-variant font-label-md text-label-md py-md sm:py-lg px-md rounded-xl shadow-sm hover:bg-surface-container transition-all flex flex-row sm:flex-col items-center justify-center gap-sm active:scale-95 cursor-pointer font-bold">
                <span className="material-symbols-outlined text-2xl">list_alt</span>
                View All Orders
              </button>
              <button onClick={() => navigate({ to: '/admin/homepage' })} className="bg-surface-container-lowest text-on-surface border border-surface-variant font-label-md text-label-md py-md sm:py-lg px-md rounded-xl shadow-sm hover:bg-surface-container transition-all flex flex-row sm:flex-col items-center justify-center gap-sm active:scale-95 cursor-pointer font-bold">
                <span className="material-symbols-outlined text-2xl">edit_note</span>
                Edit Homepage
              </button>
            </div>
          </section>
        </div>

        <div className="lg:col-span-1">
          <aside aria-label="Stock Alerts" className="bg-surface-container-lowest border border-error-container rounded-xl shadow-[0px_4px_20px_rgba(26,26,26,0.06)] overflow-hidden static lg:sticky top-24">
            <div className="bg-error-container p-md sm:p-lg flex items-center gap-sm border-b border-error-container">
              <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
              <h2 className="font-headline-md text-headline-md text-on-surface font-bold">Stock Alerts</h2>
            </div>
            <ul className="divide-y divide-surface-variant p-md">
              {stockAlerts.map((item, i) => (
                <li key={i} className="py-md flex items-start gap-md">
                  <div className={`w-2 h-2 rounded-full ${item.dot} mt-2 shrink-0`} />
                  <div>
                    <p className="font-label-md text-label-md text-on-surface font-bold">{item.title}</p>
                    <p className="font-body-md text-body-md text-secondary mt-1">{item.desc}</p>
                    {item.action && (
                      <button onClick={() => navigate({ to: '/admin/products' })} className="mt-2 font-label-sm text-label-sm text-primary-container hover:underline cursor-pointer bg-transparent border-none font-bold">{item.action}</button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </div>
  )
}
