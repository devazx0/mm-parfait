import { createFileRoute } from '@tanstack/react-router'
import HomepageEditorPage from '../../pages/admin/HomepageEditorPage'

export const Route = createFileRoute('/admin/homepage')({
  component: HomepageEditorPage,
})
