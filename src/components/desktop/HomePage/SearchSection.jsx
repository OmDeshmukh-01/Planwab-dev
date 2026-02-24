"use client";

import React, { useState, useRef, useEffect, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Search,
  MapPin,
  ChevronRight,
  Building2,
  ChevronLeft,
  Camera,
  Paintbrush2,
  UserCheck,
  UtensilsCrossed,
  Shirt,
  Hand,
  CakeSlice,
  Gem,
  Mail,
  Music,
  Scissors,
  Lamp,
  Drum,
  MicVocal,
  Sparkles,
  FlameKindling,
  FileText,
  Loader2,
} from "lucide-react";
import { useCategoryStore } from "../../../GlobalState/CategoryStore";

// ══════════════════════════════════════════════════════════════════════════════
// VENDOR CATEGORIES DATA
// ══════════════════════════════════════════════════════════════════════════════
const vendorCategories = [
  // Essential Services
  {
    group: "Essential Services",
    items: [
      { key: "venues", label: "Venues", icon: Building2, description: "Banquet halls, hotels, resorts" },
      { key: "photographers", label: "Photographers", icon: Camera, description: "Wedding & event photography" },
      { key: "planners", label: "Planners", icon: UserCheck, description: "Wedding & event planning" },
      { key: "catering", label: "Catering", icon: UtensilsCrossed, description: "Food & beverage services" },
    ],
  },
  // Beauty & Styling
  {
    group: "Beauty & Styling",
    items: [
      { key: "makeup", label: "Makeup", icon: Paintbrush2, description: "Bridal & party makeup" },
      { key: "hairstyling", label: "Hairstyling", icon: Scissors, description: "Hair styling services" },
      { key: "mehendi", label: "Mehendi", icon: Hand, description: "Mehendi artists" },
    ],
  },
  // Fashion & Accessories
  {
    group: "Fashion & Accessories",
    items: [
      { key: "clothes", label: "Clothes", icon: Shirt, description: "Bridal & groom wear" },
      { key: "jewellery", label: "Jewellery", icon: Gem, description: "Bridal & fashion jewellery" },
    ],
  },
  // Entertainment & Decor
  {
    group: "Entertainment & Decor",
    items: [
      { key: "djs", label: "DJs", icon: Music, description: "Music & entertainment" },
      { key: "decor", label: "Decorators", icon: Lamp, description: "Event decoration services" },
      { key: "anchor", label: "Anchor", icon: MicVocal, description: "Event anchors and hosts" },
    ],
  },
  // Special Effects & Processions
  {
    group: "Special Effects & Processions",
    items: [
      { key: "dhol", label: "Dhol", icon: Drum, description: "Traditional drum players" },
      { key: "stageEntry", label: "Stage Entry", icon: Sparkles, description: "Grand stage entry & concepts" },
      { key: "fireworks", label: "Fireworks", icon: FlameKindling, description: "Fireworks & pyro displays" },
      { key: "barat", label: "Barat", icon: Music, description: "Bands, horses & Barat processions" },
    ],
  },
  // Others
  {
    group: "Others",
    items: [
      { key: "cakes", label: "Cakes", icon: CakeSlice, description: "Wedding & celebration cakes" },
      { key: "invitations", label: "Invitations", icon: Mail, description: "Wedding cards & invites" },
      { key: "other", label: "Other", icon: FileText, description: "Other services" },
    ],
  },
];

// Flatten categories for search
const allCategories = vendorCategories.flatMap((group) => group.items);

