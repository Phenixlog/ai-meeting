import { Link } from 'react-router-dom';
import { Mic, FileText, Sparkles, CheckCircle2, Zap, ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { APP_NAME } from '@/lib/constants';

export function Home() {
    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-white">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-50" />

                {/* Gradient Orbs */}
                <div className="absolute top-20 right-1/4 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 left-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl" />

                <div className="container relative z-10">
                    <div className="min-h-[85vh] flex flex-col items-center justify-center text-center py-20">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-100 mb-8 animate-fade-in">
                            <Sparkles className="w-4 h-4 text-primary-600" />
                            <span className="text-sm font-medium text-primary-700">AI-Powered Meeting Intelligence</span>
                        </div>

                        {/* Main Title */}
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight mb-6 animate-slide-up">
                            Transform Meetings into
                            <span className="block mt-2 gradient-text">Actionable Insights</span>
                        </h1>

                        {/* Subtitle */}
                        <p className="max-w-2xl text-lg sm:text-xl text-gray-600 mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            {APP_NAME} captures, transcribes, and generates structured reports from your meetings automatically.
                            Never miss a decision or action item again.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            <Link to="/recording">
                                <Button size="lg" className="h-14 px-8 text-base font-semibold shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 transition-all">
                                    <Mic className="w-5 h-5 mr-2" />
                                    Start Recording
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                            <Link to="/history">
                                <Button variant="outline" size="lg" className="h-14 px-8 text-base font-semibold">
                                    <Play className="w-5 h-5 mr-2" />
                                    View Demo
                                </Button>
                            </Link>
                        </div>

                        {/* Trust Indicators */}
                        <div className="mt-16 flex items-center gap-8 text-sm text-gray-500 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                <span>Free to start</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                <span>No credit card required</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                <span>Powered by GPT-4</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="section bg-white border-t border-gray-100">
                <div className="container">
                    {/* Section Header */}
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="inline-block px-3 py-1 text-sm font-medium text-primary-700 bg-primary-50 rounded-full mb-4">
                            Features
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            Everything You Need for Productive Meetings
                        </h2>
                        <p className="text-lg text-gray-600">
                            Our AI-powered platform handles the documentation so you can focus on what matters most.
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Mic,
                                title: 'Smart Recording',
                                description: 'One-click recording with real-time timestamp markers for important moments, decisions, and action items.',
                                color: 'primary',
                                gradient: 'from-primary-500 to-primary-600',
                            },
                            {
                                icon: Zap,
                                title: 'AI Transcription',
                                description: 'Powered by OpenAI Whisper for accurate, fast transcription in multiple languages.',
                                color: 'purple',
                                gradient: 'from-purple-500 to-purple-600',
                            },
                            {
                                icon: FileText,
                                title: 'Auto Reports',
                                description: 'GPT-4 generates structured reports with summaries, decisions, action items, and key insights.',
                                color: 'emerald',
                                gradient: 'from-emerald-500 to-emerald-600',
                            },
                        ].map((feature) => (
                            <div
                                key={feature.title}
                                className="group relative p-8 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300"
                            >
                                {/* Icon */}
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <feature.icon className="w-7 h-7 text-white" />
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="section bg-slate-50">
                <div className="container">
                    {/* Section Header */}
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="inline-block px-3 py-1 text-sm font-medium text-primary-700 bg-primary-50 rounded-full mb-4">
                            How It Works
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            Three Simple Steps
                        </h2>
                        <p className="text-lg text-gray-600">
                            Get started in minutes and transform how you handle meeting documentation.
                        </p>
                    </div>

                    {/* Steps */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-5xl mx-auto">
                        {[
                            { step: '01', title: 'Record', desc: 'Start recording your meeting with one click. Add optional metadata like title and meeting type.' },
                            { step: '02', title: 'Process', desc: 'Our AI transcribes your audio using OpenAI Whisper and analyzes the content automatically.' },
                            { step: '03', title: 'Review', desc: 'Get a structured report with executive summary, decisions, action items, and key insights.' },
                        ].map((item, i) => (
                            <div key={item.step} className="relative text-center">
                                {/* Connector Line (hidden on mobile) */}
                                {i < 2 && (
                                    <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary-300 to-transparent" />
                                )}

                                {/* Step Number */}
                                <div className="w-20 h-20 rounded-2xl bg-white border-2 border-primary-100 text-primary-600 font-bold text-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary-100/50">
                                    {item.step}
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                    {item.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section bg-gradient-to-br from-primary-600 via-primary-700 to-purple-800">
                <div className="container text-center">
                    <div className="max-w-3xl mx-auto">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur mb-8">
                            <CheckCircle2 className="w-8 h-8 text-white" />
                        </div>

                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                            Ready to Transform Your Meetings?
                        </h2>

                        <p className="text-lg sm:text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
                            Join thousands of professionals who save hours every week with AI-powered meeting documentation.
                        </p>

                        <Link to="/recording">
                            <Button size="lg" className="h-14 px-10 text-base font-semibold bg-white text-primary-700 hover:bg-primary-50 shadow-xl">
                                <Mic className="w-5 h-5 mr-2" />
                                Start Recording Now
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
