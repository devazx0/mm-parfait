import { createFileRoute } from '@tanstack/react-router'
import OrderSuccessPage from '../../pages/OrderSuccessPage'

export const Route = createFileRoute('/_public/order-success')({
  component: OrderSuccessPage,
})
