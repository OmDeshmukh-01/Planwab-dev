import { useState, useEffect } from "react";

function Counter({ end, duration = 1000 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;

      const progress = Math.min((timestamp - startTimestamp) / duration, 1);

      const easeOut = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOut * end));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };

    if (typeof end === 'number' && end > 0) {
      window.requestAnimationFrame(step);
    } else {
      setCount(end);
    }
  }, [end, duration]);

  return <span>{typeof count === 'number' ? count.toLocaleString() : count}</span>;
}

export default function DashboardStatsCard({ title, value, icon: Icon, loading }) {
  return (
    <div className="bg-white dark:bg-gray-800/50 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
          <Icon className="h-6 w-6 text-indigo-500 dark:text-indigo-400" />
        </div>

        {loading ? (
          <div className="h-9 mt-2 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
        ) : (
          <p className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-2">
            {typeof value === 'number' ? <Counter end={value} /> : value}
          </p>
        )}
      </div>
    </div>
  );
}