// ══════════════════════════════════════════════════════════════════════════════
// CITIES DATA WITH EXTENSIVE AREAS
// ══════════════════════════════════════════════════════════════════════════════
const cities = [
  {
    name: "Delhi",
    state: "Delhi",
    areas: [
      // Central Delhi
      "Connaught Place", "Karol Bagh", "Paharganj", "Chandni Chowk", "Daryaganj",
      "Rajendra Place", "Patel Nagar", "Rajouri Garden", "Kirti Nagar", "Moti Nagar",
      // South Delhi
      "Hauz Khas", "Greater Kailash", "Saket", "Malviya Nagar", "Vasant Kunj",
      "Vasant Vihar", "Defence Colony", "Lajpat Nagar", "Nehru Place", "Kalkaji",
      "Green Park", "Safdarjung", "Chanakyapuri", "RK Puram", "Munirka",
      "Mehrauli", "Chattarpur", "Sainik Farm", "Sarita Vihar", "Jasola",
      "Okhla", "Govindpuri", "Sangam Vihar", "Tughlakabad", "Badarpur",
      // North Delhi
      "Civil Lines", "Model Town", "GTB Nagar", "Kamla Nagar", "Hudson Lane",
      "Mukherjee Nagar", "Pitampura", "Rohini", "Shalimar Bagh", "Wazirpur",
      "Azadpur", "Adarsh Nagar", "Jahangirpuri", "Burari", "Narela",
      // West Delhi
      "Dwarka", "Janakpuri", "Vikaspuri", "Uttam Nagar", "Tilak Nagar",
      "Punjabi Bagh", "Paschim Vihar", "Peeragarhi", "Mundka", "Najafgarh",
      "Kakrola", "Dabri", "Hari Nagar", "Subhash Nagar", "Tagore Garden",
      // East Delhi
      "Preet Vihar", "Laxmi Nagar", "Mayur Vihar", "Patparganj", "IP Extension",
      "Shakarpur", "Vivek Vihar", "Anand Vihar", "Karkardooma", "Dilshad Garden",
      "Seelampur", "Jafrabad", "Shahdara", "Krishna Nagar", "Geeta Colony",
      // Noida (NCR)
      "Noida Sector 18", "Noida Sector 62", "Noida Sector 63", "Noida Sector 125",
      "Noida Sector 137", "Noida Expressway", "Greater Noida", "Noida Extension",
      // Gurgaon (NCR)
      "Gurgaon", "MG Road Gurgaon", "Cyber City", "DLF Phase 1-5", "Sohna Road",
      "Golf Course Road", "Sector 29", "Sector 44", "Sector 56", "Udyog Vihar",
      // Ghaziabad (NCR)
      "Ghaziabad", "Indirapuram", "Vaishali", "Kaushambi", "Raj Nagar Extension",
      "Crossings Republik", "Vasundhara", "Sahibabad",
      // Faridabad (NCR)
      "Faridabad", "Sector 15 Faridabad", "Ballabgarh", "Surajkund", "NIT Faridabad",
    ],
  },
  {
    name: "Mumbai",
    state: "Maharashtra",
    areas: [
      // South Mumbai
      "Colaba", "Fort", "Marine Lines", "Churchgate", "Nariman Point",
      "Cuffe Parade", "Malabar Hill", "Breach Candy", "Worli", "Lower Parel",
      "Prabhadevi", "Dadar", "Matunga", "Mahim", "Byculla",
      // Western Suburbs
      "Bandra", "Khar", "Santacruz", "Vile Parle", "Andheri", "Juhu",
      "Versova", "Lokhandwala", "Goregaon", "Malad", "Kandivali",
      "Borivali", "Dahisar", "Mira Road", "Bhayander",
      // Central Suburbs
      "Kurla", "Ghatkopar", "Vikhroli", "Kanjurmarg", "Bhandup",
      "Mulund", "Thane", "Powai", "Hiranandani", "Chandivali",
      // Navi Mumbai
      "Vashi", "Nerul", "Belapur", "Kharghar", "Panvel", "Airoli", "Sanpada",
    ],
  },
  {
    name: "Bangalore",
    state: "Karnataka",
    areas: [
      "Koramangala", "Indiranagar", "Whitefield", "Jayanagar", "MG Road",
      "Hebbal", "HSR Layout", "BTM Layout", "JP Nagar", "Bannerghatta Road",
      "Electronic City", "Marathahalli", "Bellandur", "Sarjapur", "Yelahanka",
      "Malleshwaram", "Rajajinagar", "Basavanagudi", "Sadashivanagar", "RT Nagar",
      "Banashankari", "Vijayanagar", "Kengeri", "Uttarahalli", "Nagarbhavi",
      "Ulsoor", "Richmond Town", "Shivajinagar", "Commercial Street", "Frazer Town",
      "Hennur", "Kalyan Nagar", "Kammanahalli", "Horamavu", "Ramamurthy Nagar",
      "KR Puram", "Old Airport Road", "CV Raman Nagar", "Banaswadi", "HRBR Layout",
    ],
  },
  {
    name: "Chennai",
    state: "Tamil Nadu",
    areas: [
      "T. Nagar", "Adyar", "Besant Nagar", "ECR", "Velachery",
      "Anna Nagar", "Nungambakkam", "Mylapore", "Alwarpet", "RA Puram",
      "Thiruvanmiyur", "Sholinganallur", "OMR", "Perungudi", "Taramani",
      "Vadapalani", "Ashok Nagar", "KK Nagar", "Kodambakkam", "Saligramam",
      "Porur", "Valasaravakkam", "Mogappair", "Ambattur", "Avadi",
      "Guindy", "Mount Road", "Egmore", "George Town", "Kilpauk",
      "Chetpet", "Royapettah", "Triplicane", "Mandaveli", "Kotturpuram",
    ],
  },
  {
    name: "Hyderabad",
    state: "Telangana",
    areas: [
      "Banjara Hills", "Jubilee Hills", "Hitech City", "Gachibowli", "Shamshabad",
      "Madhapur", "Kondapur", "Kukatpally", "KPHB", "Miyapur",
      "Secunderabad", "Begumpet", "Ameerpet", "SR Nagar", "Panjagutta",
      "Manikonda", "Narsingi", "Kokapet", "Financial District", "Nanakramguda",
      "Attapur", "Mehdipatnam", "Tolichowki", "Masab Tank", "Nampally",
      "Dilsukhnagar", "LB Nagar", "Uppal", "Habsiguda", "Tarnaka",
      "Kompally", "Alwal", "Malkajgiri", "AS Rao Nagar", "ECIL",
    ],
  },
  {
    name: "Pune",
    state: "Maharashtra",
    areas: [
      "Koregaon Park", "Hinjawadi", "Kharadi", "Viman Nagar", "Baner",
      "Aundh", "Wakad", "Pimple Saudagar", "Balewadi", "Pashan",
      "Shivajinagar", "Deccan", "FC Road", "JM Road", "Camp",
      "Kothrud", "Karve Nagar", "Warje", "Bavdhan", "Sus Road",
      "Hadapsar", "Magarpatta", "Mundhwa", "Wadgaon Sheri", "Kalyani Nagar",
      "Yerawada", "Vishrantwadi", "Dhanori", "Lohegaon", "Wagholi",
      "PCMC", "Chinchwad", "Pimpri", "Nigdi", "Akurdi",
    ],
  },
  {
    name: "Kolkata",
    state: "West Bengal",
    areas: [
      "Park Street", "Salt Lake", "New Town", "Alipore", "Ballygunge",
      "Gariahat", "Lake Gardens", "Southern Avenue", "Jodhpur Park", "Tollygunge",
      "Behala", "Jadavpur", "Garia", "Narendrapur", "Sonarpur",
      "Howrah", "Shibpur", "Belur", "Liluah", "Uttarpara",
      "Dumdum", "Baranagar", "Belgharia", "Barrackpore", "Madhyamgram",
      "Esplanade", "BBD Bagh", "College Street", "Sealdah", "Entally",
      "EM Bypass", "Rajarhat", "Newtown Action Area", "Sector V", "Kestopur",
    ],
  },
  {
    name: "Ahmedabad",
    state: "Gujarat",
    areas: [
      "SG Highway", "Prahlad Nagar", "Bodakdev", "Vastrapur", "Satellite",
      "Navrangpura", "CG Road", "Law Garden", "Paldi", "Ellis Bridge",
      "Thaltej", "Gurukul", "Drive In", "Memnagar", "Naranpura",
      "Maninagar", "Isanpur", "Vastral", "Nikol", "Naroda",
      "Bopal", "South Bopal", "Shela", "Gota", "New CG Road",
      "Ashram Road", "Shahibaug", "Usmanpura", "Sabarmati", "Chandkheda",
    ],
  },
  {
    name: "Jaipur",
    state: "Rajasthan",
    areas: [
      "Civil Lines", "Vaishali Nagar", "Malviya Nagar", "C-Scheme", "Tonk Road",
      "MI Road", "Bani Park", "Raja Park", "Mansarovar", "Pratap Nagar",
      "Jagatpura", "Sitapura", "Sanganer", "Muhana", "Durgapura",
      "Vidhyadhar Nagar", "Jhotwara", "Sodala", "Ajmer Road", "Sikar Road",
      "Amer Road", "Delhi Road", "Agra Road", "Gopalpura", "Jawahar Circle",
    ],
  },
  {
    name: "Udaipur",
    state: "Rajasthan",
    areas: [
      "City Palace Road", "Fateh Sagar", "Lake Pichola", "Ambamata", "Hiran Magri",
      "Chetak Circle", "Sukhadia Circle", "University Road", "Saheli Marg", "Panchwati",
      "Bhuwana", "Bedla", "Goverdhan Vilas", "Pratap Nagar", "Shobhagpura",
      "Sector 4", "Sector 11", "Sector 14", "Ashok Nagar", "New Bhupalpura",
    ],
  },
  {
    name: "Goa",
    state: "Goa",
    areas: [
      "Calangute", "Candolim", "Panjim", "Vagator", "Dona Paula", "Colva",
      "Baga", "Anjuna", "Morjim", "Ashwem", "Arambol", "Mandrem",
      "Mapusa", "Porvorim", "Old Goa", "Margao", "Vasco",
      "Benaulim", "Cavelossim", "Mobor", "Palolem", "Agonda",
      "Bambolim", "Caranzalem", "Miramar", "Taleigao", "Santa Cruz",
    ],
  },
  {
    name: "Lucknow",
    state: "Uttar Pradesh",
    areas: [
      "Hazratganj", "Gomti Nagar", "Aliganj", "Indira Nagar", "Mahanagar",
      "Alambagh", "Charbagh", "Aminabad", "Chowk", "Kaiserbagh",
      "Vikas Nagar", "Jankipuram", "Faizabad Road", "Kanpur Road", "Sitapur Road",
      "Rajajipuram", "Aashiana", "Sushant Golf City", "Vrindavan Colony", "Eldeco",
    ],
  },
  {
    name: "Chandigarh",
    state: "Chandigarh",
    areas: [
      "Sector 17", "Sector 22", "Sector 35", "Sector 43", "Sector 44",
      "Sector 8", "Sector 9", "Sector 10", "Sector 11", "Sector 15",
      "Sector 26", "Sector 34", "Sector 36", "Sector 37", "Sector 38",
      "Industrial Area Phase 1", "Industrial Area Phase 2", "Manimajra", "IT Park", "Zirakpur",
      "Mohali", "Panchkula", "Kharar", "Mullanpur", "Aerocity",
    ],
  },
  {
    name: "Indore",
    state: "Madhya Pradesh",
    areas: [
      "Vijay Nagar", "Palasia", "MG Road", "Sapna Sangeeta", "Rajwada",
      "Bhawarkuan", "Scheme 54", "Scheme 78", "AB Road", "Ring Road",
      "Nipania", "Khajrana", "Rau", "Bicholi Mardana", "Super Corridor",
    ],
  },
  {
    name: "Nagpur",
    state: "Maharashtra",
    areas: [
      "Sitabuldi", "Dharampeth", "Sadar", "Civil Lines", "Ramdaspeth",
      "Laxmi Nagar", "Manish Nagar", "Trimurti Nagar", "Pratap Nagar", "Wardha Road",
      "Hingna", "Butibori", "Koradi", "Kamptee", "MIHAN",
    ],
  },
  {
    name: "Surat",
    state: "Gujarat",
    areas: [
      "Vesu", "Adajan", "Piplod", "Ghod Dod Road", "Citylight",
      "Athwa", "Nanpura", "Majura Gate", "Ring Road", "Dumas",
      "Pal", "Bhatar", "Varachha", "Udhna", "Katargam",
    ],
  },
  {
    name: "Kochi",
    state: "Kerala",
    areas: [
      "Fort Kochi", "Ernakulam", "Marine Drive", "MG Road Kochi", "Panampilly Nagar",
      "Kakkanad", "Edappally", "Kaloor", "Vytilla", "Thripunithura",
      "Aluva", "Kalamassery", "Infopark", "SmartCity", "Bolgatty",
    ],
  },
  {
    name: "Visakhapatnam",
    state: "Andhra Pradesh",
    areas: [
      "Beach Road", "Dwaraka Nagar", "MVP Colony", "Seethammadhara", "Madhurawada",
      "Gajuwaka", "Rushikonda", "Yendada", "Kommadi", "Pendurthi",
    ],
  },
  {
    name: "Bhopal",
    state: "Madhya Pradesh",
    areas: [
      "MP Nagar", "Arera Colony", "Kolar Road", "Habibganj", "New Market",
      "Hoshangabad Road", "Bairagarh", "Misrod", "Ayodhya Nagar", "Shahpura",
    ],
  },
  {
    name: "Coimbatore",
    state: "Tamil Nadu",
    areas: [
      "RS Puram", "Gandhipuram", "Peelamedu", "Saibaba Colony", "Race Course",
      "Singanallur", "Saravanampatti", "Ganapathy", "Vadavalli", "Sulur",
    ],
  },
  {
    name: "Thiruvananthapuram",
    state: "Kerala",
    areas: [
      "Kovalam", "Technopark", "Kazhakootam", "Pattom", "Vazhuthacaud",
      "Kowdiar", "Vellayambalam", "Palayam", "East Fort", "Shangumugham",
    ],
  },
  {
    name: "Mysore",
    state: "Karnataka",
    areas: [
      "Gokulam", "Vijayanagar", "Saraswathipuram", "Kuvempunagar", "JP Nagar Mysore",
      "Hebbal Mysore", "Nazarbad", "Yadavagiri", "Chamundi Hill", "Bogadi",
    ],
  },
  {
    name: "Patna",
    state: "Bihar",
    areas: [
      "Boring Road", "Frazer Road", "Kankarbagh", "Patliputra", "Rajendra Nagar",
      "Bailey Road", "Ashok Rajpath", "Danapur", "Khagaul", "Phulwari Sharif",
    ],
  },
  {
    name: "Ranchi",
    state: "Jharkhand",
    areas: [
      "Main Road", "Lalpur", "Doranda", "Harmu", "Morabadi",
      "Kanke", "Ratu Road", "Ashok Nagar", "Bariatu", "Namkum",
    ],
  },
  {
    name: "Dehradun",
    state: "Uttarakhand",
    areas: [
      "Rajpur Road", "Clock Tower", "Paltan Bazaar", "Race Course", "Dalanwala",
      "Clement Town", "Prem Nagar", "Vasant Vihar", "Raipur", "Mussoorie",
    ],
  },
  {
    name: "Amritsar",
    state: "Punjab",
    areas: [
      "Lawrence Road", "Ranjit Avenue", "Model Town", "Green Avenue", "Mall Road",
      "Court Road", "GT Road", "Airport Road", "Majitha Road", "Batala Road",
    ],
  },
  {
    name: "Jodhpur",
    state: "Rajasthan",
    areas: [
      "Ratanada", "Sardarpura", "Paota", "Chopasni", "Shastri Nagar",
      "Pal Road", "Mandore", "Basni", "Residency Road", "PWD Colony",
    ],
  },
  {
    name: "Agra",
    state: "Uttar Pradesh",
    areas: [
      "Taj Nagari", "Sikandra", "Sanjay Place", "MG Road Agra", "Civil Lines Agra",
      "Fatehabad Road", "Dayal Bagh", "Kamla Nagar", "Shahganj", "Raja ki Mandi",
    ],
  },
  {
    name: "Varanasi",
    state: "Uttar Pradesh",
    areas: [
      "Assi Ghat", "Lanka", "BHU", "Cantonment", "Sigra",
      "Mahmoorganj", "Sarnath", "Pandeypur", "Rathyatra", "Godowlia",
    ],
  },
  {
    name: "Lonavala",
    state: "Maharashtra",
    areas: [
      "Tiger Point", "Bushi Dam", "INS Shivaji", "Tungarli", "Khandala",
      "Pawna Lake", "Lonavala Market", "Old Mumbai Highway", "Karla", "Bhaja",
    ],
  },
  {
    name: "Shimla",
    state: "Himachal Pradesh",
    areas: [
      "Mall Road Shimla", "Ridge", "Lakkar Bazaar", "Sanjauli", "Kufri",
      "Mashobra", "Tutikandi", "New Shimla", "Boileauganj", "Summer Hill",
    ],
  },
  {
    name: "Manali",
    state: "Himachal Pradesh",
    areas: [
      "Mall Road Manali", "Old Manali", "Vashisht", "Solang Valley", "Hadimba",
      "Aleo", "Prini", "Naggar", "Kullu", "Kasol",
    ],
  },
  {
    name: "Rishikesh",
    state: "Uttarakhand",
    areas: [
      "Ram Jhula", "Laxman Jhula", "Tapovan", "Triveni Ghat", "Shivpuri",
      "Parmarth Niketan", "Swarg Ashram", "Muni Ki Reti", "Jonk", "Neelkanth Road",
    ],
  },
  {
    name: "Jim Corbett",
    state: "Uttarakhand",
    areas: [
      "Dhikuli", "Ramnagar", "Bijrani", "Jhirna", "Dhela",
      "Sitabani", "Garjia", "Marchula", "Mohaan", "Kyari",
    ],
  },
];

