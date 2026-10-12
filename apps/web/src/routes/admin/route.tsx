import { Outlet, createFileRoute } from '@tanstack/react-router'
import ProtectedRoute from '../../components/admin/ProtectedRoute'
import AdminLayout from '../../components/admin/AdminLayout'

export const Route = createFileRoute('/admin')({
  component: AdminRoute,
})

function AdminRoute() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <Outlet />
      </AdminLayout>
    </ProtectedRoute>
  )
}
