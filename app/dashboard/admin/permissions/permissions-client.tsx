'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function PermissionsClient({ initialPermissions }: { initialPermissions: any[] }) {
    const [permissions, setPermissions] = useState(initialPermissions);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');

    const openCreateModal = () => {
        setName('');
        setSlug('');
        setIsModalOpen(true);
    };

    const savePermission = async () => {
        try {
            const created = await api.post<any>('/api/admin/permissions', { name, slug });
            setPermissions([...permissions, created]);
            setIsModalOpen(false);
        } catch (e) {
            console.error(e);
            alert('Failed to create permission');
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button onClick={openCreateModal}>Create Permission</Button>
            </div>
            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Permission Name</TableHead>
                            <TableHead>Slug</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {permissions.map((perm) => (
                            <TableRow key={perm.ID}>
                                <TableCell className="font-medium">{perm.Name}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="font-mono bg-muted/50">{perm.Slug}</Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                        {permissions.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={2} className="text-center py-4 text-muted-foreground">No permissions found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create Permission</DialogTitle>
                        <DialogDescription>Define a new permission to be mapped to roles.</DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Can Delete Users" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="slug">Slug (Identifier)</Label>
                            <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="e.g. users.delete" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button onClick={savePermission}>Create</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
