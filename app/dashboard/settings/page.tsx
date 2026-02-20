'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
    const router = useRouter();
    const [isLoadingProfile, setIsLoadingProfile] = useState(false);
    const [isLoadingPassword, setIsLoadingPassword] = useState(false);
    const [isLoadingAvatar, setIsLoadingAvatar] = useState(false);

    const [errorProfile, setErrorProfile] = useState('');
    const [errorPassword, setErrorPassword] = useState('');
    const [errorAvatar, setErrorAvatar] = useState('');

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [avatarUri, setAvatarUri] = useState('');

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (typeof window !== 'undefined') {
                    const storedAvatar = localStorage.getItem('avatar_uri');
                    const profileData = await api.get('/api/auth/me').catch(() => null);
                    if (storedAvatar) setAvatarUri(`${process.env.NEXT_PUBLIC_AUTH_API_URL}${storedAvatar}`);

                    if (profileData && typeof profileData === 'object' && 'email' in profileData) {
                        setEmail((profileData as { email: string }).email);
                    }
                }
            } catch (e) {
                console.error(e);
            }
        };
        fetchUserData();
    }, []);

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoadingProfile(true);
        setErrorProfile('');
        try {
            await api.post('/api/profile/info', { full_name: fullName });
        } catch (err: unknown) {
            setErrorProfile(err instanceof Error ? err.message : 'Failed to update profile');
        } finally {
            setIsLoadingProfile(false);
        }
    };

    const handleSaveAvatar = async () => {
        if (!avatarUri) return;
        setIsLoadingAvatar(true);
        setErrorAvatar('');
        try {
            await api.post('/api/profile/avatar', { avatar_uri: avatarUri });
            if (typeof window !== 'undefined') {
                localStorage.setItem('avatar_uri', avatarUri.replace(process.env.NEXT_PUBLIC_AUTH_API_URL || '', ''));
            }
            router.refresh();
        } catch (err: unknown) {
            setErrorAvatar(err instanceof Error ? err.message : 'Failed to update avatar');
        } finally {
            setIsLoadingAvatar(false);
        }
    };

    const handleSavePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setErrorPassword("Passwords do not match");
            return;
        }
        setIsLoadingPassword(true);
        setErrorPassword('');
        try {
            await api.post('/api/profile/password', {
                old_password: oldPassword,
                new_password: newPassword,
                new_password_confirm: confirmPassword
            });
            await api.post('/api/auth/logout', {});
            router.push('/login');
        } catch (err: unknown) {
            setErrorPassword(err instanceof Error ? err.message : 'Failed to change password');
        } finally {
            setIsLoadingPassword(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 md:gap-8 max-w-4xl mx-auto w-full">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Manage your account settings and set e-mail preferences.</p>
            </div>

            <Separator />

            <div className="grid gap-6 md:grid-cols-2">
                {/* Profile Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Profile</CardTitle>
                        <CardDescription>
                            Update your personal details here.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {errorProfile && <div className="text-destructive text-sm mb-4">{errorProfile}</div>}
                        <form id="profile-form" onSubmit={handleSaveProfile} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    placeholder="John Doe"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input id="email" type="email" placeholder="john.doe@example.com" value={email} disabled />
                                <p className="text-[0.8rem] text-muted-foreground">
                                    Your email address is managed by your SSO provider.
                                </p>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4">
                        <Button type="submit" form="profile-form" disabled={isLoadingProfile || !fullName}>
                            {isLoadingProfile ? 'Saving...' : 'Save changes'}
                        </Button>
                    </CardFooter>
                </Card>

                <div className="flex flex-col gap-6">
                    {/* Profile Picture */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Avatar</CardTitle>
                            <CardDescription>
                                Personalize your account with a photo.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                            <Avatar className="h-24 w-24 border">
                                <AvatarImage src={avatarUri} alt="User Avatar" />
                                <AvatarFallback className="text-2xl">U</AvatarFallback>
                            </Avatar>
                            <div className="space-y-4 w-full">
                                {errorAvatar && <div className="text-destructive text-sm mb-4">{errorAvatar}</div>}
                                <div className="space-y-2">
                                    <Label htmlFor="avatar-url">Avatar URL</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="avatar-url"
                                            placeholder="https://example.com/avatar.jpg"
                                            className="flex-1"
                                            value={avatarUri}
                                            onChange={(e) => setAvatarUri(e.target.value)}
                                        />
                                        <Button variant="secondary" onClick={handleSaveAvatar} disabled={isLoadingAvatar || !avatarUri}>
                                            {isLoadingAvatar ? 'Updating...' : 'Update'}
                                        </Button>
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground text-center sm:text-left">
                                    You can provide an external URL to use as your avatar.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Change Password */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Password</CardTitle>
                            <CardDescription>
                                Change your password here. After saving, you&apos;ll be logged out.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {errorPassword && <div className="text-destructive text-sm mb-4">{errorPassword}</div>}
                            <form id="password-form" onSubmit={handleSavePassword} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="current">Current password</Label>
                                    <Input
                                        id="current"
                                        type="password"
                                        required
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="new">New password</Label>
                                    <Input
                                        id="new"
                                        type="password"
                                        required
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirm">Confirm new password</Label>
                                    <Input
                                        id="confirm"
                                        type="password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                            </form>
                        </CardContent>
                        <CardFooter className="border-t px-6 py-4">
                            <Button type="submit" form="password-form" variant="destructive" disabled={isLoadingPassword}>
                                {isLoadingPassword ? 'Updating...' : 'Update password'}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
