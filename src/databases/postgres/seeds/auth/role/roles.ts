
export const seedRoles = [
  /// System Roles
  {
    id: '00000000-0000-0000-0000-000000000001',
    name: 'super_admin',
    label: 'Super Administrator',
    description: 'Full system access with all permissions',
    hierarchyLevel: 0,
    isSystemRole: true
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    name: 'admin',
    label: 'Administrator',
    description: 'System administrator with management permissions',
    hierarchyLevel: 1,
    isSystemRole: true
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    name: 'sub_admin',
    label: 'Sub Administrator',
    description: 'Limited administrator with specific department access',
    hierarchyLevel: 2,
    isSystemRole: false,
  },

  /// Management Hierarchy
  {
    id: '00000000-0000-0000-0000-000000000010',
    name: 'general_manager',
    label: 'General Manager',
    description: 'General Manager overseeing multiple territories',
    hierarchyLevel: 4,
    isSystemRole: false
  },
  {
    id: '00000000-0000-0000-0000-000000000011',
    name: 'territory_manager',
    label: 'Territory Manager',
    description: 'Manages specific territory operations',
    hierarchyLevel: 5,
    isSystemRole: false
  },
  {
    id: '00000000-0000-0000-0000-000000000012',
    name: 'area_sales_manager',
    label: 'Area Sales Manager',
    description: 'Manages area-level sales and operations',
    hierarchyLevel: 6,
    isSystemRole: false
  },
  {
    id: '00000000-0000-0000-0000-000000000013',
    name: 'field_executive',
    label: 'Field Executive',
    description: 'Field operations and ground-level execution',
    hierarchyLevel: 7,
    isSystemRole: false
  },

  /// Vendor Portal Roles
  {
    id: '00000000-0000-0000-0000-000000000020',
    name: 'spa_owner',
    label: 'Spa Owner',
    description: 'Vendor portal owner managing spa operations',
    hierarchyLevel: 8,
    isSystemRole: false,
  },
  {
    id: '00000000-0000-0000-0000-000000000021',
    name: 'therapist',
    label: 'Therapist',
    description: 'Service provider working under spa owner',
    hierarchyLevel: 9,
    isSystemRole: false
  },

  /// Base Roles
  {
    id: '00000000-0000-0000-0000-000000000030',
    name: 'employee',
    label: 'Employee',
    description: 'Regular company employee',
    hierarchyLevel: 11,
    isSystemRole: false
  },
  {
    id: '00000000-0000-0000-0000-000000000031',
    name: 'user',
    label: 'User',
    description: 'Basic system user',
    hierarchyLevel: 12,
    isSystemRole: false
  },
  {
    id: '00000000-0000-0000-0000-000000000032',
    name: 'vendor',
    label: 'Vendor',
    description: 'External vendor partner',
    hierarchyLevel: 10,
    isSystemRole: false
  },
];