export default function SearchSection({ activeCategory, theme }) {
  const router = useRouter();
  const { setActiveCategory } = useCategoryStore();
  const [isPending, startTransition] = useTransition();

  const [activeField, setActiveField] = useState(null);
  const [categoryInput, setCategoryInput] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedCategoryKey, setSelectedCategoryKey] = useState("");

  const searchRef = useRef(null);
  const catRef = useRef(null);
  const locRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setActiveField(null);
        setSelectedCity(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const openField = (field) => {
    setActiveField((prev) => (prev === field ? null : field));
    setSelectedCity(null);
    setTimeout(() => {
      if (field === "category") catRef.current?.focus({ preventScroll: true });
      if (field === "location") locRef.current?.focus({ preventScroll: true });
    }, 80);
  };

  const selectCategory = (cat) => {
    setCategoryInput(cat.label);
    setSelectedCategoryKey(cat.key);
    setActiveField(null);
  };

  const selectArea = (area, city) => {
    setLocationInput(`${area}, ${city}`);
    setActiveField(null);
    setSelectedCity(null);
  };

  const selectCityDirect = (name) => {
    setLocationInput(name);
    setActiveField(null);
    setSelectedCity(null);
  };

  // Filter categories based on input
  const filteredCategories = categoryInput.trim()
    ? allCategories.filter(
        (cat) =>
          cat.label.toLowerCase().includes(categoryInput.toLowerCase()) ||
          cat.description.toLowerCase().includes(categoryInput.toLowerCase())
      )
    : null;

  // Filter cities based on input
  const filteredCities = locationInput.trim()
    ? cities.filter(
        (c) =>
          c.name.toLowerCase().includes(locationInput.toLowerCase()) ||
          c.state.toLowerCase().includes(locationInput.toLowerCase()) ||
          c.areas.some((a) => a.toLowerCase().includes(locationInput.toLowerCase()))
      )
    : cities;

  // Handle search navigation
  const handleSearch = () => {
    startTransition(() => {
      const params = new URLSearchParams();

      if (selectedCategoryKey) {
        params.set("categories", selectedCategoryKey);
      } else if (categoryInput.trim()) {
        params.set("search", categoryInput.trim());
      }

      if (locationInput.trim()) {
        // Extract city name from location input
        const cityMatch = cities.find(
          (c) =>
            locationInput.toLowerCase().includes(c.name.toLowerCase()) ||
            c.areas.some((a) => locationInput.toLowerCase().includes(a.toLowerCase()))
        );
        if (cityMatch) {
          params.set("cities", cityMatch.name);
        }
      }

      const queryString = params.toString();
      const url = queryString ? `/vendors/marketplace?${queryString}` : "/vendors/marketplace";

      router.push(url);
    });
  };

  // Handle enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  // Dropdown animation variants (opens above)
  const dropdownVariants = {
    initial: { opacity: 0, y: 6, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 6, scale: 0.98 },
  };

  return (
    <div ref={searchRef} className="relative">
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* SEARCH BAR */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <div className={`flex items-center bg-white dark:bg-gray-800 rounded-xl border-2 border-[${theme?.gradientLight}] dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300`}>
        {/* Search icon */}
        <div className="pl-4 pr-1 shrink-0">
          <Search size={18} className="text-gray-400" />
        </div>

        {/* ── Category Field ── */}
        <div className="flex-1 relative min-w-0">
          <div
            onClick={() => openField("category")}
            className={`px-3 py-3 cursor-pointer rounded-l-xl transition-colors ${
              activeField === "category" ? "bg-gray-50 dark:bg-gray-700/50" : ""
            }`}
          >
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none mb-1">
              Search for
            </p>
            <input
              ref={catRef}
              type="text"
              placeholder="Vendor category or name"
              value={categoryInput}
              onChange={(e) => {
                setCategoryInput(e.target.value);
                setSelectedCategoryKey("");
              }}
              onKeyDown={handleKeyDown}
              className="w-full text-sm font-medium text-gray-800 dark:text-gray-200 bg-transparent focus:outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
          </div>

          {/* ── Category Dropdown (Opens Above) ── */}
          <AnimatePresence>
            {activeField === "category" && (
              <motion.div
                variants={dropdownVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.18 }}
                className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden max-h-80 overflow-y-auto"
              >
                <div className="p-1.5">
                  {filteredCategories ? (
                    // Search results
                    <>
                      <p className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Search Results
                      </p>
                      {filteredCategories.length > 0 ? (
                        filteredCategories.map((cat) => {
                          const IconComponent = cat.icon;
                          return (
                            <button
                              key={cat.key}
                              onClick={() => selectCategory(cat)}
                              className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 transition-colors duration-150 ${
                                selectedCategoryKey === cat.key
                                  ? "bg-gray-100 dark:bg-gray-700"
                                  : "hover:bg-gray-50 dark:hover:bg-gray-700/40"
                              }`}
                            >
                              <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0">
                                <IconComponent size={16} className="text-gray-600 dark:text-gray-300" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
                                  {cat.label}
                                </p>
                                <p className="text-[11px] text-gray-400 truncate">{cat.description}</p>
                              </div>
                            </button>
                          );
                        })
                      ) : (
                        <p className="text-sm text-gray-400 text-center py-4">No categories found</p>
                      )}
                    </>
                  ) : (
                    // Grouped categories
                    vendorCategories.map((group) => (
                      <div key={group.group}>
                        <p className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest sticky top-0 bg-white dark:bg-gray-800">
                          {group.group}
                        </p>
                        {group.items.map((cat) => {
                          const IconComponent = cat.icon;
                          return (
                            <button
                              key={cat.key}
                              onClick={() => selectCategory(cat)}
                              className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 transition-colors duration-150 ${
                                selectedCategoryKey === cat.key
                                  ? "bg-gray-100 dark:bg-gray-700"
                                  : "hover:bg-gray-50 dark:hover:bg-gray-700/40"
                              }`}
                            >
                              <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0">
                                <IconComponent size={16} className="text-gray-600 dark:text-gray-300" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
                                  {cat.label}
                                </p>
                                <p className="text-[11px] text-gray-400 truncate">{cat.description}</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Separator */}
        <span className="text-sm text-gray-400 dark:text-gray-500 font-medium px-1 shrink-0 select-none">
          in
        </span>

        {/* ── Location Field ── */}
        <div className="flex-1 relative min-w-0">
          <div
            onClick={() => openField("location")}
            className={`px-3 py-3 cursor-pointer transition-colors ${
              activeField === "location" ? "bg-gray-50 dark:bg-gray-700/50" : ""
            }`}
          >
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none mb-1">
              Location
            </p>
            <input
              ref={locRef}
              type="text"
              placeholder="City or area"
              value={locationInput}
              onChange={(e) => {
                setLocationInput(e.target.value);
                setSelectedCity(null);
              }}
              onKeyDown={handleKeyDown}
              className="w-full text-sm font-medium text-gray-800 dark:text-gray-200 bg-transparent focus:outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
          </div>

          {/* ── Location Dropdown (Opens Above) ── */}
          <AnimatePresence>
            {activeField === "location" && (
              <motion.div
                variants={dropdownVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.18 }}
                className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden w-80"
              >
                <AnimatePresence mode="wait">
                  {selectedCity ? (
                    // Areas view
                    <motion.div
                      key="areas"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.15 }}
                      className="p-1.5"
                    >
                      <button
                        onClick={() => setSelectedCity(null)}
                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors w-full"
                      >
                        <ChevronLeft size={14} />
                        All cities
                      </button>

                      <button
                        onClick={() => selectCityDirect(selectedCity.name)}
                        className="w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-2.5 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors"
                      >
                        <div className="w-7 h-7 rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0">
                          <MapPin size={13} className="text-gray-500" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                            All {selectedCity.name}
                          </p>
                          <p className="text-[11px] text-gray-400">{selectedCity.state}</p>
                        </div>
                      </button>

                      <p className="px-3 pt-2 pb-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Popular Areas ({selectedCity.areas.length})
                      </p>

                      <div className="max-h-56 overflow-y-auto">
                        {selectedCity.areas.map((area) => (
                          <button
                            key={area}
                            onClick={() => selectArea(area, selectedCity.name)}
                            className="w-full text-left px-3 py-2 rounded-lg flex items-center gap-2.5 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors"
                          >
                            <div className="w-7 h-7 rounded-md bg-gray-50 dark:bg-gray-700/30 flex items-center justify-center shrink-0">
                              <Building2 size={12} className="text-gray-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {area}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    // Cities list view
                    <motion.div
                      key="cities"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.15 }}
                      className="p-1.5"
                    >
                      <p className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        {locationInput.trim() ? "Search Results" : "Popular Cities"} ({filteredCities.length})
                      </p>
                      <div className="max-h-64 overflow-y-auto">
                        {filteredCities.length > 0 ? (
                          filteredCities.map((city) => (
                            <button
                              key={city.name}
                              onClick={() => setSelectedCity(city)}
                              className="w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors group"
                            >
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0">
                                  <MapPin size={13} className="text-gray-500" />
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                    {city.name}
                                  </p>
                                  <p className="text-[11px] text-gray-400">
                                    {city.state} • {city.areas.length} areas
                                  </p>
                                </div>
                              </div>
                              <ChevronRight
                                size={14}
                                className="text-gray-300 group-hover:text-gray-500 transition-colors shrink-0"
                              />
                            </button>
                          ))
                        ) : (
                          <p className="text-sm text-gray-400 text-center py-4">No cities found</p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Find Button ── */}
        <div className="pr-2 shrink-0">
          <button
            onClick={handleSearch}
            disabled={isPending}
            className={`${theme.buttonBg} text-white rounded-lg px-6 py-2.5 text-sm font-bold transition-all duration-300 hover:shadow-lg ${theme.buttonGlow} hover:scale-[1.03] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2`}
          >
            {isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Finding...</span>
              </>
            ) : (
              "Find"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}