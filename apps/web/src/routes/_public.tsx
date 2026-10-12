import { Outlet, createFileRoute } from '@tanstack/react-router'
import TopAppBar from '../components/TopAppBar'
import BottomNavBar from '../components/BottomNavBar'

export const Route = createFileRoute('/_public')({
  component: PublicLayout,
})

function PublicLayout() {
  return (
    <>
      <TopAppBar />
      <Outlet />
      <BottomNavBar />
    </>
  )
}
