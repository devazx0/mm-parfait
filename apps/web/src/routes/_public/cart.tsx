import { createFileRoute } from '@tanstack/react-router'
import CartPage from '../../pages/CartPage'

export const Route = createFileRoute('/_public/cart')({
  component: CartPage,
})
