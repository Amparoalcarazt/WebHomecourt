import { useNavigate } from 'react-router-dom'
import { useEffect, useState, useRef } from "react"
import { getUserById, type User } from './User'
import { useAuth } from '../context/AuthContext'
import { getPendingRequests, type FriendRequest } from '../lib/Perfil/friends'

const DEFAULT_AVATAR = "https://ptbcoxaguvbwprxdundz.supabase.co/storage/v1/object/public/user_images/profile_picture_default.png"

const pages = [
  { label: 'Home',          path: '/' },
  { label: 'Agenda',        path: '/agenda' },
  { label: 'Statistics',  path: '/estadisticas' },
  { label: 'LakersCourt',   path: '/lakerscourt' },
  { label: 'Dunk Royale',         path: '/juego' },
  { label: 'Store',         path: '/store' },
]

interface NavProps {
  current: string
  creditsOverride?: number; // To allow updating from my store
}

function Nav({ current, creditsOverride }: NavProps) {
  const navigate = useNavigate()
  const { user: authUser, userType } = useAuth()
  const [user, setUser] = useState<User | null>(null)
  const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [lastSeenCount, setLastSeenCount] = useState(0)
  const notificationRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadUser = async () => {
      if (!authUser?.id) return
      const data = await getUserById(authUser.id)
      setUser(data)
    }

    loadUser()
  }, [authUser?.id])

  useEffect(() => {
    const loadNotifications = async () => {
      if (!authUser?.id) return
      const requests = await getPendingRequests(authUser.id)
      setPendingRequests(requests)
    }

    loadNotifications()

    // Actualizar cada 30 segundos
    const interval = setInterval(loadNotifications, 30000)
    return () => clearInterval(interval)
  }, [authUser?.id])

  // Cerrar modal al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showNotifications])

  const navPages = userType === 1
    ? [...pages, { label: 'Admin', path: '/admin' }]
    : pages

  return (
    <div className="w-full">
      <div className="mx-auto w-full ">
        <div className="w-full h-10  bg-linear-to-r from-purple-900 to-amber-400" />

        <div className="w-full px-2 md:px-15 py-6 md:py-2 inline-flex flex-col xl:flex-row justify-between items-center gap-6 overflow-hidden">
          <img
            className="h-20 w-auto object-contain"
            src="/lakers_homecourt.png"
            alt="Homecourt logo"
          />

          <div className="flex flex-wrap justify-center items-center gap-7">
            {navPages.map((p) => { 
              const isCurrent = p.label === current

              return (
                <button
                  key={p.path}
                  type="button"
                  onClick={() => navigate(p.path)}
                  disabled={isCurrent}
                  className={[
                    "justify-start text-purple-900 text-2xl font-normal font-['Graphik'] transition-opacity",
                    isCurrent ? 'opacity-100 cursor-default' : 'cursor-pointer hover:opacity-70',
                  ].join(' ')}
                >
                  {p.label}
                </button>
              )
            })}
          </div>

          <div className="flex justify-start items-center gap-7">
            <div ref={notificationRef} className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications)
                  if (!showNotifications) {
                    // Solo actualizar cuando ABRES el modal
                    setLastSeenCount(pendingRequests.length)
                  }
                }}
                className="relative cursor-pointer hover:opacity-70 transition-opacity"
              >
                <span className="material-symbols-outlined text-morado-oscuro" style={{ fontSize: '40px' }}>notifications</span>
                {pendingRequests.length > lastSeenCount && (
                  <div className="absolute top-0 right-0 w-5 h-5 bg-rojo-error rounded-full flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">{pendingRequests.length}</span>
                  </div>
                )}
              </button>

              {/* NOTIFICACIONES!! */}
              {showNotifications && (
                <div className="fixed top-32 right-32 w-80 bg-white rounded-[15px] shadow-xl border border-gray-200" style={{ zIndex: 9999 }}>
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-texto-oscuro text-[5px]" style={{ fontFamily: 'Graphik', fontWeight: 500 }}>
                      Notifications
                    </h3>
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                    {pendingRequests.length === 0 ? (
                      <div className="p-6 text-center text-Gris-Oscuro" style={{ fontFamily: 'Graphik' }}>
                        No new notifications
                      </div>
                    ) : (
                      pendingRequests.map((request) => (
                        <div
                          key={request.friend_request_id}
                          className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={request.photo_url || DEFAULT_AVATAR}
                              alt={request.nickname}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div className="flex-1">
                              <p className="text-texto-oscuro text-sm font-medium" style={{ fontFamily: 'Graphik' }}>
                                {request.nickname} sent you a friend request
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {pendingRequests.length > 0 && (
                    <div className="p-3 border-t border-gray-200">
                      <button
                        onClick={() => {
                          setShowNotifications(false)
                          navigate('/my-friends', { state: { activeTab: 'pending' } })
                        }}
                        className="w-full bg-morado-oscuro hover:bg-morado-hover text-white py-2 rounded-[10px] transition-colors text-sm font-medium"
                        style={{ fontFamily: 'Graphik' }}
                      >
                        View All Requests
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-2.5 bg-white rounded-2xl outline -outline-offset-1 outline-black/25 flex justify-start items-center gap-3.5">
              <span className="material-symbols-outlined text-amarillo-lakers text-[200px]">payments</span>

              <div className="justify-start text-black text-2xl font-normal font-['Graphik']">
              {typeof creditsOverride === "number" ? creditsOverride : user?.credits ?? 0}</div>
            </div>

            <button
              onClick={() => navigate('/perfil')}
              className="w-15 h-15 relative rounded-full outline outline-2 outline-offset-[-2px] outline-gray-200 overflow-hidden bg-gray-300 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <img
                className="w-full h-full object-cover"
                src={user?.photo_url || DEFAULT_AVATAR}
                alt="User avatar"
              />
            </button>
          </div>
        </div>

        <div className="w-full h-0.5 bg-neutral-400/40" />
      </div>
    </div>
  )
}

export default Nav