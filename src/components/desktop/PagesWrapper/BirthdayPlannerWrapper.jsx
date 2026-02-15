'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ArrowLeft, 
    ArrowRight, 
    Search, 
    Calendar, 
    Users, 
    Clock, 
    User, 
    Phone, 
    CheckCircle, 
    MapPin,
    Star,
    Gift,
    Save,
    Sparkles,
    Check,
    ChevronRight,
    PartyPopper,
    Cake,
    X
} from 'lucide-react';

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

const validateUserDetails = (formData) => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.phone.trim()) {
        errors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
        errors.phone = 'Phone number must be 10 digits';
    }
    if (!formData.birthdayDate) errors.birthdayDate = 'Birthday date is required';
    return errors;
};

const validateBookingDetails = (formData) => {
    const errors = {};
    if (!formData.eventDate) errors.eventDate = 'Event date is required';
    if (!formData.guestCount) {
        errors.guestCount = 'Number of guests is required';
    } else if (parseInt(formData.guestCount) < 1) {
        errors.guestCount = 'Must have at least 1 guest';
    }
    if (!formData.timeSlot) errors.timeSlot = 'Time slot is required';
    if (!formData.specialRequests.trim()) errors.specialRequests = 'Special requests are required';
    return errors;
};

// ============================================================================
// DEBOUNCE HOOK
// ============================================================================

const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
};

// ============================================================================
// REUSABLE COMPONENTS
// ============================================================================

const InputField = ({ label, icon: Icon, error, ...props }) => (
    <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            {Icon && <Icon size={16} className="text-pink-500" />}
            {label}
        </label>
        <input
            className={`w-full bg-white dark:bg-white/5 border-2 ${
                error ? 'border-rose-500' : 'border-gray-200 dark:border-white/10'
            } rounded-xl py-3.5 px-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 transition-all`}
            {...props}
        />
        {error && (
            <motion.p 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-rose-500 text-xs font-medium flex items-center gap-1"
            >
                <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                {error}
            </motion.p>
        )}
    </div>
);

const ProgressBar = ({ currentStep }) => {
    const steps = ['details', 'venue', 'booking'];
    const currentIndex = steps.indexOf(currentStep);
    const progress = ((currentIndex + 1) / steps.length) * 100;

    return (
        <div className="w-full bg-gray-200 dark:bg-white/10 rounded-full h-2 overflow-hidden">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full"
            />
        </div>
    );
};

