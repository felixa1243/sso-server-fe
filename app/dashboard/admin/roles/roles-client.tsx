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
import { MoreHorizontal, Edit, Trash2, Key } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

export default function RolesClient({ initialRoles, availablePermissions }: { initialRoles: any[], availablePermissions: any[] }) {
    const [roles, setRoles] = useState(initialRoles);

    // States for Modals
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [isPermsModalOpen, setIsPermsModalOpen] = useState(false);

    const [editingRole, setEditingRole] = useState<any>(null);
    const [roleName, setRoleName] = useState('');

    const [selectedPermIds, setSelectedPermIds] = useState<string[]>([]);

    const openCreateModal = () => {
        setEditingRole(null);
        setRoleName('');
        setIsRoleModalOpen(true);
    };

    const openEditModal = (role: any) => {
        setEditingRole(role);
        setRoleName(role.Name);
        setIsRoleModalOpen(true);
    };

    const openPermsModal = (role: any) => {
        setEditingRole(role);
        setSelectedPermIds(role.Permissions?.map((p: any) => p.ID) || []);
        setIsPermsModalOpen(true);
    };

    const saveRole = async () => {
        try {
            if (editingRole) {
                // Update
                const updated = await api.put<any>(`/api/admin/roles/${editingRole.ID}`, { name: roleName });
                setRoles(roles.map(r => r.ID === editingRole.ID ? { ...updated, Permissions: editingRole.Permissions } : r));
            } else {
                // Create
                const created = await api.post<any>('/api/admin/roles', { name: roleName });
                setRoles([...roles, created]);
            }
            setIsRoleModalOpen(false);
        } catch (e) {
            console.error(e);
            alert('Failed to save role');
        }
    };

    const deleteRole = async (id: string) => {
        if (!confirm('Are you sure you want to delete this role?')) return;
        try {
            await api.delete(`/api/admin/roles/${id}`);
            setRoles(roles.filter(r => r.ID !== id));
        } catch (e) {
            console.error(e);
            alert('Failed to delete role');
        }
    };

    const savePermissions = async () => {
        if (!editingRole) return;
        try {
            await api.post(`/api/admin/roles/${editingRole.ID}/permissions`, { permission_ids: selectedPermIds });
            setIsPermsModalOpen(false);
            window.location.reload(); // Refresh to get updated role permissions from server
        } catch (e) {
            console.error(e);
            alert('Failed to save permissions');
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button onClick={openCreateModal}>Create Role</Button>
            </div>
            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Role Name</TableHead>
                            <TableHead>Permissions Count</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {roles.map((role) => (
                            <TableRow key={role.ID}>
                                <TableCell className="font-medium">{role.Name}</TableCell>
                                <TableCell>
                                    <Badge variant="secondary">{role.Permissions?.length || 0} Permissions</Badge>
                                </TableCell>
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
                                            <DropdownMenuItem onClick={() => openEditModal(role)}>
                                                <Edit className="mr-2 h-4 w-4" /> Edit Name
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => openPermsModal(role)}>
                                                <Key className="mr-2 h-4 w-4" /> Manage Permissions
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => deleteRole(role.ID)} className="text-red-600">
                                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                        {roles.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">No roles found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Role Create/Edit Modal */}
            <Dialog open={isRoleModalOpen} onOpenChange={setIsRoleModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingRole ? 'Edit Role' : 'Create Role'}</DialogTitle>
                        <DialogDescription>Enter a name for the role. (e.g. Admin, Editor)</DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Role Name</Label>
                            <Input id="name" value={roleName} onChange={(e) => setRoleName(e.target.value)} placeholder="e.g. Moderator" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsRoleModalOpen(false)}>Cancel</Button>
                        <Button onClick={saveRole}>{editingRole ? 'Update' : 'Create'}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Permissions Modal */}
            <Dialog open={isPermsModalOpen} onOpenChange={setIsPermsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Manage Permissions</DialogTitle>
                        <DialogDescription>Assign permissions to the role {editingRole?.Name}.</DialogDescription>
                    </DialogHeader>
                    <div className="py-4 max-h-[60vh] overflow-y-auto space-y-4">
                        {availablePermissions.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No permissions available. Create some first.</p>
                        ) : availablePermissions.map(perm => (
                            <div key={perm.ID} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`perm-${perm.ID}`}
                                    checked={selectedPermIds.includes(perm.ID)}
                                    onCheckedChange={(checked) => {
                                        if (checked) {
                                            setSelectedPermIds([...selectedPermIds, perm.ID]);
                                        } else {
                                            setSelectedPermIds(selectedPermIds.filter(id => id !== perm.ID));
                                        }
                                    }}
                                />
                                <label htmlFor={`perm-${perm.ID}`} className="text-sm font-medium leading-none flex items-center gap-2">
                                    <span>{perm.Name}</span>
                                    <Badge variant="outline" className="text-xs font-normal font-mono">{perm.Slug}</Badge>
                                </label>
                            </div>
                        ))}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsPermsModalOpen(false)}>Cancel</Button>
                        <Button onClick={savePermissions}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
