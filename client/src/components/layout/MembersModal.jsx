import React, { useState, useEffect } from 'react';
import { X, Users, Mail, UserPlus, Shield, Trash2, Loader2, Sparkles, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import api from '../../services/api';
import { cn } from '../../utils/cn';

const MembersModal = ({ isOpen, onClose, workspaceId }) => {
    const [members, setMembers] = useState([]);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [inviteLoading, setInviteLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetchMembers = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/workspaces/${workspaceId}/members`);
            setMembers(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchMembers();
        }
    }, [isOpen, workspaceId]);

    const handleInvite = async (e) => {
        e.preventDefault();
        if (!email.trim()) return;

        setInviteLoading(true);
        setError('');
        setSuccess('');

        try {
            await api.post(`/workspaces/${workspaceId}/invite`, { email });
            setSuccess('Invitation sent successfully!');
            setEmail('');
            fetchMembers();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send invitation');
        } finally {
            setInviteLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            <div className="relative w-full max-w-lg glass-card rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-purple-500"></div>

                <div className="p-6">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                                <Users size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold font-outfit">Team Members</h2>
                                <p className="text-xs text-muted-foreground">Manage who has access to this workspace.</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-muted rounded-full text-muted-foreground transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleInvite} className="mb-8 p-4 bg-muted/20 rounded-2xl border border-border/50">
                        <label className="text-sm font-bold mb-2 block">Invite by Email</label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                <Input
                                    placeholder="colleague@example.com"
                                    className="pl-10"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <Button type="submit" disabled={inviteLoading} className="gap-2">
                                {inviteLoading ? <Loader2 className="animate-spin" size={18} /> : <UserPlus size={18} />}
                                Invite
                            </Button>
                        </div>
                        {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
                        {success && <p className="text-xs text-green-500 mt-2 flex items-center gap-1"><Check size={12} /> {success}</p>}
                    </form>

                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-muted-foreground px-1 uppercase tracking-wider">Members ({members.length})</h3>
                        <div className="max-h-[300px] overflow-y-auto custom-scrollbar space-y-2">
                            {loading ? (
                                <div className="py-10 text-center animate-pulse text-muted-foreground text-sm">Loading members...</div>
                            ) : members.map((member) => (
                                <div key={member.user._id} className="flex items-center justify-between p-3 rounded-2xl bg-muted/10 border border-border/30 hover:bg-muted/30 transition-all">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={member.user.avatar || `https://ui-avatars.com/api/?name=${member.user.name}&background=random`}
                                            className="w-10 h-10 rounded-full border-2 border-primary/10"
                                            alt={member.user.name}
                                        />
                                        <div>
                                            <p className="text-sm font-bold leading-tight">{member.user.name}</p>
                                            <p className="text-[11px] text-muted-foreground">{member.user.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={cn(
                                            "text-[10px] uppercase font-bold px-2 py-0.5 rounded-full flex items-center gap-1",
                                            member.role === 'admin' ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                                        )}>
                                            {member.role === 'admin' && <Shield size={10} />}
                                            {member.role}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MembersModal;
