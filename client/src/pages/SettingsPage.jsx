import React, { useState, useRef, useEffect } from 'react';
import {
    User,
    Lock,
    Bell,
    Palette,
    Shield,
    Save,
    Loader2,
    Camera,
    Trash2,
    Mail,
    Smartphone,
    Eye,
    EyeOff,
    CheckCircle2,
    Clock,
    X,
    ShieldCheck
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import useAuthStore from '../store/useAuthStore';
import useThemeStore from '../store/useThemeStore';
import api from '../services/api';

const SettingsPage = () => {
    const { user, updateUser } = useAuthStore();
    const { theme, toggleTheme } = useThemeStore();
    const [activeTab, setActiveTab] = useState('profile');
    const [updating, setUpdating] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        bio: '',
        avatar: ''
    });

    const [securityData, setSecurityData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || '',
                email: user.email || '',
                bio: user.bio || '',
                avatar: user.avatar || ''
            });
        }
    }, [user]);

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'appearance', label: 'Appearance', icon: Palette },
    ];

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setUpdating(true);
        setMessage('');
        setError('');
        try {
            const res = await api.put('/auth/profile', profileData);
            updateUser(res.data);
            setMessage('Profile updated successfully!');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setUpdating(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (securityData.newPassword !== securityData.confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        setUpdating(true);
        setMessage('');
        setError('');
        try {
            await api.put('/auth/update-password', {
                currentPassword: securityData.currentPassword,
                newPassword: securityData.newPassword
            });
            setMessage('Password updated successfully!');
            setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update password');
        } finally {
            setUpdating(false);
        }
    };

    const handleRemoveAvatar = async () => {
        if (!window.confirm('Are you sure you want to remove your avatar?')) return;
        setUpdating(true);
        setMessage('');
        setError('');
        try {
            const res = await api.delete('/auth/profile/avatar');
            updateUser({ avatar: res.data.avatar });
            setProfileData(prev => ({ ...prev, avatar: res.data.avatar }));
            setMessage('Avatar removed successfully');
        } catch (err) {
            console.error('Remove avatar error:', err);
            setError('Failed to remove avatar');
        } finally {
            setUpdating(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Increased client side limit to 100MB to match server
            if (file.size > 100 * 1024 * 1024) {
                setError('Image size should be less than 100MB');
                e.target.value = '';
                return;
            }
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64Image = reader.result;

                // Instant Upload
                setUpdating(true);
                try {
                    const res = await api.put('/auth/profile', { avatar: base64Image });
                    updateUser(res.data);
                    setProfileData(prev => ({ ...prev, avatar: res.data.avatar }));
                    setMessage('Profile image updated successfully!');
                    setError('');
                } catch (err) {
                    console.error('Upload error:', err);
                    setError('Failed to upload image');
                } finally {
                    setUpdating(false);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const [twoFAEnabled, setTwoFAEnabled] = useState(false);

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-outfit tracking-tight">Account Settings</h1>
                    <p className="text-muted-foreground mt-1">Manage your personal information and preferences.</p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                <div className="w-full lg:w-64 flex flex-row lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setActiveTab(tab.id);
                                setMessage('');
                                setError('');
                            }}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${activeTab === tab.id
                                ? 'bg-primary/10 text-primary border border-primary/20 shadow-lg shadow-primary/5'
                                : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <tab.icon size={20} />
                            <span className="font-medium">{tab.label}</span>
                        </button>
                    ))}
                </div>

                <div className="flex-1 glass-card rounded-3xl border border-border/50 p-6 md:p-10 relative overflow-hidden">
                    {updating && (
                        <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px] z-50 flex items-center justify-center">
                            <Loader2 className="animate-spin text-primary" size={40} />
                        </div>
                    )}

                    {activeTab === 'profile' && (
                        <div className="space-y-8 animate-fade-in text-foreground">
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 pb-8 border-b border-border/50">
                                <div className="relative group">
                                    <img
                                        src={profileData.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=random`}
                                        alt="Avatar"
                                        className="w-24 h-24 rounded-2xl border-4 border-background shadow-2xl object-cover"
                                    />
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute -bottom-2 -right-2 p-2 bg-primary text-white rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Camera size={16} />
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold font-outfit">Profile Photo</h3>
                                    <p className="text-sm text-muted-foreground mt-1">Update your photo for your team to recognize you.</p>
                                    <div className="flex gap-3 mt-4">
                                        <Button size="sm" onClick={() => fileInputRef.current?.click()}>Upload New</Button>
                                        <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-500/10" onClick={handleRemoveAvatar}>Remove</Button>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Full Name</label>
                                    <Input
                                        value={profileData.name}
                                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                        className="bg-muted/30"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email Address</label>
                                    <Input
                                        value={profileData.email}
                                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                        className="bg-muted/30"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium">Bio</label>
                                    <textarea
                                        placeholder="Tell us about yourself..."
                                        value={profileData.bio}
                                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                        className="w-full min-h-[120px] bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none text-foreground"
                                    />
                                </div>

                                {message && <p className="text-sm text-green-500 font-medium md:col-span-2 flex items-center gap-2"><CheckCircle2 size={16} /> {message}</p>}
                                {error && <p className="text-sm text-red-500 font-medium md:col-span-2 flex items-center gap-2"><X size={16} /> {error}</p>}

                                <div className="pt-4">
                                    <Button type="submit" className="gap-2">
                                        <Save size={18} />
                                        Save Changes
                                    </Button>
                                </div>
                            </form>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="space-y-8 animate-fade-in text-foreground">
                            <div>
                                <h3 className="text-xl font-bold font-outfit mb-2">Security Settings</h3>
                                <p className="text-sm text-muted-foreground">Manage your password and security preferences.</p>
                            </div>

                            <form onSubmit={handleUpdatePassword} className="space-y-6 max-w-md">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Current Password</label>
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            className="bg-muted/30 pr-10"
                                            value={securityData.currentPassword}
                                            onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">New Password</label>
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        className="bg-muted/30"
                                        value={securityData.newPassword}
                                        onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                                        required
                                        minLength={6}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Confirm New Password</label>
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        className="bg-muted/30"
                                        value={securityData.confirmPassword}
                                        onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                                        required
                                    />
                                </div>

                                {message && <p className="text-sm text-green-500 font-medium flex items-center gap-2"><CheckCircle2 size={16} /> {message}</p>}
                                {error && <p className="text-sm text-red-500 font-medium flex items-center gap-2"><X size={16} /> {error}</p>}

                                <Button type="submit" className="gap-2">
                                    <ShieldCheck size={18} />
                                    Update Password
                                </Button>
                            </form>

                            <div className="pt-8 border-t border-border/50">
                                <h4 className="font-bold flex items-center gap-2 mb-4">
                                    <Smartphone size={18} /> Two-Factor Authentication
                                </h4>
                                <div className="flex items-center justify-between p-4 bg-muted/20 rounded-2xl border border-border/50">
                                    <div className="text-sm">
                                        <p className="font-medium">Authenticator App</p>
                                        <p className="text-muted-foreground text-xs">Use an app like Google Authenticator or Authy.</p>
                                    </div>
                                    <Button
                                        variant={twoFAEnabled ? "primary" : "outline"}
                                        size="sm"
                                        onClick={() => setTwoFAEnabled(!twoFAEnabled)}
                                    >
                                        {twoFAEnabled ? "Enabled" : "Enable"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="space-y-8 animate-fade-in text-foreground">
                            <div>
                                <h3 className="text-xl font-bold font-outfit mb-2">Notification Preferences</h3>
                                <p className="text-sm text-muted-foreground">Choose what updates you want to receive.</p>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { title: 'Email Notifications', desc: 'Receive daily digests of your projects.', key: 'email' },
                                    { title: 'Browser Push', desc: 'Get real-time updates while you work.', key: 'push' },
                                    { title: 'Mentions Only', desc: 'Only alert me when I am mentioned.', key: 'mentions' },
                                    { title: 'Card Assignments', desc: 'Notify me when I am assigned to a card.', key: 'assignments' }
                                ].map((item) => (
                                    <div key={item.key} className="flex items-center justify-between p-4 hover:bg-muted/30 rounded-2xl transition-all border border-transparent hover:border-border/30">
                                        <div>
                                            <p className="font-medium">{item.title}</p>
                                            <p className="text-xs text-muted-foreground">{item.desc}</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked={item.key !== 'mentions'} />
                                            <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'appearance' && (
                        <div className="space-y-8 animate-fade-in text-foreground">
                            <div>
                                <h3 className="text-xl font-bold font-outfit mb-2">Theme Preference</h3>
                                <p className="text-sm text-muted-foreground">Customize how the application looks to you.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button
                                    onClick={() => theme !== 'light' && toggleTheme()}
                                    className={`p-6 rounded-2xl border-2 text-left transition-all relative overflow-hidden ${theme === 'light'
                                        ? 'border-primary bg-primary/5'
                                        : 'border-border hover:border-border/80'
                                        }`}
                                >
                                    <div className="w-full h-24 bg-white rounded-lg border border-gray-200 mb-4 flex p-2 gap-2 text-foreground">
                                        <div className="w-1/4 h-full bg-gray-100 rounded"></div>
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                                            <div className="h-4 w-full bg-gray-100 rounded"></div>
                                        </div>
                                    </div>
                                    <span className="font-bold">Light Mode</span>
                                </button>

                                <button
                                    onClick={() => theme !== 'dark' && toggleTheme()}
                                    className={`p-6 rounded-2xl border-2 text-left transition-all relative overflow-hidden ${theme === 'dark'
                                        ? 'border-primary bg-primary/5 text-white'
                                        : 'border-border hover:border-border/80'
                                        }`}
                                >
                                    <div className="w-full h-24 bg-slate-900 rounded-lg border border-slate-800 mb-4 flex p-2 gap-2">
                                        <div className="w-1/4 h-full bg-slate-800 rounded"></div>
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 w-1/2 bg-slate-800 rounded"></div>
                                            <div className="h-4 w-full bg-slate-900 rounded"></div>
                                        </div>
                                    </div>
                                    <span className="font-bold">Dark Mode</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
