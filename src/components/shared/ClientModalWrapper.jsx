"use client";

import { useState, useEffect } from "react";
import LeadCaptureModal from "../desktop/LeadCaptureModal";
import LeadCaptureModalMobile from "../mobile/LeadCaptureModal";
import { useAppValuesStore } from "../../GlobalState/AppValuesStore";
import { useNavbarVisibilityStore } from "../../GlobalState/navbarVisibilityStore";

const ClientModalWrapper = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
   const [isMobile, setIsMobile] = useState(false);
   const { canContinue } = useAppValuesStore();
   const { isNavbarVisible, setIsNavbarVisible } = useNavbarVisibilityStore();

    useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);

    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  const ModalComponent = isMobile
    ? LeadCaptureModalMobile
    : LeadCaptureModal;

  useEffect(() => {
    const timer = setTimeout(() => {
      if(canContinue) return; // Don't show if user has already taken action
      if(!canContinue){
        setIsModalOpen(true);
        setIsNavbarVisible(false);
      }
    }, 15000); 

    return () => clearTimeout(timer);
  }, []);

  return (
    <ModalComponent
      isOpen={isModalOpen}
      onClose={() => {
        setIsModalOpen(false);
        setIsNavbarVisible(true);
      }}
      actionType="auto-popup"
      title="Plan Your Perfect Event"
      subtitle="Get started with India's most affordable event planning marketplace"
    />
  );
};

export default ClientModalWrapper;