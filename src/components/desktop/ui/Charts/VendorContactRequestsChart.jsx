"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "./chart"

const chartConfig = {
    views: {
        label: "Requests",
    },
    requests: {
        label: "Vendor",
        color: "blue",
    },
    contact: {
        label: "Contact",
        color: "#a855f7",
    }
}

export function VendorContactRequestsChart() {
    const [chartData, setChartData] = React.useState([])
    const [activeChart, setActiveChart] = React.useState("requests")
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        const fetchChartData = async () => {
            try {
                const response = await fetch("/api/admin/dashboard/charts")
                const json = await response.json()
                if (json.success && json.data.requestsBarData && json.data.vendorRequestsBarData) {

                    const combinedMap = new Map();

                    json.data.requestsBarData.forEach(item => {
                        combinedMap.set(item.date, { date: item.date, contact: item.contact || 0, requests: 0 });
                    });

                    json.data.vendorRequestsBarData.forEach(item => {
                        if (combinedMap.has(item.date)) {
                            combinedMap.get(item.date).requests = item.requests || 0;
                        } else {
                            combinedMap.set(item.date, { date: item.date, contact: 0, requests: item.requests || 0 });
                        }
                    });

                    const finalData = Array.from(combinedMap.values()).sort((a, b) => new Date(a.date) - new Date(b.date));
                    setChartData(finalData);
                }
            } catch (error) {
                console.error("Failed to fetch vendor and contact requests chart data:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchChartData()
    }, [])

    const total = React.useMemo(
        () => ({
            requests: chartData.reduce((acc, curr) => acc + (curr.requests || 0), 0),
            contact: chartData.reduce((acc, curr) => acc + (curr.contact || 0), 0),
        }),
        [chartData]
    )

    if (loading) {
        return (
            <Card className="py-0">
                <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
                    <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0 min-h-[100px]">
                        <CardTitle>Vendor & Contact Requests</CardTitle>
                        <CardDescription>Loading request data...</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="px-2 sm:p-6 flex items-center justify-center min-h-[250px]">
                    <div className="animate-pulse text-gray-500">Loading chart data...</div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="py-0">
            <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0">
                    <CardTitle>Vendor & Contact Requests</CardTitle>
                    <CardDescription>
                        Total volume over the last 3 months
                    </CardDescription>
                </div>
                <div className="flex">
                    {["requests", "contact"].map((key) => {
                        return (
                            <button
                                key={key}
                                data-active={activeChart === key}
                                className="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                                onClick={() => setActiveChart(key)}
                            >
                                <span className="text-muted-foreground text-xs">
                                    {chartConfig[key].label}
                                </span>
                                <span className="text-lg leading-none font-bold sm:text-3xl">
                                    {total[key].toLocaleString()}
                                </span>
                            </button>
                        )
                    })}
                </div>
            </CardHeader>
            <CardContent className="px-2 sm:p-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                >
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value)
                                return date.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                })
                            }}
                        />
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    className="w-[150px]"
                                    nameKey="views"
                                    labelFormatter={(value) => {
                                        return new Date(value).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })
                                    }}
                                />
                            }
                        />
                        <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
