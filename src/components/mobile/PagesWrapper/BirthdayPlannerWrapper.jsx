'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import Navigation from '../BirthdayPage/Navigation';
import SurpriseCard from '../BirthdayPage/SurpriseCard';
import Button from '../BirthdayPage/Button';
import FloatingInput from '../BirthdayPage/FloatingInput';
import HotelsPage from '../BirthdayPage/HotelsPage';
import BookingPage from '../BirthdayPage/BookingPage';
import ConfirmationPage from '../BirthdayPage/ConfirmationPage';

// Validation functions remain the same
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

// Debounce hook
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
};

export default function BirthdayPlannerWrapper() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentStep = searchParams.get('step') || 'home';
    const sessionId = searchParams.get('sessionId');

    // Loading State for Hydration
    const [isHydrating, setIsHydrating] = useState(true);

    // Page 1: User Details State
    const [userFormData, setUserFormData] = useState({
        name: '',
        phone: '',
        birthdayDate: ''
    });
    const [userErrors, setUserErrors] = useState({});
    const [isUserSubmitting, setIsUserSubmitting] = useState(false);

    // Page 2: Hotels State
    const [searchQuery, setSearchQuery] = useState('');
    const [freeHotels, setFreeHotels] = useState([]);
    const [paidHotels, setPaidHotels] = useState([]);
    const [isHotelsLoading, setIsHotelsLoading] = useState(true);
    const debouncedSearch = useDebounce(searchQuery, 300);

    // Page 3: Booking State
    const [bookingFormData, setBookingFormData] = useState({
        eventDate: '', guestCount: '', timeSlot: '', specialRequests: ''
    });
    const [bookingErrors, setBookingErrors] = useState({});
    const [isBookingSubmitting, setIsBookingSubmitting] = useState(false);
    const [selectedHotel, setSelectedHotel] = useState(null);

    // Page 4: Confirmation State
    const [confirmationData, setConfirmationData] = useState(null);

    // Hydrate State from Backend (Replaces localStorage)
    useEffect(() => {
        const fetchBookingState = async () => {
            // If no session ID, stop hydration (user is on home or needs to start over)
            if (!sessionId) {
                setIsHydrating(false);
                return;
            }

            try {
                // Fetch the latest booking data from the backend
                const response = await fetch(`/api/vendor/requests/birthday-routes?sessionId=${sessionId}`);
                const data = await response.json();

                if (response.ok && data.success && data.data) {
                    const booking = data.data;

                    // 1. Restore User Details
                    if (booking.userDetails) {
                        setUserFormData({
                            name: booking.userDetails.name || '',
                            phone: booking.userDetails.phone || '',
                            birthdayDate: booking.userDetails.birthdayDate ? new Date(booking.userDetails.birthdayDate).toISOString().split('T')[0] : ''
                        });
                    }

                    // 2. Restore Selected Hotel (Construct object from flat booking fields)
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

                    // 3. Restore Booking Details
                    if (booking.bookingDetails) {
                        setBookingFormData({
                            eventDate: booking.bookingDetails.eventDate ? new Date(booking.bookingDetails.eventDate).toISOString().split('T')[0] : '',
                            guestCount: booking.bookingDetails.guestCount || '',
                            timeSlot: booking.bookingDetails.timeSlot || '',
                            specialRequests: booking.bookingDetails.specialRequests || ''
                        });
                    }

                    // 4. Restore Confirmation Data (if completed)
                    if (booking.status === 'completed' || booking.bookingId) {
                        setConfirmationData({
                            bookingId: booking.bookingId || booking._id,
                            hotel: {
                                name: booking.venueName,
                                location: booking.venueLocation,
                                price: booking.venuePrice,
                                price: booking.venuePrice,
                                isPaid: (booking.venuePrice || 0) >= 60000
                            },
                            bookingDetails: booking.bookingDetails || {},
                            bookingId: booking.bookingId
                        });
                    }

                    // Pre-calculate Event Date if user details exist but booking date is empty
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
                // Optionally toast.error("Could not restore session");
            } finally {
                setIsHydrating(false);
            }
        };

        fetchBookingState();
    }, [sessionId]); // Re-run only if sessionId changes

    // Route Protection (Wait for hydration)
    useEffect(() => {
        if (isHydrating) return; // Wait for fetch

        if (currentStep === 'hotels' || currentStep === 'booking') {
            if (!sessionId) {
                toast.error('Session expired or invalid.');
                router.push('/m/events/birthday/birthday-planner');
            } else if (!userFormData.name) {
                // Fetch might have failed or data is missing
                // For now, let's allow it if session ID exists, assuming data might load or be retried
                // But strictly, if we don't have user name, we should probably go back.
                // let's stick to session ID check as primary guard.
            }
        }

        if (currentStep === 'booking' && !selectedHotel && !isHydrating) {
            // Use isHydrating check to avoid premature redirect
            if (sessionId) {
                // If we have session but no hotel, maybe user went directly to step 3?
                // Redirect to step 2
                toast.error('Please select a hotel first');
                router.push(`/m/events/birthday/birthday-planner?step=hotels&sessionId=${sessionId}`);
            }
        }

        if (currentStep === 'confirmation' && !confirmationData && !isHydrating) {
            // similar guard
            toast.error('Please complete booking details first');
            router.push(`/m/events/birthday/birthday-planner?step=booking&sessionId=${sessionId}`);
        }

    }, [currentStep, sessionId, isHydrating, selectedHotel, confirmationData, router, userFormData.name]);


    // Page 1: Handle User Form Submit
    const handleUserSubmit = async (e) => {
        e.preventDefault();
        const errors = validateUserDetails(userFormData);
        if (Object.keys(errors).length > 0) {
            setUserErrors(errors);
            return;
        }
        setIsUserSubmitting(true);
        try {
            // ALWAYS generate a new session ID for every submission
            const newSessionId = (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'session_' + Date.now());

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
                throw new Error(data.error || 'Failed to create booking');
            }

            // Calculate Event Date client-side for immediate UI feedback
            const birthday = new Date(userFormData.birthdayDate);
            const currentYear = new Date().getFullYear();
            const eventDate = new Date(currentYear, birthday.getMonth(), birthday.getDate());
            const eventDateString = eventDate.toISOString().split('T')[0];

            setBookingFormData(prev => ({
                ...prev,
                eventDate: eventDateString
            }));

            toast.success('Details saved successfully! 🎉');
            // Navigate with Session ID in URL
            router.push(`/m/events/birthday/birthday-planner?step=hotels&sessionId=${newSessionId}`);
        } catch (error) {
            console.error('Submission Error:', error);
            toast.error(error.message || 'Failed to save details.');
        } finally {
            setIsUserSubmitting(false);
        }
    };

    // Page 2: Fetch Venues (Unchanged logic, just simplified dependency)
    useEffect(() => {
        const fetchVenues = async () => {
            try {
                setIsHotelsLoading(true);
                let url = '/api/vendor?categories=venues&limit=50&sortBy=rating';
                if (debouncedSearch) {
                    url += `&search=${encodeURIComponent(debouncedSearch)}`;
                }
                const response = await fetch(url);
                const data = await response.json();

                if (data.success && data.data) {
                    const venues = data.data;
                    const free = [];
                    const paid = [];

                    venues.forEach(vendor => {
                        // Normalize price
                        const price = vendor.normalizedPrice ||
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
                            images: vendor.images?.length > 0 ? vendor.images : (vendor.defaultImage ? [vendor.defaultImage] : ['/placeholder.jpg']),
                            price: price > 0 ? price : null
                        };

                        if (price >= 60000) {
                            paid.push(normalizedVendor);
                        } else {
                            free.push(normalizedVendor);
                        }
                    });

                    free.sort((a, b) => (a.price || 0) - (b.price || 0));
                    paid.sort((a, b) => (b.price || 0) - (a.price || 0));

                    setFreeHotels(free.slice(0, 4));
                    setPaidHotels(paid.slice(0, 4));
                }
            } catch (error) {
                console.error("Failed to fetch venues:", error);
                toast.error("Failed to load venues");
            } finally {
                setIsHotelsLoading(false);
            }
        };

        if (currentStep === 'hotels') {
            fetchVenues();
        }
    }, [currentStep, debouncedSearch]);

    // Page 2: Handle Hotel Selection
    const handleSelectHotel = async (hotel) => {
        if (!sessionId) {
            toast.error("Session missing. Please restart.");
            return;
        }

        try {
            setSelectedHotel(hotel); // Optimistic

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

            toast.success('Hotel selected! 🎉');
            router.push(`/m/events/birthday/birthday-planner?step=booking&sessionId=${sessionId}`);
        } catch (error) {
            console.error("Hotel Selection Error:", error);
            // Even if API fails, we try to proceed? 
            // Without localStorage, if we proceed and refresh, data is lost.
            // Better to show error.
            toast.error("Failed to save selection. Please try again.");
        }
    };

    // Page 3: Handle Booking Submit
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
            router.push(`/m/events/birthday/birthday-planner?step=confirmation&sessionId=${sessionId}`);
        } catch (error) {
            console.error("Booking Confirmation Error:", error);
            toast.error(error.message || 'Failed to confirm booking.');
        } finally {
            setIsBookingSubmitting(false);
        }
    };

    // Render Page 1: User Details (Same as before)
    const renderUserDetailsPage = () => (
        <div className="min-h-screen bg-[#0F0F1A] relative">
            <div className="fixed inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-30"
                >
                    <source src="https://res.cloudinary.com/dhkkvo36x/video/upload/v1771429190/birthday-hero_khx3dv.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F1A] via-[#0F0F1A]/80 to-transparent"></div>
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
                <div className="flex-1 flex flex-col justify-center px-6 pt-22 pb-24">
                    <div className="text-center animate-slide">
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">PLAN YOUR</h1>
                        <h2 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F4C430] to-[#E5E4E2] drop-shadow-2xl">BIRTHDAY</h2>
                        <p className="mt-4 text-purple-200/80 text-xl md:text-2xl font-light max-w-lg mx-auto">Create unforgettable memories with our curated experience</p>
                    </div>

                    <SurpriseCard />

                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] animate-slide mt-4">
                        <form onSubmit={handleUserSubmit} className="space-y-5">
                            <FloatingInput
                                label="Full Name"
                                value={userFormData.name}
                                onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                                error={userErrors.name}
                            />
                            <FloatingInput
                                label="Phone Number"
                                type="tel"
                                value={userFormData.phone}
                                onChange={(e) => setUserFormData({ ...userFormData, phone: e.target.value })}
                                error={userErrors.phone}
                            />
                            <FloatingInput
                                label="Birthday Date"
                                type="date"
                                value={userFormData.birthdayDate}
                                onChange={(e) => setUserFormData({ ...userFormData, birthdayDate: e.target.value })}
                                error={userErrors.birthdayDate}
                            />
                            <Button
                                type="submit"
                                isLoading={isUserSubmitting}
                                className="w-full py-4 mt-4 rounded-xl text-lg font-semibold text-white bg-gradient-to-r from-[#6A0DAD] to-[#FF007F] hover:from-[#7B1FA2] hover:to-[#F50057] shadow-lg shadow-purple-900/40 transform active:scale-95 transition-all duration-300"
                            >
                                Continue to Venues
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );

    if (isHydrating && sessionId) {
        // Optional: Show a full loading screen
        // return <div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>;
        // For now, allow regular render, state will fill in.
    }

    return (
        <>
            <Navigation currentStep={currentStep} />
            {currentStep === 'home' && renderUserDetailsPage()}
            {currentStep === 'hotels' && <HotelsPage
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                freeHotels={freeHotels}
                paidHotels={paidHotels}
                isHotelsLoading={isHotelsLoading}
                handleSelectHotel={handleSelectHotel}
            />}
            {currentStep === 'booking' && <BookingPage
                bookingFormData={bookingFormData}
                setBookingFormData={setBookingFormData}
                bookingErrors={bookingErrors}
                isBookingSubmitting={isBookingSubmitting}
                selectedHotel={selectedHotel}
                handleBookingSubmit={handleBookingSubmit}
            />}
            {currentStep === 'confirmation' && <ConfirmationPage confirmationData={confirmationData} />}
        </>
    );
}
