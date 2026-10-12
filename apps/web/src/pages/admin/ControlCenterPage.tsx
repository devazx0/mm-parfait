import { useState } from 'react'
import { toast } from 'sonner'
import { useSettingsQuery, useUpdateSettingsMutation } from '../../services/settings/hook'
import { getApiErrorMessage } from '../../services/api'

export default function ControlCenterPage() {
  const { data: settings, isLoading, error } = useSettingsQuery()
  const updateMutation = useUpdateSettingsMutation()

  const [storeOpen, setStoreOpen] = useState(true)
  const [operatingHours, setOperatingHours] = useState('08:00 AM - 09:00 PM')
  const [deliveryZones, setDeliveryZones] = useState('Lagos Island, Lekki, Victoria Island, Ikeja')
  const [pushNotifications, setPushNotifications] = useState(true)
  const [emailDigest, setEmailDigest] = useState(false)

  const [isEditingHours, setIsEditingHours] = useState(false)
  const [isEditingZones, setIsEditingZones] = useState(false)

  const [prevSettings, setPrevSettings] = useState(settings)

  // Sync loaded settings into local editing state when they change
  if (settings !== prevSettings) {
    setPrevSettings(settings)
    if (settings) {
      setStoreOpen(settings.storeOpen)
      setOperatingHours(settings.operatingHours)
      setDeliveryZones(settings.deliveryZones)
      setPushNotifications(settings.pushNotifications)
      setEmailDigest(settings.emailDigest)
    }
  }

  const handleToggle = (key: 'storeOpen' | 'pushNotifications' | 'emailDigest', currentVal: boolean) => {
    const newVal = !currentVal
    if (key === 'storeOpen') setStoreOpen(newVal)
    if (key === 'pushNotifications') setPushNotifications(newVal)
    if (key === 'emailDigest') setEmailDigest(newVal)

    updateMutation.mutate(
      { [key]: newVal },
      {
        onSuccess: () => {
          toast.success('Setting updated in database.')
        },
        onError: (err) => {
          toast.error(getApiErrorMessage(err, 'Failed to update setting.'))
        },
      },
    )
  }

  const handleSaveText = (key: 'operatingHours' | 'deliveryZones', val: string) => {
    updateMutation.mutate(
      { [key]: val },
      {
        onSuccess: () => {
          toast.success('Settings saved to database.')
          setIsEditingHours(false)
          setIsEditingZones(false)
        },
        onError: (err) => {
          toast.error(getApiErrorMessage(err, 'Failed to save settings.'))
        },
      },
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-body-md text-secondary font-label-md">Loading settings from database...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-lg bg-error-container/20 border border-error rounded-xl text-center">
        <p className="text-on-surface font-headline-md">Failed to load settings.</p>
        <p className="text-secondary font-body-md mt-1">Please check backend API connection.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-lg md:gap-xl w-full pb-20 md:pb-0">
      <div>
        <h1 className="font-headline-lg-mobile md:font-headline-xl text-headline-lg-mobile md:text-headline-xl text-on-background mb-xs font-bold">
          Control Center
        </h1>
        <p className="font-body-md sm:font-body-lg text-body-md sm:text-body-lg text-secondary">
          Manage operations, notifications, and store parameters in PostgreSQL database.
        </p>
      </div>

      <div className="space-y-lg md:space-y-xl">
        {/* Store Operations */}
        <section>
          <h2 className="font-label-md text-label-md text-tertiary uppercase tracking-widest mb-sm ml-xs font-bold">
            Store Operations
          </h2>
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container-high overflow-hidden">
            <div className="flex items-center justify-between p-md sm:p-lg border-b border-surface-container-high hover:bg-surface-container-low transition-colors">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-surface-variant flex items-center justify-center mr-md text-on-surface-variant shrink-0">
                  <span className="material-symbols-outlined">storefront</span>
                </div>
                <div>
                  <h3 className="font-label-md text-label-md text-on-background font-bold">Store Status</h3>
                  <p className="font-label-sm text-label-sm text-secondary">
                    {storeOpen ? 'Currently accepting orders' : 'Store is temporarily closed'}
                  </p>
                </div>
              </div>
              <label className="relative inline-block w-12 h-6 cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={storeOpen}
                  onChange={() => handleToggle('storeOpen', storeOpen)}
                  className="sr-only peer"
                />
                <div className="w-12 h-6 rounded-full bg-surface-container-high peer-checked:bg-primary-container after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-5 after:h-5 after:rounded-full after:bg-white after:shadow-sm after:transition-all peer-checked:after:translate-x-6" />
              </label>
            </div>

            <div className="p-md sm:p-lg flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-surface-variant flex items-center justify-center mr-md text-on-surface-variant shrink-0">
                    <span className="material-symbols-outlined">schedule</span>
                  </div>
                  <div>
                    <h3 className="font-label-md text-label-md text-on-background font-bold">Operating Hours</h3>
                    <p className="font-label-sm text-label-sm text-secondary">{operatingHours}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditingHours(!isEditingHours)}
                  className="text-primary hover:underline font-label-md text-sm cursor-pointer bg-transparent border-none font-bold shrink-0"
                >
                  {isEditingHours ? 'Cancel' : 'Edit'}
                </button>
              </div>

              {isEditingHours && (
                <div className="flex gap-2 mt-2 pl-0 sm:pl-14">
                  <input
                    type="text"
                    value={operatingHours}
                    onChange={(e) => setOperatingHours(e.target.value)}
                    className="bg-surface border border-surface-variant rounded-lg p-2.5 text-base sm:text-sm text-on-surface flex-1"
                  />
                  <button
                    onClick={() => handleSaveText('operatingHours', operatingHours)}
                    className="bg-primary text-on-primary px-4 py-2 rounded-lg font-label-md font-bold border-none cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Logistics */}
        <section>
          <h2 className="font-label-md text-label-md text-tertiary uppercase tracking-widest mb-sm ml-xs font-bold">
            Logistics
          </h2>
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container-high overflow-hidden p-md sm:p-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-surface-variant flex items-center justify-center mr-md text-on-surface-variant shrink-0">
                  <span className="material-symbols-outlined">map</span>
                </div>
                <div>
                  <h3 className="font-label-md text-label-md text-on-background font-bold">Delivery Zones</h3>
                  <p className="font-label-sm text-label-sm text-secondary">{deliveryZones}</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditingZones(!isEditingZones)}
                className="text-primary hover:underline font-label-md text-sm cursor-pointer bg-transparent border-none font-bold shrink-0"
              >
                {isEditingZones ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {isEditingZones && (
              <div className="flex gap-2 mt-2 pl-0 sm:pl-14">
                <input
                  type="text"
                  value={deliveryZones}
                  onChange={(e) => setDeliveryZones(e.target.value)}
                  className="bg-surface border border-surface-variant rounded-lg p-2.5 text-base sm:text-sm text-on-surface flex-1"
                />
                <button
                  onClick={() => handleSaveText('deliveryZones', deliveryZones)}
                  className="bg-primary text-on-primary px-4 py-2 rounded-lg font-label-md font-bold border-none cursor-pointer"
                >
                  Save
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Notifications */}
        <section>
          <h2 className="font-label-md text-label-md text-tertiary uppercase tracking-widest mb-sm ml-xs font-bold">
            Notifications
          </h2>
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container-high overflow-hidden">
            <div className="flex items-center justify-between p-lg border-b border-surface-container-high hover:bg-surface-container-low transition-colors">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-surface-variant flex items-center justify-center mr-md text-on-surface-variant shrink-0">
                  <span className="material-symbols-outlined">notifications_active</span>
                </div>
                <div>
                  <h3 className="font-label-md text-label-md text-on-background font-bold">Push Notifications</h3>
                  <p className="font-label-sm text-label-sm text-secondary">New orders & stock alerts</p>
                </div>
              </div>
              <label className="relative inline-block w-12 h-6 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pushNotifications}
                  onChange={() => handleToggle('pushNotifications', pushNotifications)}
                  className="sr-only peer"
                />
                <div className="w-12 h-6 rounded-full bg-surface-container-high peer-checked:bg-primary-container after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-5 after:h-5 after:rounded-full after:bg-white after:shadow-sm after:transition-all peer-checked:after:translate-x-6" />
              </label>
            </div>

            <div className="flex items-center justify-between p-lg hover:bg-surface-container-low transition-colors">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-surface-variant flex items-center justify-center mr-md text-on-surface-variant shrink-0">
                  <span className="material-symbols-outlined">mail</span>
                </div>
                <div>
                  <h3 className="font-label-md text-label-md text-on-background font-bold">Email Digest</h3>
                  <p className="font-label-sm text-label-sm text-secondary">Daily performance summaries</p>
                </div>
              </div>
              <label className="relative inline-block w-12 h-6 cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailDigest}
                  onChange={() => handleToggle('emailDigest', emailDigest)}
                  className="sr-only peer"
                />
                <div className="w-12 h-6 rounded-full bg-surface-container-high peer-checked:bg-primary-container after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-5 after:h-5 after:rounded-full after:bg-white after:shadow-sm after:transition-all peer-checked:after:translate-x-6" />
              </label>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
