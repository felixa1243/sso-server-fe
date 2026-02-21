import { serverApi, withAuth } from '@/lib/serverApi';
import UsersClient from './users-client';

export default async function UsersPage() {
    let users = [];
    let roles = [];
    try {
        const authConfig = await withAuth();
        const res = await serverApi.get('/admin/users', authConfig);
        users = res.data;

        const rolesRes = await serverApi.get('/admin/roles', authConfig);
        roles = rolesRes.data;
    } catch (error) {
        console.error('Failed to fetch users or roles', error);
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Users Management</h2>
            </div>
            <UsersClient initialUsers={users} availableRoles={roles} />
        </div>
    );
}
