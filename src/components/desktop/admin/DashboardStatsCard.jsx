"use client";

import { useState, useEffect, useRef } from "react";
import { motion, animate, useInView } from "framer-motion";

function Counter({ end, duration = 1.5 }) {
  const ref = useRef(null);
  const [count, setCount] = useState(0);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView && typeof end === 'number' && end > 0) {
      const controls = animate(0, end, {
        duration: duration,
        ease: "easeOut",
        onUpdate: (value) => setCount(Math.floor(value)),
      });
      return controls.stop;
    } else {
      setCount(typeof end === 'number' ? end : 0);
    }
  }, [end, duration, isInView]);

  return <span ref={ref}>{typeof count === 'number' ? count.toLocaleString() : count}</span>;
}

export default function DashboardStatsCard({ title, value, icon: Icon, loading }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-gray-800/50 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col justify-between"
    >
      <div>
        <div className="flex justify-between items-start">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
          <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
            <Icon className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
          </div>
        </div>

        {loading ? (
          <div className="h-9 mt-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
        ) : (
          <p className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-4">
            {typeof value === 'number' ? <Counter end={value} /> : value}
          </p>
        )}
      </div>
    </motion.div>
  );
}