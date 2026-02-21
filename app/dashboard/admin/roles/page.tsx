import { serverApi, withAuth } from '@/lib/serverApi';
import RolesClient from './roles-client';

export default async function RolesPage() {
    let roles = [];
    let permissions = [];
    try {
        const authConfig = await withAuth();
        const res = await serverApi.get('/admin/roles', authConfig);
        roles = res.data;

        const permRes = await serverApi.get('/admin/permissions', authConfig);
        permissions = permRes.data;
    } catch (error) {
        console.error('Failed to fetch roles or permissions', error);
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Roles Management</h2>
            </div>
            <RolesClient initialRoles={roles} availablePermissions={permissions} />
        </div>
    );
}
