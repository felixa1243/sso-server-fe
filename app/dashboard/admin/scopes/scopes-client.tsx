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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ScopesClient({ initialScopes }: { initialScopes: any[] }) {
    const [scopes, setScopes] = useState(initialScopes);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingScope, setEditingScope] = useState<any>(null);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const openCreateModal = () => {
        setEditingScope(null);
        setName('');
        setDescription('');
        setIsModalOpen(true);
    };

    const openEditModal = (scope: any) => {
        setEditingScope(scope);
        setName(scope.Name);
        setDescription(scope.Description);
        setIsModalOpen(true);
    };

    const saveScope = async () => {
        try {
            if (editingScope) {
                // Update
                // Note: the response returns the updated scope object
                const updated = await api.put<any>(`/api/admin/scopes/${editingScope.ID}`, { name, description });
                setScopes(scopes.map(s => s.ID === editingScope.ID ? updated : s));
            } else {
                // Create
                const created = await api.post<any>('/api/admin/scopes', { name, description });
                setScopes([...scopes, created]);
            }
            setIsModalOpen(false);
        } catch (e) {
            console.error(e);
            alert('Failed to save scope');
        }
    };

    const deleteScope = async (id: string) => {
        if (!confirm('Are you sure you want to delete this scope?')) return;
        try {
            await api.delete(`/api/admin/scopes/${id}`);
            setScopes(scopes.filter(s => s.ID !== id));
        } catch (e) {
            console.error(e);
            alert('Failed to delete scope');
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button onClick={openCreateModal}>Create Scope</Button>
            </div>
            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Scope Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {scopes.map((scope) => (
                            <TableRow key={scope.ID}>
                                <TableCell className="font-medium">{scope.Name}</TableCell>
                                <TableCell className="text-muted-foreground">{scope.Description}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => openEditModal(scope)}>
                                                <Edit className="mr-2 h-4 w-4" /> Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => deleteScope(scope.ID)} className="text-red-600">
                                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                        {scopes.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">No scopes found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingScope ? 'Edit Scope' : 'Create Scope'}</DialogTitle>
                        <DialogDescription>Define an OAuth2 scope mapping to permissions.</DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Scope Name</Label>
                            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. read:profile" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="desc">Description</Label>
                            <Input id="desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g. Allows reading user profile" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button onClick={saveScope}>{editingScope ? 'Update' : 'Create'}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
