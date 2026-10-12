import { useState } from 'react'
import { toast } from 'sonner'
import { useOrdersQuery, useUpdateOrderStatusMutation } from '../../services/orders/hook'
import { getApiErrorMessage } from '../../services/api'
import type { OrderRecord } from '../../services/orders/index'

const filterChips = ['All Orders', 'Pending', 'Processing', 'Shipped', 'Completed', 'Cancelled']

const statusIcons: Record<string, React.ReactNode> = {
  Processing: <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />,
  Pending: <span className="material-symbols-outlined text-[14px]">schedule</span>,
  Completed: <span className="material-symbols-outlined text-[14px]">check_circle</span>,
  Cancelled: <span className="material-symbols-outlined text-[14px]">cancel</span>,
  Shipped: <span className="material-symbols-outlined text-[14px]">local_shipping</span>,
}

export default function OrderManagementPage() {
  const [activeFilter, setActiveFilter] = useState('All Orders')
  const [searchTerm, setSearchTerm] = useState('')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const { data: orders = [], isLoading, error } = useOrdersQuery(activeFilter)
  const updateStatusMutation = useUpdateOrderStatusMutation()

  const handleStatusChange = (id: string, newStatus: OrderRecord['status']) => {
    setUpdatingId(id)
    updateStatusMutation.mutate(
      { id, status: newStatus },
      {
        onSuccess: () => {
          toast.success(`Order status updated to ${newStatus}`)
          setUpdatingId(null)
        },
        onError: (err) => {
          toast.error(getApiErrorMessage(err, 'Failed to update order status'))
          setUpdatingId(null)
        },
      },
    )
  }

  const filteredOrders = orders.filter((o) => {
    if (!searchTerm) return true
    const term = searchTerm.toLowerCase()
    return (
      o.orderNumber.toLowerCase().includes(term) ||
      o.customerName.toLowerCase().includes(term)
    )
  })

  return (
    <div className="flex flex-col gap-xl w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
        <div>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface font-bold">
            Order Management
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Review and update customer orders from PostgreSQL database.
          </p>
        </div>
        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-md">
          <div className="relative w-full sm:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-lg pointer-events-none">
              search
            </span>
            <input
              className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border border-surface-variant rounded-full font-body-md text-body-md text-on-surface focus:outline-none focus:border-on-surface focus:ring-1 focus:ring-on-surface transition-all shadow-sm"
              placeholder="Search orders..."
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Filter Chips (Scrollable on mobile) */}
      <div className="bg-surface-container-lowest p-xs rounded-xl shadow-sm border border-surface-container flex overflow-x-auto no-scrollbar gap-xs py-1.5 px-2">
        {filterChips.map((chip) => {
          const isActive = chip === activeFilter
          return (
            <button
              key={chip}
              onClick={() => setActiveFilter(chip)}
              className={`px-3.5 py-1.5 rounded-lg font-label-sm text-label-sm whitespace-nowrap transition-all cursor-pointer border-none shrink-0 ${
                isActive
                  ? 'bg-on-surface text-surface shadow-sm font-bold'
                  : 'text-on-surface hover:bg-surface-container-low'
              }`}
            >
              {chip === 'Processing' && (
                <div className="w-1.5 h-1.5 rounded-full bg-primary inline-block mr-1 align-middle" />
              )}
              {chip}
            </button>
          )
        })}
      </div>

      {/* Orders Container */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="font-label-md text-secondary">Loading orders from database...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-error">
            Failed to load orders. Please check your backend connection.
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-secondary font-body-md">
            No orders found matching your criteria.
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="block md:hidden divide-y divide-surface-container">
              {filteredOrders.map((order) => (
                <div key={order.id} className="p-4 flex flex-col gap-3 hover:bg-surface-container-low transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md font-bold text-on-surface">{order.orderNumber}</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">{order.date}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface font-label-md shrink-0 font-bold">
                        {order.initials || order.customerName.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="font-body-md text-body-md text-on-surface font-medium truncate">{order.customerName}</span>
                    </div>
                    <span className="font-headline-md text-headline-md font-bold text-primary shrink-0">{order.total}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-surface-variant/50">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-label-sm text-label-sm ${order.statusStyle}`}>
                      {statusIcons[order.status]}
                      {order.status}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-label-sm text-secondary font-medium">Status:</span>
                      <select
                        value={order.status}
                        disabled={updatingId === order.id}
                        onChange={(e) =>
                          handleStatusChange(
                            order.id,
                            e.target.value as OrderRecord['status'],
                          )
                        }
                        className="bg-surface border border-surface-variant rounded-lg px-2.5 py-1 text-xs font-label-md font-semibold text-on-surface focus:outline-none focus:border-primary cursor-pointer disabled:opacity-50"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                <thead>
                  <tr className="border-b border-surface-container bg-surface-bright/50">
                    <th className="px-lg py-4 font-label-md text-label-md text-on-surface-variant font-semibold tracking-wider">
                      Order ID
                    </th>
                    <th className="px-lg py-4 font-label-md text-label-md text-on-surface-variant font-semibold tracking-wider">
                      Customer
                    </th>
                    <th className="px-lg py-4 font-label-md text-label-md text-on-surface-variant font-semibold tracking-wider">
                      Date
                    </th>
                    <th className="px-lg py-4 font-label-md text-label-md text-on-surface-variant font-semibold tracking-wider">
                      Total
                    </th>
                    <th className="px-lg py-4 font-label-md text-label-md text-on-surface-variant font-semibold tracking-wider">
                      Status
                    </th>
                    <th className="px-lg py-4 font-label-md text-label-md text-on-surface-variant font-semibold tracking-wider text-right">
                      Change Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container font-body-md text-body-md text-on-surface">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-surface-container-low transition-colors group">
                      <td className="px-lg py-4 font-medium">{order.orderNumber}</td>
                      <td className="px-lg py-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface font-label-md shrink-0 font-bold">
                          {order.initials || order.customerName.slice(0, 2).toUpperCase()}
                        </div>
                        {order.customerName}
                      </td>
                      <td className="px-lg py-4 text-on-surface-variant">{order.date}</td>
                      <td className="px-lg py-4 font-bold text-primary">{order.total}</td>
                      <td className="px-lg py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-label-sm text-label-sm ${order.statusStyle}`}>
                          {statusIcons[order.status]}
                          {order.status}
                        </span>
                      </td>
                      <td className="px-lg py-4 text-right">
                        <select
                          value={order.status}
                          disabled={updatingId === order.id}
                          onChange={(e) =>
                            handleStatusChange(
                              order.id,
                              e.target.value as OrderRecord['status'],
                            )
                          }
                          className="bg-surface border border-surface-variant rounded-lg px-2.5 py-1 text-xs font-label-md font-semibold text-on-surface focus:outline-none focus:border-primary cursor-pointer disabled:opacity-50"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
