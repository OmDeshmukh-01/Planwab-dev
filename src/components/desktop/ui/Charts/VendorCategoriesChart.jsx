"use client"

import { useEffect, useState } from "react"
import { TrendingUp, PieChart as PieChartIcon } from "lucide-react"
import { Pie, PieChart, Cell } from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "./card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "./chart"

export function VendorCategoriesChart() {
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/admin/dashboard/charts');
                const json = await response.json();
                if (json.success && json.data.pieData && json.data.pieData.length > 0) {
                    const formattedData = json.data.pieData.map((item, index) => ({
                        ...item,
                        fill: `var(--color-${item.category.replace(/\s+/g, '').toLowerCase()})`,
                        color: `var(--chart-${(index % 5) + 1})`,
                    }));
                    setChartData(formattedData);
                }
            } catch (error) {
                console.error("Failed to fetch chart data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const chartConfig = {
        count: { label: "Vendors" },
    };

    chartData.forEach((item, index) => {
        const key = item.category.replace(/\s+/g, '').toLowerCase();
        chartConfig[key] = {
            label: item.category,
            color: `hsl(var(--chart-${(index % 5) + 1}))`,
        };
    });

    if (loading) {
        return (
            <Card className="flex flex-col">
                <CardHeader className="items-center pb-0">
                    <CardTitle>Vendor Categories</CardTitle>
                    <CardDescription>Loading distribution...</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 pb-0 flex items-center justify-center min-h-[250px]">
                    <div className="animate-pulse flex flex-col items-center gap-2">
                        <PieChartIcon className="h-8 w-8 text-gray-400" />
                        <span className="text-sm text-gray-500">Loading chart data...</span>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (chartData.length === 0) {
        return (
            <Card className="flex flex-col">
                <CardHeader className="items-center pb-0">
                    <CardTitle>Vendor Categories</CardTitle>
                    <CardDescription>No data available</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 pb-0 flex items-center justify-center min-h-[250px]">
                    <span className="text-sm text-gray-500">No categories found.</span>
                </CardContent>
            </Card>
        );
    }

    const totalVendors = chartData.reduce((acc, curr) => acc + curr.count, 0);

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Vendor Categories</CardTitle>
                <CardDescription>Distribution of all vendors</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[250px] pb-0"
                >
                    <PieChart>
                        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                        <Pie data={chartData} dataKey="count" nameKey="category" label>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color || `hsl(var(--chart-${(index % 5) + 1}))`} />
                            ))}
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm mt-4">
                <div className="flex items-center gap-2 leading-none font-medium">
                    Total {totalVendors} vendors identified <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-muted-foreground leading-none">
                    Showing categories for all active vendor profiles
                </div>
            </CardFooter>
        </Card>
    )
}
