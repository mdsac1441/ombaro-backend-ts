import { seedPermissions } from "./permissions";

export const seedRolePermissions = [
    /// Super Admin - All Permissions
    ...seedPermissions.map(permission => ({
        roleId: '00000000-0000-0000-0000-000000000001', /// super_admin
        permissionId: permission.id,
        grantedAt: new Date(),
    })),

    /// Admin - Most permissions except system:all:global
    {
        roleId: '00000000-0000-0000-0000-000000000002', /// admin
        permissionId: '10000000-0000-0000-0000-000000000002', /// users:create:global
        grantedAt: new Date()
    },
    {
        roleId: '00000000-0000-0000-0000-000000000002',
        permissionId: '10000000-0000-0000-0000-000000000003', /// users:read:global
        grantedAt: new Date()
    },
    {
        roleId: '00000000-0000-0000-0000-000000000002',
        permissionId: '10000000-0000-0000-0000-000000000004', /// users:update:global
        grantedAt: new Date()
    },
    {
        roleId: '00000000-0000-0000-0000-000000000002',
        permissionId: '10000000-0000-0000-0000-000000000006', /// roles:manage:global
        grantedAt: new Date()
    },
    {
        roleId: '00000000-0000-0000-0000-000000000002',
        permissionId: '10000000-0000-0000-0000-000000000007', /// departments:manage:global
        grantedAt: new Date()
    },
    {
        roleId: '00000000-0000-0000-0000-000000000002',
        permissionId: '10000000-0000-0000-0000-000000000009', /// reports:view:team
        grantedAt: new Date()
    },
    {
        roleId: '00000000-0000-0000-0000-000000000002',
        permissionId: '10000000-0000-0000-0000-000000000011', /// vendors:manage:global
        grantedAt: new Date()
    },

    /// Sub Admin - Limited admin permissions
    {
        roleId: '00000000-0000-0000-0000-000000000003', /// sub_admin
        permissionId: '10000000-0000-0000-0000-000000000003', /// users:read:global
        grantedAt: new Date()
    },
    {
        roleId: '00000000-0000-0000-0000-000000000003',
        permissionId: '10000000-0000-0000-0000-000000000008', /// departments:read:department
        grantedAt: new Date()
    },
    {
        roleId: '00000000-0000-0000-0000-000000000003',
        permissionId: '10000000-0000-0000-0000-000000000009', /// reports:view:team
        grantedAt: new Date()
    },

    /// General Manager
    {
        roleId: '00000000-0000-0000-0000-000000000010', /// general_manager
        permissionId: '10000000-0000-0000-0000-000000000009', /// reports:view:team
        grantedAt: new Date()
    },
    {
        roleId: '00000000-0000-0000-0000-000000000010',
        permissionId: '10000000-0000-0000-0000-000000000014', /// field_ops:manage:area
        grantedAt: new Date()
    },

    /// Territory Manager
    {
        roleId: '00000000-0000-0000-0000-000000000011', /// territory_manager
        permissionId: '10000000-0000-0000-0000-000000000009', /// reports:view:team
        grantedAt: new Date()
    },
    {
        roleId: '00000000-0000-0000-0000-000000000011',
        permissionId: '10000000-0000-0000-0000-000000000014', /// field_ops:manage:area
        grantedAt: new Date()
    },

    /// Area Sales Manager
    {
        roleId: '00000000-0000-0000-0000-000000000012', /// area_sales_manager
        permissionId: '10000000-0000-0000-0000-000000000009', /// reports:view:team
        grantedAt: new Date()
    },
    {
        roleId: '00000000-0000-0000-0000-000000000012',
        permissionId: '10000000-0000-0000-0000-000000000014', /// field_ops:manage:area
        grantedAt: new Date()
    },

    /// Field Executive
    {
        roleId: '00000000-0000-0000-0000-000000000013', /// field_executive
        permissionId: '10000000-0000-0000-0000-000000000010', /// reports:view:own
        grantedAt: new Date()
    },
    {
        roleId: '00000000-0000-0000-0000-000000000013',
        permissionId: '10000000-0000-0000-0000-000000000015', /// field_ops:view:own
        grantedAt: new Date()
    },

    /// Spa Owner
    {
        roleId: '00000000-0000-0000-0000-000000000020', /// spa_owner
        permissionId: '10000000-0000-0000-0000-000000000012', /// vendors:manage:own
        grantedAt: new Date()
    },
    {
        roleId: '00000000-0000-0000-0000-000000000020',
        permissionId: '10000000-0000-0000-0000-000000000009', /// reports:view:team
        grantedAt: new Date()
    },

    /// Therapist
    {
        roleId: '00000000-0000-0000-0000-000000000021', /// therapist
        permissionId: '10000000-0000-0000-0000-000000000013', /// services:manage:own
        grantedAt: new Date()
    },
    {
        roleId: '00000000-0000-0000-0000-000000000021',
        permissionId: '10000000-0000-0000-0000-000000000010', /// reports:view:own
        grantedAt: new Date()
    },

    /// Employee
    {
        roleId: '00000000-0000-0000-0000-000000000030', /// employee
        permissionId: '10000000-0000-0000-0000-000000000010', /// reports:view:own
        grantedAt: new Date()
    },

    /// User
    {
        roleId: '00000000-0000-0000-0000-000000000031', /// user
        permissionId: '10000000-0000-0000-0000-000000000010', /// reports:view:own
        grantedAt: new Date()
    },

    /// Vendor
    {
        roleId: '00000000-0000-0000-0000-000000000032', /// vendor
        permissionId: '10000000-0000-0000-0000-000000000012', /// vendors:manage:own
        grantedAt: new Date()
    },
];