import { createFileRoute } from '@tanstack/react-router'
import GalleryManagerPage from '../../pages/admin/GalleryManagerPage'

export const Route = createFileRoute('/admin/gallery')({
  component: GalleryManagerPage,
})
