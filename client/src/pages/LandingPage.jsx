import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import {
    Trello,
    Users,
    Zap,
    Shield,
    Github,
    ExternalLink,
    ChevronRight,
    ArrowRight,
    Play
} from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-[#020617] text-white selection:bg-primary/30">
            {/* Background Orbs */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            {/* Navigation */}
            <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#020617]/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
                            <Trello className="text-white" size={24} />
                        </div>
                        <span className="text-2xl font-outfit font-bold tracking-tighter">Antigravity</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
                        <a href="#features" className="hover:text-primary transition-colors">Features</a>
                        <a href="#workflow" className="hover:text-primary transition-colors">Workflow</a>
                        <a href="#community" className="hover:text-primary transition-colors">Community</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link to="/login">
                            <Button variant="ghost" className="text-sm font-medium">Log in</Button>
                        </Link>
                        <Link to="/register">
                            <Button className="text-sm font-medium px-6 shadow-lg shadow-primary/20">
                                Get Started
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-20 pb-32 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary text-xs font-bold uppercase tracking-widest mb-8 animate-fade-in">
                        <Zap size={14} className="animate-bounce" /> Version 2.0 is now live
                    </div>

                    <h1 className="text-6xl md:text-8xl font-outfit font-bold tracking-tighter leading-[0.9] mb-8 animate-fade-in group">
                        <span className="inline-block bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent transform group-hover:scale-[1.02] transition-transform duration-500">Accelerate Your</span>
                        <br />
                        <span className="inline-block bg-gradient-to-r from-primary via-purple-400 to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">Team's Potential.</span>
                    </h1>

                    <p className="max-w-2xl text-lg md:text-xl text-muted-foreground mb-12 animate-fade-in leading-relaxed" style={{ animationDelay: '0.1s' }}>
                        Antigravity is the high-performance project management engine for modern teams.
                        Real-time collaboration meets stunning precision.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        <Link to="/register">
                            <Button className="h-14 px-10 text-lg gap-3 shadow-xl shadow-primary/30">
                                Get Started for Free <ArrowRight size={20} />
                            </Button>
                        </Link>
                        <Button variant="outline" className="h-14 px-10 text-lg gap-3 backdrop-blur-md border-white/10">
                            <Play size={20} fill="currentColor" /> Watch Demo
                        </Button>
                    </div>

                    {/* Dashboard Preview */}
                    <div className="mt-20 w-full max-w-5xl relative animate-fade-in" style={{ animationDelay: '0.4s' }}>
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-500 rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                        <div className="relative aspect-video glass-card rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5"></div>
                            <div className="h-full w-full flex items-center justify-center text-muted-foreground/20">
                                <Trello size={120} className="group-hover:scale-110 transition-transform duration-700" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-32 px-6 border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-outfit font-bold tracking-tight mb-4">Built for clarity.</h2>
                        <p className="text-muted-foreground">Everything you need to ship products faster.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Zap,
                                title: 'Real-time Updates',
                                desc: 'See every move as it happens. No refreshes, no delays. Powered by Socket.io engine.'
                            },
                            {
                                icon: Users,
                                title: 'Team Workspaces',
                                desc: 'Organize by team, project, or department with fine-grained access controls.'
                            },
                            {
                                icon: Shield,
                                title: 'Advanced Security',
                                desc: 'Your data is encrypted and protected with industry-standard JWT protocols.'
                            }
                        ].map((f, i) => (
                            <div key={i} className="p-8 glass-card rounded-3xl border border-white/5 hover:border-primary/30 transition-all duration-300 group">
                                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                                    <f.icon size={24} />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 px-6">
                <div className="max-w-5xl mx-auto glass-card rounded-[3rem] p-12 md:p-20 text-center border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px]" />
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-6xl font-outfit font-bold tracking-tight mb-8">Ready to transform your workflow?</h2>
                        <Link to="/register">
                            <Button className="h-16 px-12 text-xl gap-3 shadow-2xl shadow-primary/30 rounded-2xl">
                                Create Your Workspace <ChevronRight size={24} />
                            </Button>
                        </Link>
                        <p className="mt-8 text-muted-foreground">Free forever for small teams. No credit card required.</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 border-t border-white/5 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-3">
                        <Trello className="text-primary" size={24} />
                        <span className="text-xl font-outfit font-bold">Antigravity</span>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <a href="#" className="hover:text-white transition-colors">Twitter</a>
                        <a href="#" className="hover:text-white transition-colors">Documentation</a>
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                        Build with ❤️ by Antigravity AI
                        <Github size={16} />
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
