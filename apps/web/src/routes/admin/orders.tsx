import { createFileRoute } from '@tanstack/react-router'
import OrderManagementPage from '../../pages/admin/OrderManagementPage'

export const Route = createFileRoute('/admin/orders')({
  component: OrderManagementPage,
})
