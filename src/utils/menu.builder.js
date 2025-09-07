// src/utils/menuBuilder.js
import router from '@/router'

export function buildMenu(role) {
  const homeRoutes = router.options.routes.find((r) => r.path === '/dashboard')?.children || []

  const grouped = {}

  homeRoutes.forEach((r) => {
    if (!r.meta?.label) return

    if (r.meta.roles && !r.meta.roles.includes(role)) return

    const path = r.path ? `/dashboard/${r.path}` : '/dashboard'
    const item = {
      key: path,
      label: r.meta.label,
      icon: r.meta.icon,
    }

    if (r.meta.parent) {
      if (!grouped[r.meta.parent]) {
        grouped[r.meta.parent] = {
          key: r.meta.parent,
          label: r.meta.parent,
          children: [],
        }
      }
      grouped[r.meta.parent].children.push(item)
    } else {
      grouped[item.key] = item
    }
  })

  return Object.values(grouped)
}
