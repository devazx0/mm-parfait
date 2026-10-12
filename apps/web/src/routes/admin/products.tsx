import { createFileRoute } from '@tanstack/react-router'
import ProductManagementPage from '../../pages/admin/ProductManagementPage'

export const Route = createFileRoute('/admin/products')({
  component: ProductManagementPage,
})
