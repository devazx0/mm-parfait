import { createFileRoute } from '@tanstack/react-router'
import ControlCenterPage from '../../pages/admin/ControlCenterPage'

export const Route = createFileRoute('/admin/settings')({
  component: ControlCenterPage,
})
