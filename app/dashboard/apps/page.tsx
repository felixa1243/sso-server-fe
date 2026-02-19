'use client';

import { useState, useEffect, useRef } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, X, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ClientApp {
    id: string;
    name: string;
    client_id: string;
    client_secret?: string; // Only present on creation
    redirect_uris: string;
    scopes: string;
}

interface Scope {
    id: string;
    name: string;
    description: string
}

export default function AppsPage() {
    const [apps, setApps] = useState<ClientApp[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [createdApp, setCreatedApp] = useState<ClientApp | null>(null);

    // Form state
    const [name, setName] = useState('');
    const [redirectUris, setRedirectUris] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Scope states
    const [availableScopes, setAvailableScopes] = useState<Scope[]>([]);
    const [selectedScopes, setSelectedScopes] = useState<Scope[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchApps();
        fetchScopes();

        // Close dropdown when clicking outside
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchScopes = async () => {
        try {
            const data = await api.get<Scope[]>('/api/scopes');
            setAvailableScopes(data || []);
        } catch (err) {
            console.error("Failed to fetch scopes", err);
        }
    };

    const fetchApps = async () => {
        try {
            const data = await api.get<ClientApp[]>('/api/apps');
            setApps(data || []);
            setLoading(false);
        } catch (err: unknown) {
             if (err instanceof Error) {
                 setError(err.message);
            } else {
                 setError('Failed to load apps');
            }
            setLoading(false);
        }
    };

    const toggleScope = (scope: Scope) => {
        if (selectedScopes.find(s => s.id === scope.id)) {
            setSelectedScopes(selectedScopes.filter(s => s.id !== scope.id));
        } else {
            setSelectedScopes([...selectedScopes, scope]);
        }
        setSearchTerm('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setCreatedApp(null);

        // Convert array of objects back to space-separated string for API
        const scopeString = selectedScopes.map(s => s.name).join(' ');

        try {
            const data = await api.post<ClientApp>('/api/apps', { name, redirect_uris: redirectUris, scopes: scopeString });

            setCreatedApp(data);
            setApps([...apps, data]);
            setName('');
            setRedirectUris('');
            setSelectedScopes([]);
        } catch (err: unknown) {
             if (err instanceof Error) {
                 setError(err.message);
            } else {
                 setError('Failed to create app');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const filteredOptions = availableScopes.filter(
        scope =>
            !selectedScopes.find(s => s.id === scope.id) &&
            scope.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

    return (

        <div className="space-y-6 max-w-5xl mx-auto p-4">
            <h1 className="text-3xl font-bold tracking-tight">OAuth Apps Management</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Register New App</CardTitle>
                    <CardDescription>Create a new OAuth application.</CardDescription>
                </CardHeader>
                <CardContent>
                    {error && <div className="text-destructive text-sm mb-4">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="app-name">App Name</Label>
                            <Input
                                id="app-name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="redirect-uris">Redirect URIs</Label>
                            <Input
                                id="redirect-uris"
                                value={redirectUris}
                                onChange={(e) => setRedirectUris(e.target.value)}
                                placeholder="https://example.com/callback"
                                required
                            />
                        </div>

                        {/* IMPROVED SCOPE SELECTION */}
                        <div className="space-y-2" ref={dropdownRef}>
                            <Label>Scopes</Label>
                            <div
                                className={cn(
                                    "min-h-[42px] p-2 flex flex-wrap gap-2 border rounded-md bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
                                    isDropdownOpen ? "ring-2 ring-ring ring-offset-2" : ""
                                )}
                                onClick={() => setIsDropdownOpen(true)}
                            >
                                {selectedScopes.map(scope => (
                                    <Badge key={scope.id} variant="secondary" className="gap-1 pr-0.5">
                                        {scope.name.replaceAll('_', ' ')}
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); toggleScope(scope); }}
                                            className="ml-1 hover:text-destructive rounded-full p-0.5"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                                <input
                                    className="flex-1 min-w-[120px] bg-transparent outline-none text-sm p-1 placeholder:text-muted-foreground"
                                    placeholder={selectedScopes.length === 0 ? "Select scopes..." : ""}
                                    value={searchTerm}
                                    onChange={(e) => { setSearchTerm(e.target.value); setIsDropdownOpen(true); }}
                                    onFocus={() => setIsDropdownOpen(true)}
                                />
                            </div>

                            {isDropdownOpen && filteredOptions.length > 0 && (
                                <div className="absolute z-10 w-full max-w-md mt-1 bg-popover border rounded-md shadow-md max-h-60 overflow-auto">
                                    {filteredOptions.map(scope => (
                                        <div
                                            key={scope.id}
                                            className="px-4 py-2 hover:bg-muted cursor-pointer text-sm"
                                            onClick={() => toggleScope(scope)}
                                        >
                                            <div className="font-medium">{scope.name.replaceAll('_', ' ')}</div>
                                            <div className="text-xs text-muted-foreground">{scope.description}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Button type="submit" disabled={submitting} className="w-full">
                            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {submitting ? 'Registering...' : 'Register App'}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Success Message with Credentials */}
            {createdApp && (
                <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800 shadow-sm">
                    <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-2">App Created Successfully!</h3>
                    <p className="text-sm text-green-700 dark:text-green-400 mb-4">Please copy your Client Secret now. It will not be shown again.</p>

                    <div className="space-y-3">
                        <div>
                            <span className="block text-xs font-medium text-muted-foreground uppercase tracking-wider">Client ID</span>
                            <div className="mt-1 flex items-center bg-muted/50 border rounded-md px-3 py-2">
                                <code className="flex-1 text-sm break-all">{createdApp.client_id}</code>
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => navigator.clipboard.writeText(createdApp.client_id)}>
                                    <Copy className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>
                        {createdApp.client_secret && (
                            <div>
                                <span className="block text-xs font-medium text-muted-foreground uppercase tracking-wider">Client Secret</span>
                                <div className="mt-1 flex items-center bg-muted/50 border border-destructive/20 rounded-md px-3 py-2">
                                    <code className="flex-1 text-sm text-destructive font-bold break-all">{createdApp.client_secret}</code>
                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => navigator.clipboard.writeText(createdApp.client_secret || '')}>
                                        <Copy className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* List Apps */}
            <Card>
                <CardHeader>
                    <CardTitle>Your Apps</CardTitle>
                </CardHeader>
                <CardContent>
                    {apps.length === 0 ? (
                        <div className="text-center py-8 border rounded-md border-dashed">
                            <p className="text-muted-foreground italic">No apps registered yet.</p>
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Client ID</TableHead>
                                        <TableHead>Redirect URIs</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {apps.map((app) => (
                                        <TableRow key={app.id}>
                                            <TableCell className="font-medium">{app.name}</TableCell>
                                            <TableCell className="font-mono text-xs">{app.client_id}</TableCell>
                                            <TableCell className="max-w-xs truncate" title={app.redirect_uris}>
                                                {app.redirect_uris}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
