"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Calendar, IdCard, ShoppingCart, Users, Briefcase, Settings, Star, FileClock, ChevronDown, ChevronRight, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";

const navItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Events", href: "/admin/events", icon: Calendar },
  { name: "Vendors", href: "/admin/vendors", icon: Briefcase },
  { name: "Vendor Profile", href: "/admin/vendors/profile", icon: IdCard },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  {
    name: "Requests",
    icon: FileClock,
    children: [
      { name: "Vendor Requests", href: "/admin/vendor-requests?type=vendor" },
      { name: "Birthday Requests", href: "/admin/vendor-requests?type=birthday" },
      { name: "Booking Requests", href: "/admin/vendor-requests?type=booking" },
      { name: "Leads Requests", href: "/admin/vendor-requests?type=leads" },
      { name: "Planning Tools", href: "/admin/vendor-requests?type=planning-tools" },
      { name: "Contact Requests", href: "/admin/vendor-requests?type=contact" },
    ],
  },
  { name: "Users", href: "/admin/users", icon: Users },
];

const sidebarVariants = {
  open: { width: "260px" },
  closed: { width: "88px" },
};

const textVariants = {
  hidden: { opacity: 0, x: -10, transition: { duration: 0.2 } },
  visible: { opacity: 1, x: 0, transition: { duration: 0.2, delay: 0.1 } },
};

const Path = (props) => (
  <motion.path fill="transparent" strokeWidth="3" stroke="currentColor" strokeLinecap="round" {...props} />
);

const AnimatedMenuIcon = () => (
  <svg width="23" height="23" viewBox="0 0 23 23">
    <Path variants={{ closed: { d: "M 2 2.5 L 20 2.5" }, open: { d: "M 3 16.5 L 17 2.5" } }} />
    <Path
      d="M 2 9.423 L 20 9.423"
      variants={{ closed: { opacity: 1 }, open: { opacity: 0 } }}
      transition={{ duration: 0.1 }}
    />
    <Path variants={{ closed: { d: "M 2 16.346 L 20 16.346" }, open: { d: "M 3 2.5 L 17 16.346" } }} />
  </svg>
);

export default function Sidebar({ isOpen }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [hovered, setHovered] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(isOpen);
  const [expandedItems, setExpandedItems] = useState({});

  useEffect(() => {
    setIsSidebarOpen(isOpen);
  }, [isOpen]);

  // Handle active state expansion
  useEffect(() => {
    navItems.forEach((item) => {
      if (item.children) {
        const isActive = item.children.some((child) => {
          const childPath = child.href.split('?')[0];
          const childQuery = child.href.split('?')[1];
          const currentType = searchParams.get('type');

          if (childQuery && childQuery.includes('type=')) {
            const type = childQuery.split('type=')[1];
            return pathname === childPath && currentType === type;
          }
          return pathname === childPath;
        });

        if (isActive) {
          setExpandedItems((prev) => ({ ...prev, [item.name]: true }));
        }
      }
    });
  }, [pathname, searchParams]);

  const handleMouseLeave = () => {
    setHovered(false);
    setIsSidebarOpen(false);
    // Don't auto-collapse expanded items to keep UX consistent
  };

  const handleMouseEnter = () => {
    setHovered(true);
    setIsSidebarOpen(true);
  };

  const toggleExpand = (name) => {
    if (!isSidebarOpen) {
      setIsSidebarOpen(true);
      setTimeout(() => {
        setExpandedItems((prev) => ({ ...prev, [name]: !prev[name] }));
      }, 100);
    } else {
      setExpandedItems((prev) => ({ ...prev, [name]: !prev[name] }));
    }
  };

  return (
    <motion.aside
      variants={sidebarVariants}
      initial={false}
      animate={isSidebarOpen ? "open" : "closed"}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      transition={{ type: "spring", stiffness: 400, damping: 40 }}
      className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen fixed top-0 left-0 flex flex-col z-40 shadow-lg"
    >
      <Link
        href={"/"}
        className="flex items-center justify-center h-20 border-b border-gray-200 dark:border-gray-700 shrink-0"
      >
        <motion.button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-full text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
          whileTap={{ scale: 0.9 }}
          animate={isSidebarOpen ? "open" : "closed"}
        >
          <AnimatedMenuIcon />
        </motion.button>
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.h1
              variants={textVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="font-bold text-2xl bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent ml-2"
            >
              PlanWAB
            </motion.h1>
          )}
        </AnimatePresence>
      </Link>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          // Check if item or any of its children are active
          let isActive = pathname === item.href;
          if (item.children) {
            isActive = item.children.some((child) => {
              const childPath = child.href.split('?')[0];
              const childQuery = child.href.split('?')[1];
              const currentType = searchParams.get('type');

              if (childQuery && childQuery.includes('type=')) {
                const type = childQuery.split('type=')[1];
                return pathname === childPath && currentType === type;
              }
              return pathname === childPath;
            });
          }

          const isExpanded = expandedItems[item.name];

          if (item.children) {
            return (
              <div
                key={item.name}
                className="space-y-1"
              >
                <button
                  onClick={() => toggleExpand(item.name)}
                  className={`w-full flex items-center p-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors relative ${isActive ? "bg-indigo-50 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 font-semibold" : ""
                    }`}
                >
                  {isActive && !isExpanded && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute left-0 w-1 h-8 bg-indigo-500 rounded-r-full"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  <item.icon className={`h-6 w-6 shrink-0 ${isSidebarOpen ? "ml-3" : "mx-auto"}`} />
                  <AnimatePresence>
                    {isSidebarOpen && (
                      <motion.span
                        variants={textVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="ml-4 whitespace-nowrap flex-1 text-left flex items-center justify-between"
                      >
                        {item.name}
                        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
                <AnimatePresence>
                  {isSidebarOpen && isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden pl-10 space-y-1"
                    >
                      {item.children.map((child) => {
                        const childPath = child.href.split('?')[0];
                        const childQuery = child.href.split('?')[1];
                        const currentType = searchParams.get('type');

                        let isChildActive = pathname === childPath;
                        if (childQuery && childQuery.includes('type=')) {
                          const type = childQuery.split('type=')[1];
                          isChildActive = pathname === childPath && currentType === type;
                        }

                        return (
                          <Link
                            key={child.name}
                            href={child.href}
                            className={`block p-2 rounded-lg text-sm transition-colors ${isChildActive
                              ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/10 font-medium"
                              : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                              }`}
                          >
                            {child.name}
                          </Link>
                        )
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center p-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors relative ${isActive ? "bg-indigo-50 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 font-semibold" : ""
                }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute left-0 w-1 h-8 bg-indigo-500 rounded-r-full"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <item.icon className={`h-6 w-6 shrink-0 ${isSidebarOpen ? "ml-3" : "mx-auto"}`} />
              <AnimatePresence>
                {isSidebarOpen && (
                  <motion.span
                    variants={textVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="ml-4 whitespace-nowrap"
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
        <Link
          href="/admin/settings"
          className={`flex items-center p-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${pathname === "/admin/settings" ? "bg-gray-100 dark:bg-gray-700" : ""
            }`}
        >
          <Settings className={`h-6 w-6 shrink-0 ${isSidebarOpen ? "ml-3" : "mx-auto"}`} />
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.span
                variants={textVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="ml-4 whitespace-nowrap"
              >
                Settings
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>
    </motion.aside>
  );
}
