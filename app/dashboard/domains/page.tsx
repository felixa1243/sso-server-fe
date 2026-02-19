'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ExternalLink, Loader2 } from 'lucide-react';

interface Domain {
    ID: string;
    Name: string;
    URL: string;
    CreatedAt: string;
}

export default function DomainsPage() {
    const [domains, setDomains] = useState<Domain[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchDomains();
    }, []);

    const fetchDomains = async () => {
        try {
            const data = await api.get<Domain[]>('/api/domains');
            setDomains(data || []);
        } catch (err: unknown) {
            console.error(err);
             if (err instanceof Error) {
                 setError(err.message);
            } else {
                 setError('Failed to load domains');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            const res = await api.post<Domain>('/api/domains', { name, url });
            setDomains([...domains, res]);
            setName('');
            setUrl('');
        } catch (err: unknown) {
             if (err instanceof Error) {
                 setError(err.message);
            } else {
                 setError('Failed to create domain');
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold tracking-tight">Domain Management</h1>

            <div className="grid gap-6 md:grid-cols-2">
                 <Card>
                    <CardHeader>
                        <CardTitle>Register New Domain</CardTitle>
                        <CardDescription>Enter the details for your new domain.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {error && <div className="text-destructive text-sm mb-4">{error}</div>}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Domain Name</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g., mysite"
                                    required
                                />
                                <p className="text-xs text-muted-foreground">Unique identifier for your domain.</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="url">Domain URL</Label>
                                <Input
                                    type="url"
                                    id="url"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="https://mysite.com"
                                    required
                                />
                                <p className="text-xs text-muted-foreground">Full URL of your application.</p>
                            </div>
                            <Button type="submit" disabled={submitting} className="w-full">
                                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {submitting ? 'Registering...' : 'Register Domain'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Your Domains</CardTitle>
                        <CardDescription>List of domains you have registered.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         {domains.length === 0 ? (
                            <div className="text-center py-8 border rounded-md border-dashed">
                                <p className="text-muted-foreground italic">No domains registered yet.</p>
                            </div>
                        ) : (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>URL</TableHead>
                                            <TableHead>Created At</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {domains.map((domain) => (
                                            <TableRow key={domain.ID}>
                                                <TableCell className="font-medium">{domain.Name}</TableCell>
                                                <TableCell>
                                                    <a href={domain.URL} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                                                        {domain.URL}
                                                        <ExternalLink className="h-3 w-3" />
                                                    </a>
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(domain.CreatedAt).toLocaleDateString()}
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
        </div>
    );
}
