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
import { MoreHorizontal, Shield, Ban, Trash2, Gavel } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';

export default function UsersClient({ initialUsers, availableRoles }: { initialUsers: any[], availableRoles: any[] }) {
    const [users, setUsers] = useState(initialUsers);

    // States for Modals
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [isRolesModalOpen, setIsRolesModalOpen] = useState(false);
    const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);

    const [isPunishmentOpen, setIsPunishmentOpen] = useState(false);
    const [punishments, setPunishments] = useState<any[]>([]);

    const handleBanToggle = async (user: any) => {
        try {
            // Simplistic approach based on assumed properties or logic. 
            // If user has active BAN punishment, we unban. Otherwise we ban.
            const hasActiveBan = user.Punishments?.some((p: any) => p.Type === 'BAN' && new Date(p.EndTime) > new Date());
            if (hasActiveBan) {
                await api.put(`/api/admin/users/${user.ID}/unban`, {});
            } else {
                await api.put(`/api/admin/users/${user.ID}/ban`, {});
            }
            // Refresh the page or fetch users again
            window.location.reload();
        } catch (e) {
            console.error(e);
            alert('Failed to toggle ban status');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        try {
            await api.delete(`/api/admin/users/${id}`);
            setUsers(users.filter(u => u.ID !== id));
        } catch (e) {
            console.error(e);
            alert('Failed to delete user');
        }
    };

    const openRolesModal = (user: any) => {
        setSelectedUser(user);
        setSelectedRoleIds(user.Role?.map((r: any) => r.ID) || []);
        setIsRolesModalOpen(true);
    };

    const saveRoles = async () => {
        if (!selectedUser) return;
        try {
            await api.put(`/api/admin/users/${selectedUser.ID}/roles`, { role_ids: selectedRoleIds });
            setIsRolesModalOpen(false);
            window.location.reload();
        } catch (e) {
            console.error(e);
            alert('Failed to save roles');
        }
    };

    const viewPunishments = async (user: any) => {
        try {
            const res = await api.get<any>(`/api/admin/users/${user.ID}/punishments`);
            setPunishments(res);
            setSelectedUser(user);
            setIsPunishmentOpen(true);
        } catch (e) {
            console.error(e);
            alert('Failed to load punishments');
        }
    };

    const revokePunishment = async (id: string) => {
        try {
            await api.delete(`/api/admin/punishments/${id}`);
            setPunishments(punishments.filter(p => p.ID !== id));
        } catch (e) {
            console.error(e);
            alert('Failed to revoke punishment');
        }
    };

    const issuePunishment = async () => {
        if (!selectedUser) return;
        const type = prompt("Type (e.g., BAN, MUTE):");
        const reason = prompt("Reason:");
        const durationStr = prompt("Duration in seconds (e.g., 3600 for 1 hour):");
        if (!type || !reason || !durationStr) return;

        try {
            await api.post('/api/admin/punishments', {
                user_id: selectedUser.ID,
                type,
                reason,
                duration: parseInt(durationStr)
            });
            viewPunishments(selectedUser);
        } catch (e) {
            console.error(e);
            alert('Failed to issue punishment');
        }
    };

    return (
        <div className="rounded-md border bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Roles</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => {
                        const hasActiveBan = user.Punishments?.some((p: any) => p.Type === 'BAN' && new Date(p.EndTime) > new Date());
                        return (
                            <TableRow key={user.ID}>
                                <TableCell className="font-medium">{user.Email}</TableCell>
                                <TableCell>
                                    <div className="flex gap-1 flex-wrap">
                                        {user.Role?.map((role: any) => (
                                            <Badge key={role.ID} variant="secondary">{role.Name}</Badge>
                                        ))}
                                        {(!user.Role || user.Role.length === 0) && <span className="text-muted-foreground text-sm">None</span>}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {hasActiveBan ? (
                                        <Badge variant="destructive">Banned</Badge>
                                    ) : (
                                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Active</Badge>
                                    )}
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
                                            <DropdownMenuItem onClick={() => openRolesModal(user)}>
                                                <Shield className="mr-2 h-4 w-4" /> Manage Roles
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => viewPunishments(user)}>
                                                <Gavel className="mr-2 h-4 w-4" /> Manage Punishments
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleBanToggle(user)} className={hasActiveBan ? "text-green-600" : "text-orange-600"}>
                                                <Ban className="mr-2 h-4 w-4" /> {hasActiveBan ? 'Unban User' : 'Ban User'}
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => handleDelete(user.ID)} className="text-red-600">
                                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>

            {/* Roles Modal */}
            <Dialog open={isRolesModalOpen} onOpenChange={setIsRolesModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Manage Roles for {selectedUser?.Email}</DialogTitle>
                        <DialogDescription>Assign or remove roles from this user.</DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        {availableRoles.map(role => (
                            <div key={role.ID} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`role-${role.ID}`}
                                    checked={selectedRoleIds.includes(role.ID)}
                                    onCheckedChange={(checked) => {
                                        if (checked) {
                                            setSelectedRoleIds([...selectedRoleIds, role.ID]);
                                        } else {
                                            setSelectedRoleIds(selectedRoleIds.filter(id => id !== role.ID));
                                        }
                                    }}
                                />
                                <label htmlFor={`role-${role.ID}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    {role.Name}
                                </label>
                            </div>
                        ))}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsRolesModalOpen(false)}>Cancel</Button>
                        <Button onClick={saveRoles}>Save Roles</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Punishments Modal */}
            <Dialog open={isPunishmentOpen} onOpenChange={setIsPunishmentOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Punishments for {selectedUser?.Email}</DialogTitle>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <Button onClick={issuePunishment} size="sm">Issue New Punishment</Button>
                        {punishments.length === 0 ? (
                            <p className="text-sm text-muted-foreground mt-4">No punishments recorded.</p>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Reason</TableHead>
                                        <TableHead>Ends</TableHead>
                                        <TableHead></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {punishments.map(p => (
                                        <TableRow key={p.ID}>
                                            <TableCell><Badge variant="outline">{p.Type}</Badge></TableCell>
                                            <TableCell>{p.Reason}</TableCell>
                                            <TableCell>{new Date(p.EndTime).toLocaleString()}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" onClick={() => revokePunishment(p.ID)} className="text-red-500">Revoke</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