const StepBadge = ({ step, isActive, isCompleted }) => {
    const stepConfig = {
        details: { icon: User, label: 'Your Details', number: 1 },
        venue: { icon: MapPin, label: 'Select Venue', number: 2 },
        booking: { icon: Calendar, label: 'Confirm Booking', number: 3 }
    };

    const config = stepConfig[step];
    const Icon = config.icon;

    return (
        <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                isCompleted 
                    ? 'bg-green-500 text-white' 
                    : isActive 
                    ? 'bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-lg' 
                    : 'bg-gray-200 dark:bg-white/10 text-gray-400'
            }`}>
                {isCompleted ? <Check size={20} /> : config.number}
            </div>
            <div className={`transition-colors ${
                isActive ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-600'
            }`}>
                <div className="text-xs font-medium">{config.label}</div>
            </div>
        </div>
    );
};

const HotelCard = ({ hotel, onSelect, type, isSelected }) => (
    <motion.div
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onSelect(hotel)}
        className={`group relative bg-white dark:bg-white/5 border-2 ${
            isSelected ? 'border-pink-500 ring-4 ring-pink-500/20' : 'border-gray-200 dark:border-white/10'
        } rounded-2xl overflow-hidden hover:border-pink-500 dark:hover:border-pink-500 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-2xl`}
    >
        {isSelected && (
            <div className="absolute top-4 left-4 z-10 bg-pink-500 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg">
                <Check size={14} /> Selected
            </div>
        )}
        
        <div className="relative h-48 overflow-hidden">
            <img
                src={hotel.images[0] || '/placeholder.jpg'}
                alt={hotel.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute top-4 right-4">
                <span className={`px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-xl shadow-xl ${
                    type === 'premium'
                        ? 'bg-amber-500/95 text-white border border-amber-300/50'
                        : 'bg-emerald-500/95 text-white border border-emerald-300/50'
                }`}>
                    {type === 'premium' ? '✨ Premium' : '🎁 Free'}
                </span>
            </div>
        </div>

        <div className="p-5">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1.5 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors line-clamp-1">
                {hotel.name}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-1.5 mb-4">
                <MapPin size={14} className="text-pink-500 flex-shrink-0" /> 
                <span className="line-clamp-1">{hotel.location}</span>
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/10">
                {hotel.price ? (
                    <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Starting from</div>
                        <div className="text-xl font-bold text-gray-900 dark:text-white">
                            ₹{hotel.price.toLocaleString()}
                        </div>
                    </div>
                ) : (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">Free Booking</span>
                )}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white shadow-lg group-hover:shadow-pink-500/50 transition-shadow">
                    <ChevronRight size={20} />
                </div>
            </div>
        </div>
    </motion.div>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function BirthdayPlannerWrapper() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentStep = searchParams.get('step') || 'home';
    const sessionId = searchParams.get('sessionId');

    const [isHydrating, setIsHydrating] = useState(true);

    // Step 1: User Details
    const [userFormData, setUserFormData] = useState({ name: '', phone: '', birthdayDate: '' });
    const [userErrors, setUserErrors] = useState({});
    const [isUserSubmitting, setIsUserSubmitting] = useState(false);

    // Step 2: Hotels
    const [searchQuery, setSearchQuery] = useState('');
    const [freeHotels, setFreeHotels] = useState([]);
    const [paidHotels, setPaidHotels] = useState([]);
    const [isHotelsLoading, setIsHotelsLoading] = useState(false);
    const debouncedSearch = useDebounce(searchQuery, 500);

    // Step 3: Booking
    const [bookingFormData, setBookingFormData] = useState({
        eventDate: '', guestCount: '', timeSlot: '', specialRequests: ''
    });
    const [bookingErrors, setBookingErrors] = useState({});
    const [isBookingSubmitting, setIsBookingSubmitting] = useState(false);
    const [selectedHotel, setSelectedHotel] = useState(null);

    // Step 4: Confirmation
    const [confirmationData, setConfirmationData] = useState(null);

    const basePath = pathname.split('?')[0];

    // Get current step for progress
    const getCurrentStepKey = () => {
        if (currentStep === 'home') return 'details';
        if (currentStep === 'hotels') return 'venue';
        if (currentStep === 'booking') return 'booking';
        return 'details';
    };

    // ============================================================================
    // HYDRATION FROM BACKEND
    // ============================================================================

    useEffect(() => {
        const fetchBookingState = async () => {
            if (!sessionId) {
                setIsHydrating(false);
                return;
            }

            try {
                const response = await fetch(`/api/vendor/requests/birthday-routes?sessionId=${sessionId}`);
                const data = await response.json();

                if (response.ok && data.success && data.data) {
                    const booking = data.data;

                    if (booking.userDetails) {
                        setUserFormData({
                            name: booking.userDetails.name || '',
                            phone: booking.userDetails.phone || '',
                            birthdayDate: booking.userDetails.birthdayDate 
                                ? new Date(booking.userDetails.birthdayDate).toISOString().split('T')[0] 
                                : ''
                        });
                    }

                    if (booking.venueId) {
                        setSelectedHotel({
                            _id: booking.venueId,
                            name: booking.venueName,
                            location: booking.venueLocation,
                            price: booking.venuePrice,
                            isPaid: (booking.venuePrice || 0) >= 60000,
                            images: []
                        });
                    }

                    if (booking.bookingDetails) {
                        setBookingFormData({
                            eventDate: booking.bookingDetails.eventDate 
                                ? new Date(booking.bookingDetails.eventDate).toISOString().split('T')[0] 
                                : '',
                            guestCount: booking.bookingDetails.guestCount || '',
                            timeSlot: booking.bookingDetails.timeSlot || '',
                            specialRequests: booking.bookingDetails.specialRequests || ''
                        });
                    }

                    if (booking.status === 'completed' || booking.bookingId) {
                        setConfirmationData({
                            bookingId: booking.bookingId || booking._id,
                            hotel: {
                                name: booking.venueName,
                                location: booking.venueLocation,
                                price: booking.venuePrice,
                                isPaid: (booking.venuePrice || 0) >= 60000
                            },
                            bookingDetails: booking.bookingDetails || {},
                        });
                    }

                    if (booking.userDetails?.birthdayDate && (!booking.bookingDetails || !booking.bookingDetails.eventDate)) {
                        const birthday = new Date(booking.userDetails.birthdayDate);
                        const currentYear = new Date().getFullYear();
                        const eventDate = new Date(currentYear, birthday.getMonth(), birthday.getDate());
                        setBookingFormData(prev => ({
                            ...prev,
                            eventDate: eventDate.toISOString().split('T')[0]
                        }));
                    }
                }
            } catch (error) {
                console.error("Failed to hydrate session:", error);
            } finally {
                setIsHydrating(false);
            }
        };

        fetchBookingState();
    }, [sessionId]);

    // ============================================================================
    // ROUTE PROTECTION
    // ============================================================================

    useEffect(() => {
        if (isHydrating) return;

        if (currentStep === 'hotels' || currentStep === 'booking') {
            if (!sessionId) {
                toast.error('Session expired or invalid.');
                router.push(basePath);
            }
        }

        if (currentStep === 'booking' && !selectedHotel && !isHydrating) {
            if (sessionId) {
                toast.error('Please select a venue first');
                router.push(`${basePath}?step=hotels&sessionId=${sessionId}`);
            }
        }
    }, [currentStep, sessionId, isHydrating, selectedHotel, router, basePath]);

// ============================================================================
// FETCH VENUES WITH DEBOUNCE
// ============================================================================

useEffect(() => {
    const fetchVenues = async () => {
        if (currentStep !== 'hotels') return;

        try {
            setIsHotelsLoading(true);
            
            // Build query parameters
            const params = new URLSearchParams({
                category: 'venues',  // Changed from 'categories' to 'category' for single value
                limit: '50',
                sortBy: 'rating',
                sortOrder: 'desc'
            });

            // Add search if exists
            if (debouncedSearch) {
                params.append('search', debouncedSearch);
            }

            const url = `/api/vendor?${params.toString()}`;
            console.log('Fetching venues from:', url); // Debug log
            
            const response = await fetch(url);
            const data = await response.json();

            console.log('API Response:', data); // Debug log

            if (data.success && data.data) {
                const venues = data.data;
                console.log(`Found ${venues.length} venues`); // Debug log
                
                const free = [];
                const paid = [];

                venues.forEach(vendor => {
                    // Price normalization - check multiple price fields
                    const price = 
                        vendor.normalizedPrice ||
                        vendor.perDayPrice?.min ||
                        vendor.basePrice ||
                        vendor.price?.min ||
                        vendor.startingPrice ||
                        0;

                    const normalizedVendor = {
                        _id: vendor._id,
                        name: vendor.name,
                        location: vendor.address?.city || vendor.location || 'Location Unavailable',
                        isPaid: price >= 60000,
                        images: vendor.images?.length > 0 
                            ? vendor.images 
                            : (vendor.defaultImage ? [vendor.defaultImage] : ['/placeholder.jpg']),
                        price: price > 0 ? price : null
                    };

                    if (price >= 60000) {
                        paid.push(normalizedVendor);
                    } else {
                        free.push(normalizedVendor);
                    }
                });

                // Sort by price
                free.sort((a, b) => (a.price || 0) - (b.price || 0));
                paid.sort((a, b) => (b.price || 0) - (a.price || 0));

                console.log(`Free venues: ${free.length}, Paid venues: ${paid.length}`); // Debug log

                setFreeHotels(free.slice(0, 6));
                setPaidHotels(paid.slice(0, 6));

                // Show toast if no results
                if (venues.length === 0) {
                    toast.info('No venues found matching your criteria');
                }
            } else {
                console.error('API returned unsuccessful response:', data);
                toast.error(data.message || "Failed to load venues");
                setFreeHotels([]);
                setPaidHotels([]);
            }
        } catch (error) {
            console.error("Failed to fetch venues:", error);
            toast.error("Failed to load venues. Please try again.");
            setFreeHotels([]);
            setPaidHotels([]);
        } finally {
            setIsHotelsLoading(false);
        }
    };

    fetchVenues();
}, [currentStep, debouncedSearch]);

    // ============================================================================
    // HANDLERS
    // ============================================================================

    const handleUserSubmit = async (e) => {
        e.preventDefault();
        const errors = validateUserDetails(userFormData);
        if (Object.keys(errors).length > 0) {
            setUserErrors(errors);
            return;
        }

        setIsUserSubmitting(true);
        try {
            const newSessionId = (typeof crypto !== 'undefined' && crypto.randomUUID 
                ? crypto.randomUUID() 
                : 'session_' + Date.now());

            const response = await fetch('/api/vendor/requests/birthday-routes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId: newSessionId,
                    userDetails: userFormData
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.details || data.error || 'Failed to create booking');
            }

            const birthday = new Date(userFormData.birthdayDate);
            const currentYear = new Date().getFullYear();
            const eventDate = new Date(currentYear, birthday.getMonth(), birthday.getDate());
            const eventDateString = eventDate.toISOString().split('T')[0];

            setBookingFormData(prev => ({ ...prev, eventDate: eventDateString }));

            toast.success('Details saved successfully! 🎉');
            router.push(`${basePath}?step=hotels&sessionId=${newSessionId}`);
        } catch (error) {
            console.error('Submission Error:', error);
            toast.error(error.message || 'Failed to save details.');
        } finally {
            setIsUserSubmitting(false);
        }
    };

    const handleSelectHotel = async (hotel) => {
        if (!sessionId) {
            toast.error("Session missing. Please restart.");
            return;
        }

        try {
            setSelectedHotel(hotel);

            const response = await fetch('/api/vendor/requests/birthday-routes', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId,
                    venueId: hotel._id,
                    venueName: hotel.name,
                    venueLocation: hotel.location,
                    venuePrice: hotel.price
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to save venue selection');
            }

            toast.success('Venue selected! 🎉');
            router.push(`${basePath}?step=booking&sessionId=${sessionId}`);
        } catch (error) {
            console.error("Hotel Selection Error:", error);
            toast.error("Failed to save selection. Please try again.");
        }
    };

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        const errors = validateBookingDetails(bookingFormData);
        if (Object.keys(errors).length > 0) {
            setBookingErrors(errors);
            return;
        }

        setIsBookingSubmitting(true);
        try {
            if (!sessionId) throw new Error("Session ID missing");

            const response = await fetch('/api/vendor/requests/birthday-routes', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId,
                    bookingDetails: bookingFormData
                })
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to confirm booking');
            }

            const confirmation = {
                bookingId: data.data.bookingId || data.data._id || 'BK' + Date.now(),
                hotel: selectedHotel,
                userDetails: userFormData,
                bookingDetails: bookingFormData,
                timestamp: new Date().toISOString()
            };
            setConfirmationData(confirmation);
            toast.success('Booking confirmed! 🎊');
            router.push(`${basePath}?step=confirmation&sessionId=${sessionId}`);
        } catch (error) {
            console.error("Booking Confirmation Error:", error);
            toast.error(error.message || 'Failed to confirm booking.');
        } finally {
            setIsBookingSubmitting(false);
        }
    };

    const goBack = () => {
        if (currentStep === 'hotels') {
            router.push(`${basePath}?step=home&sessionId=${sessionId}`);
        } else if (currentStep === 'booking') {
            router.push(`${basePath}?step=hotels&sessionId=${sessionId}`);
        }
    };

    // ============================================================================
    // LOADING STATE
    // ============================================================================

    if (isHydrating) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-[#0F0F1A] dark:via-[#1A0F2E] dark:to-[#0F0F1A] flex items-center justify-center pt-20">
                <div className="text-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full mx-auto mb-4"
                    />
                    <p className="text-gray-600 dark:text-gray-400">Loading your celebration...</p>
                </div>
            </div>
        );
    }

    // ============================================================================
    // RENDER
    // ============================================================================

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-[#0F0F1A] dark:via-[#1A0F2E] dark:to-[#0F0F1A] pt-20 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* HEADER */}
                {currentStep !== 'confirmation' && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12 pt-8"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-full mb-6 shadow-lg"
                        >
                            <PartyPopper size={20} />
                            <span className="font-bold">Birthday Celebration Planner</span>
                        </motion.div>
                        
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 mb-4">
                            Plan Your Perfect Birthday
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Create unforgettable memories with our curated venues and personalized service
                        </p>
                    </motion.div>
                )}

                {/* PROGRESS SECTION */}
                {currentStep !== 'confirmation' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-4xl mx-auto mb-12"
                    >
                        <div className="bg-white dark:bg-white/5 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-white/10">
                            <div className="flex items-center justify-between mb-4">
                                <StepBadge 
                                    step="details" 
                                    isActive={currentStep === 'home'} 
                                    isCompleted={currentStep !== 'home'}
                                />
                                <div className="flex-1 mx-4">
                                    <div className="w-full bg-gray-200 dark:bg-white/10 rounded-full h-1">
                                        <motion.div
                                            initial={{ width: '0%' }}
                                            animate={{ width: currentStep !== 'home' ? '100%' : '0%' }}
                                            className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
                                        />
                                    </div>
                                </div>
                                <StepBadge 
                                    step="venue" 
                                    isActive={currentStep === 'hotels'} 
                                    isCompleted={currentStep === 'booking'}
                                />
                                <div className="flex-1 mx-4">
                                    <div className="w-full bg-gray-200 dark:bg-white/10 rounded-full h-1">
                                        <motion.div
                                            initial={{ width: '0%' }}
                                            animate={{ width: currentStep === 'booking' ? '100%' : '0%' }}
                                            className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
                                        />
                                    </div>
                                </div>
                                <StepBadge 
                                    step="booking" 
                                    isActive={currentStep === 'booking'} 
                                    isCompleted={false}
                                />
                            </div>
                            <ProgressBar currentStep={getCurrentStepKey()} />
                        </div>
                    </motion.div>
                )}

                {/* MAIN CONTENT */}
                <div className="max-w-5xl mx-auto">
                    <AnimatePresence mode="wait">
                        {/* STEP 1: USER DETAILS */}
                        {currentStep === 'home' && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4 }}
                                className="bg-white dark:bg-white/5 rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-200 dark:border-white/10"
                            >
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg">
                                        <User className="text-white" size={28} />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-black text-gray-900 dark:text-white">Your Details</h2>
                                        <p className="text-gray-600 dark:text-gray-400">Let's start with some basic information</p>
                                    </div>
                                </div>

                                <form onSubmit={handleUserSubmit} className="space-y-6">
                                    <InputField
                                        label="Full Name"
                                        icon={User}
                                        placeholder="Enter your full name"
                                        value={userFormData.name}
                                        onChange={e => setUserFormData({ ...userFormData, name: e.target.value })}
                                        error={userErrors.name}
                                    />

                                    <InputField
                                        label="Phone Number"
                                        icon={Phone}
                                        placeholder="10-digit mobile number"
                                        type="tel"
                                        maxLength="10"
                                        value={userFormData.phone}
                                        onChange={e => setUserFormData({ ...userFormData, phone: e.target.value })}
                                        error={userErrors.phone}
                                    />

                                    <InputField
                                        label="Birthday Date"
                                        icon={Cake}
                                        type="date"
                                        value={userFormData.birthdayDate}
                                        onChange={e => setUserFormData({ ...userFormData, birthdayDate: e.target.value })}
                                        error={userErrors.birthdayDate}
                                    />

                                    <div className="pt-6">
                                        <button
                                            type="submit"
                                            disabled={isUserSubmitting}
                                            className="w-full py-4 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 hover:from-pink-500 hover:via-purple-500 hover:to-blue-500 rounded-xl font-bold text-lg text-white shadow-2xl shadow-pink-500/30 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                        >
                                            {isUserSubmitting ? (
                                                <>
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                                    />
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    Continue to Venues
                                                    <ArrowRight size={20} />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {/* STEP 2: VENUE SELECTION */}
                        {currentStep === 'hotels' && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4 }}
                                className="space-y-6"
                            >
                                {/* Header with Back Button */}
                                <div className="bg-white dark:bg-white/5 rounded-3xl p-6 md:p-8 shadow-xl border border-gray-200 dark:border-white/10">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                                                <MapPin className="text-white" size={28} />
                                            </div>
                                            <div>
                                                <h2 className="text-3xl font-black text-gray-900 dark:text-white">Select Your Venue</h2>
                                                <p className="text-gray-600 dark:text-gray-400">Find the perfect spot for your celebration</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={goBack}
                                            className="p-3 rounded-xl bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors group"
                                        >
                                            <ArrowLeft size={24} className="text-gray-700 dark:text-white group-hover:-translate-x-1 transition-transform" />
                                        </button>
                                    </div>

                                    {/* Search */}
                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="text"
                                            placeholder="Search venues by name or location..."
                                            value={searchQuery}
                                            onChange={e => setSearchQuery(e.target.value)}
                                            className="w-full bg-gray-50 dark:bg-white/5 border-2 border-gray-200 dark:border-white/10 rounded-xl py-4 pl-12 pr-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 transition-all"
                                        />
                                        {searchQuery && (
                                            <button
                                                onClick={() => setSearchQuery('')}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                            >
                                                <X size={20} />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Venues Grid */}
                                {isHotelsLoading ? (
                                    <div className="bg-white dark:bg-white/5 rounded-3xl p-12 shadow-xl border border-gray-200 dark:border-white/10 text-center">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full mx-auto mb-4"
                                        />
                                        <p className="text-gray-600 dark:text-gray-400 text-lg">Loading amazing venues...</p>
                                    </div>
                                ) : (
                                    <div className="space-y-8">
                                        {/* Free Venues */}
                                        {freeHotels?.length > 0 && (
                                            <div className="bg-white dark:bg-white/5 rounded-3xl p-6 md:p-8 shadow-xl border border-gray-200 dark:border-white/10">
                                                <div className="flex items-center gap-3 mb-6">
                                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center shadow-lg">
                                                        <Gift className="text-white" size={24} />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Free Booking Venues</h3>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">No booking charges</p>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                    {freeHotels.map(hotel => (
                                                        <HotelCard 
                                                            key={hotel._id} 
                                                            hotel={hotel} 
                                                            type="free" 
                                                            onSelect={handleSelectHotel}
                                                            isSelected={selectedHotel?._id === hotel._id}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Premium Venues */}
                                        {paidHotels?.length > 0 && (
                                            <div className="bg-white dark:bg-white/5 rounded-3xl p-6 md:p-8 shadow-xl border border-gray-200 dark:border-white/10">
                                                <div className="flex items-center gap-3 mb-6">
                                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-lg">
                                                        <Star className="text-white" size={24} />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Premium Experiences</h3>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">Luxury venues for unforgettable moments</p>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                    {paidHotels.map(hotel => (
                                                        <HotelCard 
                                                            key={hotel._id} 
                                                            hotel={hotel} 
                                                            type="premium" 
                                                            onSelect={handleSelectHotel}
                                                            isSelected={selectedHotel?._id === hotel._id}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {!freeHotels?.length && !paidHotels?.length && (
                                            <div className="bg-white dark:bg-white/5 rounded-3xl p-12 shadow-xl border border-gray-200 dark:border-white/10 text-center">
                                                <p className="text-gray-600 dark:text-gray-400 text-lg">No venues found matching your search.</p>
                                                <button
                                                    onClick={() => setSearchQuery('')}
                                                    className="mt-4 text-pink-600 dark:text-pink-400 font-semibold hover:underline"
                                                >
                                                    Clear search
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* STEP 3: BOOKING DETAILS */}
                        {currentStep === 'booking' && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4 }}
                                className="bg-white dark:bg-white/5 rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-200 dark:border-white/10"
                            >
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                                            <Calendar className="text-white" size={28} />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-black text-gray-900 dark:text-white">Finalize Booking</h2>
                                            <p className="text-gray-600 dark:text-gray-400">Add event details to complete</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={goBack}
                                        className="p-3 rounded-xl bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors group"
                                    >
                                        <ArrowLeft size={24} className="text-gray-700 dark:text-white group-hover:-translate-x-1 transition-transform" />
                                    </button>
                                </div>

                                {/* Selected Venue Preview */}
                                {selectedHotel && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-white/5 dark:to-white/10 rounded-2xl p-6 mb-8 border-2 border-pink-200 dark:border-pink-500/30"
                                    >
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={selectedHotel.images[0] || '/placeholder.jpg'}
                                                alt={selectedHotel.name}
                                                className="w-20 h-20 rounded-xl object-cover border-2 border-white dark:border-white/20 shadow-md"
                                            />
                                            <div className="flex-1">
                                                <h4 className="font-bold text-xl text-gray-900 dark:text-white mb-1">{selectedHotel.name}</h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                                                    <MapPin size={14} className="text-pink-500" /> 
                                                    {selectedHotel.location}
                                                </p>
                                            </div>
                                            <CheckCircle className="text-green-500" size={32} />
                                        </div>
                                    </motion.div>
                                )}

                                <form onSubmit={handleBookingSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <InputField
                                            label="Event Date"
                                            icon={Calendar}
                                            type="date"
                                            value={bookingFormData.eventDate}
                                            onChange={e => setBookingFormData({ ...bookingFormData, eventDate: e.target.value })}
                                            error={bookingErrors.eventDate}
                                        />
                                        <InputField
                                            label="Number of Guests"
                                            icon={Users}
                                            type="number"
                                            placeholder="Expected guests"
                                            min="1"
                                            value={bookingFormData.guestCount}
                                            onChange={e => setBookingFormData({ ...bookingFormData, guestCount: e.target.value })}
                                            error={bookingErrors.guestCount}
                                        />
                                    </div>

                                    <InputField
                                        label="Preferred Time Slot"
                                        icon={Clock}
                                        type="time"
                                        value={bookingFormData.timeSlot}
                                        onChange={e => setBookingFormData({ ...bookingFormData, timeSlot: e.target.value })}
                                        error={bookingErrors.timeSlot}
                                    />

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                            <Save size={16} className="text-pink-500" />
                                            Special Requests & Requirements
                                        </label>
                                        <textarea
                                            className={`w-full bg-white dark:bg-white/5 border-2 ${
                                                bookingErrors.specialRequests ? 'border-rose-500' : 'border-gray-200 dark:border-white/10'
                                            } rounded-xl py-3.5 px-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 min-h-[140px] transition-all resize-none`}
                                            placeholder="Dietary restrictions, special decorations, cake preferences, music requests, accessibility needs, etc."
                                            value={bookingFormData.specialRequests}
                                            onChange={e => setBookingFormData({ ...bookingFormData, specialRequests: e.target.value })}
                                        />
                                        {bookingErrors.specialRequests && (
                                            <motion.p 
                                                initial={{ opacity: 0, y: -5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="text-rose-500 text-xs font-medium flex items-center gap-1"
                                            >
                                                <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                                                {bookingErrors.specialRequests}
                                            </motion.p>
                                        )}
                                    </div>

                                    <div className="pt-6">
                                        <button
                                            type="submit"
                                            disabled={isBookingSubmitting}
                                            className="w-full py-4 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-500 hover:via-emerald-500 hover:to-teal-500 rounded-xl font-bold text-lg text-white shadow-2xl shadow-green-500/30 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                        >
                                            {isBookingSubmitting ? (
                                                <>
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                                    />
                                                    Confirming...
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle size={22} />
                                                    Confirm Booking
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {/* STEP 4: CONFIRMATION */}
                        {currentStep === 'confirmation' && confirmationData && (
                            <motion.div
                                key="confirmation"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.5 }}
                                className="text-center py-12"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                    className="relative inline-block mb-8"
                                >
                                    <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/50">
                                        <CheckCircle size={64} className="text-white" strokeWidth={3} />
                                    </div>
                                    <motion.div
                                        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="absolute inset-0 w-32 h-32 bg-green-400 rounded-full"
                                    />
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="mb-12"
                                >
                                    <h2 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 mb-4">
                                        🎉 IT'S OFFICIAL!
                                    </h2>
                                    <p className="text-2xl text-gray-700 dark:text-gray-300 font-medium">
                                        Your birthday celebration is booked!
                                    </p>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="bg-white dark:bg-white/5 rounded-3xl p-8 md:p-10 max-w-2xl mx-auto shadow-2xl border border-gray-200 dark:border-white/10"
                                >
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between pb-6 border-b-2 border-gray-200 dark:border-white/20">
                                            <span className="text-gray-600 dark:text-gray-400 font-semibold">Booking ID</span>
                                            <span className="text-2xl font-black text-pink-600 dark:text-pink-400">
                                                #{confirmationData.bookingId}
                                            </span>
                                        </div>
                                        
                                        <div className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-white/5 dark:to-white/10 rounded-2xl p-6 text-left space-y-4">
                                            <div className="flex items-start gap-3">
                                                <MapPin className="text-pink-500 mt-1 flex-shrink-0" size={20} />
                                                <div>
                                                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Venue</div>
                                                    <div className="font-bold text-gray-900 dark:text-white">{confirmationData.hotel?.name}</div>
                                                    <div className="text-sm text-gray-600 dark:text-gray-400">{confirmationData.hotel?.location}</div>
                                                </div>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="flex items-start gap-3">
                                                    <Calendar className="text-pink-500 mt-1" size={20} />
                                                    <div>
                                                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Date</div>
                                                        <div className="font-bold text-gray-900 dark:text-white">
                                                            {new Date(confirmationData.bookingDetails?.eventDate).toLocaleDateString('en-US', { 
                                                                weekday: 'long', 
                                                                year: 'numeric', 
                                                                month: 'long', 
                                                                day: 'numeric' 
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-start gap-3">
                                                    <Clock className="text-pink-500 mt-1" size={20} />
                                                    <div>
                                                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Time</div>
                                                        <div className="font-bold text-gray-900 dark:text-white">
                                                            {confirmationData.bookingDetails?.timeSlot}
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-start gap-3">
                                                    <Users className="text-pink-500 mt-1" size={20} />
                                                    <div>
                                                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Guests</div>
                                                        <div className="font-bold text-gray-900 dark:text-white">
                                                            {confirmationData.bookingDetails?.guestCount} people
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-blue-50 dark:bg-blue-500/10 rounded-xl p-4 text-sm text-gray-700 dark:text-gray-300">
                                            📱 Confirmation details have been sent to your phone number
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.7 }}
                                    className="mt-8 space-y-4"
                                >
                                    <button
                                        onClick={() => window.print()}
                                        className="px-8 py-4 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 dark:from-white/10 dark:to-white/20 dark:hover:from-white/15 dark:hover:to-white/25 rounded-xl font-semibold text-white transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                                    >
                                        📄 Download Receipt
                                    </button>
                                    
                                    <div className="text-gray-600 dark:text-gray-400 text-sm">
                                        Need help? Contact our support team
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}