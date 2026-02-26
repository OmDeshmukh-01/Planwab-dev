'use client';

import { useState } from 'react';
import { User, Lock, Bell, Sun, Moon, Monitor, Upload, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { useClerk, useUser } from '@clerk/nextjs';

export default function SettingsPage() {
    const { openUserProfile } = useClerk();
    const { user } = useUser();

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Settings</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your account and site preferences.</p>
            </div>

            {/* Profile Settings */}
            <SettingsCard
                icon={User}
                title="Profile Information"
                description="Update your personal details and profile picture."
            >
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <img className="h-20 w-20 rounded-full object-cover" src="https://placehold.co/80x80/A78BFA/FFFFFF?text=A" alt="Admin" />
                        <button className="absolute bottom-0 right-0 bg-white dark:bg-gray-700 p-1.5 rounded-full shadow-md border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                            <Upload className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        </button>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{user?.fullName || "Admin User"}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{user?.primaryEmailAddress?.emailAddress || "admin@planwab.com"}</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <InputField label="Full Name" id="full-name" icon={User} defaultValue={user?.fullName || "Admin User"} disabled />
                    <InputField label="Email Address" id="email" icon={Mail} defaultValue={user?.primaryEmailAddress?.emailAddress || "admin@planwab.com"} disabled />
                </div>
                <div className="flex justify-end mt-4">
                    <button onClick={() => openUserProfile()} className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-indigo-700 text-sm">Update Profile</button>
                </div>
            </SettingsCard>

            {/* Notification Settings */}
            <SettingsCard
                icon={Bell}
                title="Notifications"
                description="Choose how you want to be notified about activities."
            >
                <div className="space-y-4">
                    <NotificationToggle label="New User Signups" description="When a new user registers on the platform." defaultChecked={true} />
                    <NotificationToggle label="New Vendor Applications" description="When a vendor submits an application." defaultChecked={true} />
                    <NotificationToggle label="Event Booking Confirmations" description="When a client confirms an event booking." />
                    <NotificationToggle label="Monthly Reports" description="Receive a summary report at the end of each month." />
                </div>
            </SettingsCard>

            {/* Appearance Card */}
            <AppearanceCard />
        </div>
    );
}

const AppearanceCard = () => {
    const { theme, setTheme } = useTheme();

    return (
        <SettingsCard
            icon={Sun}
            title="Appearance"
            description="Customize the look and feel of your dashboard."
        >
            <div className="flex space-x-2 rounded-lg bg-gray-100 dark:bg-gray-800 p-1">
                <ThemeButton icon={Sun} label="Light" isActive={theme === 'light'} onClick={() => setTheme('light')} />
                <ThemeButton icon={Moon} label="Dark" isActive={theme === 'dark'} onClick={() => setTheme('dark')} />
                <ThemeButton icon={Monitor} label="System" isActive={theme === 'system'} onClick={() => setTheme('system')} />
            </div>
        </SettingsCard>
    );
};

const SettingsCard = ({ icon: Icon, title, description, children }) => (
    <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
                <Icon className="w-6 h-6 text-indigo-600" />
                <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{title}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
                </div>
            </div>
        </div>
        <div className="p-6 bg-gray-50/50 dark:bg-gray-800/20">
            {children}
        </div>
    </div>
);

const InputField = ({ label, id, icon: Icon, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
        <div className="relative">
            {Icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Icon className="w-5 h-5 text-gray-400 dark:text-gray-500" /></div>}
            <input id={id} {...props} className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-100 dark:disabled:bg-gray-800`} />
        </div>
    </div>
);

const NotificationToggle = ({ label, description, defaultChecked = false }) => {
    const [enabled, setEnabled] = useState(defaultChecked);
    return (
        <div
            onClick={() => setEnabled(!enabled)}
            className="flex justify-between items-center p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
        >
            <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">{label}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
            </div>
            <div className={`relative w-11 h-6 rounded-full transition-colors ${enabled ? 'bg-indigo-600' : 'bg-gray-400 dark:bg-gray-600'}`}>
                <motion.div
                    className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow"
                    animate={{ x: enabled ? 20 : 0 }}
                    transition={{ type: 'spring', stiffness: 700, damping: 30 }}
                />
            </div>
        </div>
    );
};

const ThemeButton = ({ icon: Icon, label, isActive, onClick }) => (
    <button onClick={onClick} className="relative w-full flex justify-center items-center space-x-2 py-2 rounded-md text-sm font-medium focus:outline-none transition-colors">
        {isActive && <motion.div layoutId="theme-active" className="absolute inset-0 bg-white dark:bg-gray-700 rounded-md shadow-sm" />}
        <Icon className={`relative z-10 w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-gray-500 dark:text-gray-300'}`} />
        <span className={`relative z-10 ${isActive ? 'text-gray-800 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>{label}</span>
    </button>
);

