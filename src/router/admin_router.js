let router = [
  {
    path: '/admin_species_config',
    name: 'admin_species_config',
    component: resolve => require(['@/views/admin/admin_species_config'], resolve),
    meta: {
      role: 'ADMIN'
    },
  },
  {
    path: '/user_list',
    name: 'user_list',
    component: resolve => require(['@/views/admin/user_list'], resolve),
    meta: {
      role: 'ADMIN'
    },
  }
]
export default router
