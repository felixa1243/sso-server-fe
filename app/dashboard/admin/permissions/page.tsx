import { serverApi, withAuth } from '@/lib/serverApi';
import PermissionsClient from './permissions-client';

export default async function PermissionsPage() {
    let permissions = [];
    try {
        const authConfig = await withAuth();
        const res = await serverApi.get('/admin/permissions', authConfig);
        permissions = res.data;
    } catch (error) {
        console.error('Failed to fetch permissions', error);
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Permissions Management</h2>
            </div>
            <PermissionsClient initialPermissions={permissions} />
        </div>
    );
}
