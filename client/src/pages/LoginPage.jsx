import React from 'react';
import LoginForm from '../components/auth/LoginForm';

const LoginPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#020617] relative overflow-hidden">
            {/* Decorative Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>

            <div className="relative z-10 w-full px-4 flex flex-col items-center">
                <div className="mb-8 flex items-center gap-3 animate-fade-in">
                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-2xl shadow-primary/50">
                        <svg className="text-white w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <span className="text-3xl font-outfit font-bold tracking-tighter">Antigravity</span>
                </div>
                <LoginForm />
            </div>
        </div>
    );
};

export default LoginPage;
