import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import useAuthStore from '../../store/useAuthStore';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, Loader2 } from 'lucide-react';

const schema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

const LoginForm = () => {
    const { login, loading, error } = useAuthStore();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema)
    });

    const onSubmit = async (data) => {
        try {
            await login(data);
            navigate('/');
        } catch (err) {
            // Error is handled by store
        }
    };

    return (
        <div className="w-full max-w-md p-8 glass-card rounded-2xl animate-fade-in shadow-2xl">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent mb-2">
                    Welcome Back
                </h1>
                <p className="text-muted-foreground">Manage your projects with ease.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                        <Mail size={16} className="text-primary" /> Email
                    </label>
                    <Input
                        {...register('email')}
                        placeholder="john@example.com"
                        className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                        <Lock size={16} className="text-primary" /> Password
                    </label>
                    <Input
                        {...register('password')}
                        type="password"
                        placeholder="••••••••"
                        className={errors.password ? 'border-red-500' : ''}
                    />
                    {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                </div>

                {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                <Button type="submit" className="w-full gap-2" disabled={loading}>
                    {loading ? <Loader2 className="animate-spin" size={18} /> : <LogIn size={18} />}
                    Sign In
                </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary hover:underline font-medium font-outfit">
                    Create one now
                </Link>
            </div>
        </div>
    );
};

export default LoginForm;
