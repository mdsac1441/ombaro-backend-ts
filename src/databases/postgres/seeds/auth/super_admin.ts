import { eq, and } from "drizzle-orm"
import { auths, DBClient, users } from "../../schema"
import { generateUID, hashPassword } from "../../../../libs"
import { branches, userRoles } from "../../schema/auth/role"
import UserRepository from "../../../../x/user/repositories"


export const super_admin = async () => {
    console.log("Super Admin seed file")

    const superAdminEmail = process.env.OMBARO_SUPER_ADMIN_EMAIL
    const superAdminPassword = process.env.OMBARO_SUPER_ADMIN_PASSWORD
    if (!superAdminEmail || !superAdminPassword) {
        console.log("Super Admin email or password not set in environment variables")
        return
    }
    const [existingSuperAdmin] = await DBClient.select().from(auths).where(and(eq(auths.email, superAdminEmail))).limit(1)
    if (existingSuperAdmin) {
        /// Check if that user already has Super Admin role
        const [existingUser] = await DBClient
            .select()
            .from(users)
            .where(eq(users.authId, existingSuperAdmin.id))
            .limit(1);

        if (existingUser) {
            const [existingRole] = await DBClient
                .select()
                .from(userRoles)
                .where(
                    and(
                        eq(userRoles.userId, existingUser.id),
                        eq(userRoles.roleId, '00000000-0000-0000-0000-000000000001')
                    )
                )
                .limit(1);

            if (existingRole) {
                console.log(" Super Admin already exists with role");
                return;
            }
        }
    }
    const [newSuperAdminAuth] = await DBClient.insert(auths).values({
        email: superAdminEmail,
        password: await hashPassword(superAdminPassword)
    }).returning()
    console.log("Super Admin Auth created:")

    const newSuperAdminUser = await UserRepository.create({
        uid: generateUID(newSuperAdminAuth.id),
        authId: newSuperAdminAuth.id,
        nickName: 'ombaro'
    })
    console.log("Super Admin User created:")

    await DBClient.insert(userRoles).values({
        userId: newSuperAdminUser.id,
        roleId: '00000000-0000-0000-0000-000000000001',
        branchId: '30000000-0000-0000-0000-000000000001',
        isPrimary: true
    });
}


/// Run seeding if this file is executed directly
if (require.main === module) {
    super_admin()
        .catch((err) => {
            console.error("Error seeding admin user:", err)
        })
        .finally(() => {
            console.log(" seed file finished");
            process.exit(0);
        })
}