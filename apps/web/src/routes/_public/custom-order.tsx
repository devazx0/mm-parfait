import { createFileRoute } from '@tanstack/react-router'
import CustomOrderPage from '../../pages/CustomOrderPage'

export const Route = createFileRoute('/_public/custom-order')({
  component: CustomOrderPage,
})
