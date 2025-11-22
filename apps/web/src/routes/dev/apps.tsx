import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dev/apps')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dev/apps"!</div>
}
