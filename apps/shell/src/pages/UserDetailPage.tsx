import { Suspense, lazy } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import LoadingScreen from '@/shared/components/LoadingScreen'
import { useSelectedUserStore } from '@/stores/selectedUserStore'

const UserDetail = lazy(() => 
  import('usersMfe/UsersFeature').then(m => ({ default: m.UserDetail }))
)

export default function UserDetailPage() {
  const { uuid } = useParams<{ uuid: string }>()
  const navigate = useNavigate()
  const user = useSelectedUserStore((s) => s.user)

  if (!user || user.login.uuid !== uuid) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <p className="text-text-secondary font-body">Usuario no encontrado.</p>
      </div>
    )
  }

  return (
    <Suspense fallback={<LoadingScreen />}>
      <UserDetail user={user} onBack={() => navigate(-1)} />
    </Suspense>
  )
}

