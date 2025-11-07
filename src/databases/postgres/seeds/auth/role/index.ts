import { seedRoles } from './roles';
import { seedPermissions } from './permissions';
import { seedRolePermissions } from './rolePermissions';
import { seedDepartments } from './departments';
import { DBClient } from '../../../schema';
import { departments } from '../../../schema/auth/role/departments';
import { branches, permissions, rolePermissions, roles } from '../../../schema/auth/role';

export const role = async () => {
    try {
        console.log('Starting role seeding...');

        ///  Insert Branches 
        await DBClient
            .insert(branches)
            .values([
                { id: '30000000-0000-0000-0000-000000000001', name: "Head Office", code: "HQ" },
                { id: '30000000-0000-0000-0000-000000000002', name: "Vendor Network", code: "VN" },
            ])
            .returning()
        console.log("✅ Branches seeded");

        /// Insert Departments
        console.log('Seeding departments...');
        for (const department of seedDepartments) {
            await DBClient.insert(departments).values(department).onConflictDoNothing();
        }

        /// Insert Roles
        console.log('Seeding roles...');
        for (const role of seedRoles) {
            await DBClient.insert(roles).values(role).onConflictDoNothing();
        }

        /// Insert Permissions
        console.log('Seeding permissions...');
        for (const permission of seedPermissions) {
            await DBClient.insert(permissions).values(permission).onConflictDoNothing();
        }

        /// Insert Role-Permissions
        console.log('Seeding role permissions...');
        for (const rolePermission of seedRolePermissions) {
            await DBClient.insert(rolePermissions).values(rolePermission).onConflictDoNothing();
        }

        console.log('Database seeding completed successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
        throw error;
    }
}

/// Run seeding if this file is executed directly
if (require.main === module) {
    role()
        .catch((err) => {
            console.error("Error seeding admin user:", err)
        })
        .finally(() => {
            console.log(" seed file finished");
            process.exit(0);
        })
}