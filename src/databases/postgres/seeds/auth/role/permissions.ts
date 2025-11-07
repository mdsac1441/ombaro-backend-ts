export const seedPermissions = [
  /// Super Admin Permissions (Full Access)
  {
    id: '10000000-0000-0000-0000-000000000001',
    key: 'system:all:global',
    resource: 'system',
    action: 'all',
    scope: 'global',
    label: 'Full System Access',
    description: 'Complete access to all system features and data'
  },

  /// User Management Permissions
  {
    id: '10000000-0000-0000-0000-000000000002',
    key: 'users:create:global',
    resource: 'users',
    action: 'create',
    scope: 'global',
    label: 'Create Users',
    description: 'Create new users in the system'
  },
  {
    id: '10000000-0000-0000-0000-000000000003',
    key: 'users:read:global',
    resource: 'users',
    action: 'read',
    scope: 'global',
    label: 'View All Users',
    description: 'View all users in the system'
  },
  {
    id: '10000000-0000-0000-0000-000000000004',
    key: 'users:update:global',
    resource: 'users',
    action: 'update',
    scope: 'global',
    label: 'Update All Users',
    description: 'Update any user in the system'
  },
  {
    id: '10000000-0000-0000-0000-000000000005',
    key: 'users:delete:global',
    resource: 'users',
    action: 'delete',
    scope: 'global',
    label: 'Delete Users',
    description: 'Delete users from the system'
  },

  /// Role Management Permissions
  {
    id: '10000000-0000-0000-0000-000000000006',
    key: 'roles:manage:global',
    resource: 'roles',
    action: 'manage',
    scope: 'global',
    label: 'Manage Roles',
    description: 'Create, read, update, and delete roles'
  },

  /// Department Management Permissions
  {
    id: '10000000-0000-0000-0000-000000000007',
    key: 'departments:manage:global',
    resource: 'departments',
    action: 'manage',
    scope: 'global',
    label: 'Manage Departments',
    description: 'Full department management access'
  },
  {
    id: '10000000-0000-0000-0000-000000000008',
    key: 'departments:read:department',
    resource: 'departments',
    action: 'read',
    scope: 'department',
    label: 'View Department Data',
    description: 'View data within assigned department'
  },

  /// Reporting Hierarchy Permissions
  {
    id: '10000000-0000-0000-0000-000000000009',
    key: 'reports:view:team',
    resource: 'reports',
    action: 'view',
    scope: 'team',
    label: 'View Team Reports',
    description: 'View reports for direct and indirect reports'
  },
  {
    id: '10000000-0000-0000-0000-000000000010',
    key: 'reports:view:own',
    resource: 'reports',
    action: 'view',
    scope: 'own',
    label: 'View Own Reports',
    description: 'View personal reports and data'
  },

  /// Vendor Management Permissions
  {
    id: '10000000-0000-0000-0000-000000000011',
    key: 'vendors:manage:global',
    resource: 'vendors',
    action: 'manage',
    scope: 'global',
    label: 'Manage Vendors',
    description: 'Full vendor management access'
  },
  {
    id: '10000000-0000-0000-0000-000000000012',
    key: 'vendors:manage:own',
    resource: 'vendors',
    action: 'manage',
    scope: 'own',
    label: 'Manage Own Vendor Portal',
    description: 'Manage own vendor portal and therapists'
  },

  /// Therapist Permissions
  {
    id: '10000000-0000-0000-0000-000000000013',
    key: 'services:manage:own',
    resource: 'services',
    action: 'manage',
    scope: 'own',
    label: 'Manage Own Services',
    description: 'Manage personal service schedule and availability'
  },

  /// Field Operations Permissions
  {
    id: '10000000-0000-0000-0000-000000000014',
    key: 'field_ops:manage:area',
    resource: 'field_operations',
    action: 'manage',
    scope: 'area',
    label: 'Manage Area Operations',
    description: 'Manage field operations in assigned area'
  },
  {
    id: '10000000-0000-0000-0000-000000000015',
    key: 'field_ops:view:own',
    resource: 'field_operations',
    action: 'view',
    scope: 'own',
    label: 'View Field Operations',
    description: 'View personal field operations data'
  },
];