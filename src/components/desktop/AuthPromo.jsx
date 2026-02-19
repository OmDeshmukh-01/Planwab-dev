'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Search, Star, Shield, Zap } from 'lucide-react';

const promoImages = [
    'https://res.cloudinary.com/dhkkvo36x/image/upload/v1771430055/auth1_loj2l4.jpg',
    'https://res.cloudinary.com/dhkkvo36x/image/upload/v1771430059/auth2_xr22rz.jpg',
    'https://res.cloudinary.com/dhkkvo36x/image/upload/v1771430063/auth3_lo2rf4.jpg',
    'https://res.cloudinary.com/dhkkvo36x/image/upload/v1771430067/auth4_q0zyxj.jpg',
    'https://res.cloudinary.com/dhkkvo36x/image/upload/v1771430071/auth5_dpjpap.jpg'
];

const features = [
    { icon: Search, title: "Smart Vendor Discovery", description: "AI-powered matching with verified premium vendors" },
    { icon: Calendar, title: "Intelligent Planning", description: "Automated timelines and task management" },
    { icon: Star, title: "Premium Experience", description: "Curated marketplace with 5-star vendors only" }
];

const AuthPromo = ({ pageType }) => {
    const [currentImage, setCurrentImage] = useState(0);
    const [currentFeature, setCurrentFeature] = useState(0);

    useEffect(() => {
        const imageTimer = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % promoImages.length);
        }, 6000);
        return () => clearInterval(imageTimer);
    }, []);

    useEffect(() => {
        const featureTimer = setInterval(() => {
            setCurrentFeature((prev) => (prev + 1) % features.length);
        }, 4000);
        return () => clearInterval(featureTimer);
    }, []);

    const isSignIn = pageType === 'sign-in';

    const promoContent = {
        title: isSignIn ? "Welcome Back to PlanWab" : "Join PlanWab Today",
        subtitle: isSignIn
            ? "Your perfect events await. Sign in to continue crafting unforgettable moments with our premium vendors."
            : "Create extraordinary events with our premium vendor marketplace and AI-powered planning tools.",
        badge: isSignIn ? "Welcome Back" : "Get Started"
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.4 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 12 } }
    };

    return (
        <div 
            className='hidden lg:block fixed top-0 left-0 w-1/2 h-screen text-white overflow-hidden'
            style={{ clipPath: 'url(#shatterClip)' }}
        >
            <div className="relative w-full h-full">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentImage}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
                        className='absolute inset-0 z-0'
                    >
                        <img 
                            src={promoImages[currentImage]} 
                            alt="Event Promo" 
                            className='w-full h-full object-cover' 
                        />
                    </motion.div>
                </AnimatePresence>

                <div className='absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-transparent z-10'></div>
                <div className='absolute top-0 right-0 h-full w-1/3 bg-gradient-to-r from-transparent to-black z-10'></div>

                <div className="relative z-20 flex flex-col h-full justify-between p-10">
                    <motion.div
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div className="flex items-center justify-between pr-8">
                            <a href="/" className="flex items-center gap-3">
                                <img src="/planwablogo.png" alt="PlanWab Logo" className="w-9 h-9" />
                                <span className="text-white font-bold text-2xl tracking-tight">PlanWab</span>
                            </a>
                            <div className="px-3 py-1 bg-gradient-to-r from-amber-400/10 to-amber-600/10 rounded-full border border-amber-400/20">
                                <span className="text-amber-400 text-xs font-medium">{promoContent.badge}</span>
                            </div>
                        </div>
                        <p className="text-amber-400/80 text-xs font-medium mt-2 ml-12">Premium Event Planning</p>
                    </motion.div>

                    <motion.div
                        className='flex-1 flex flex-col justify-center max-w-md'
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={pageType}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -30 }}
                                transition={{ duration: 0.6, ease: 'easeInOut' }}
                                className="space-y-5"
                            >
                                <div className="space-y-3">
                                    <motion.h1 
                                        variants={itemVariants} 
                                        className='text-4xl font-bold leading-tight bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent'
                                    >
                                        {promoContent.title}
                                    </motion.h1>
                                    <motion.p 
                                        variants={itemVariants} 
                                        className='text-base text-gray-300 leading-relaxed'
                                    >
                                        {promoContent.subtitle}
                                    </motion.p>
                                </div>

                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentFeature}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.5 }}
                                        className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 shadow-lg"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`p-2 rounded-lg bg-gradient-to-br ${
                                                currentFeature === 0 ? 'from-blue-500 to-blue-600' :
                                                currentFeature === 1 ? 'from-emerald-500 to-emerald-600' :
                                                'from-amber-500 to-amber-600'
                                            }`}>
                                                {React.createElement(features[currentFeature].icon, { className: "text-white w-4 h-4" })}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-base font-semibold text-white mb-1">{features[currentFeature].title}</h3>
                                                <p className="text-gray-300 text-xs leading-relaxed">{features[currentFeature].description}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>

                    <motion.div className='flex flex-wrap gap-3' variants={containerVariants} initial="hidden" animate="visible">
                        <motion.div variants={itemVariants} className='flex items-center gap-2'>
                            <div className='p-1.5 bg-gradient-to-br from-violet-500/15 to-violet-600/15 rounded-md backdrop-blur-sm border border-violet-400/20'><Shield className='text-violet-400' size={14} /></div>
                            <span className='font-medium text-xs text-gray-300'>Verified Vendors</span>
                        </motion.div>
                        <motion.div variants={itemVariants} className='flex items-center gap-2'>
                            <div className='p-1.5 bg-gradient-to-br from-emerald-500/15 to-emerald-600/15 rounded-md backdrop-blur-sm border border-emerald-400/20'><Zap className='text-emerald-400' size={14} /></div>
                            <span className='font-medium text-xs text-gray-300'>AI Matching</span>
                        </motion.div>
                        <motion.div variants={itemVariants} className='flex items-center gap-2'>
                            <div className='p-1.5 bg-gradient-to-br from-rose-500/15 to-rose-600/15 rounded-md backdrop-blur-sm border border-rose-400/20'><Star className='text-rose-400' size={14} /></div>
                            <span className='font-medium text-xs text-gray-300'>Premium Quality</span>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

export default AuthPromo;