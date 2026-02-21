import { serverApi, withAuth } from '@/lib/serverApi';
import ScopesClient from './scopes-client';

export default async function ScopesPage() {
    let scopes = [];
    try {
        const authConfig = await withAuth();
        // Note: List scopes is GET /scopes, not /admin/scopes in backend
        const res = await serverApi.get('/scopes', authConfig);
        scopes = res.data;
    } catch (error) {
        console.error('Failed to fetch scopes', error);
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">OAuth2 Scopes Management</h2>
            </div>
            <ScopesClient initialScopes={scopes} />
        </div>
    );
}
