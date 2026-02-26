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
    leads: {
        label: "Leads",
        color: "#ea580c",
    }
}

export function LeadsChart() {
    const [chartData, setChartData] = React.useState([])
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        const fetchChartData = async () => {
            try {
                const response = await fetch("/api/admin/dashboard/charts")
                const json = await response.json()
                if (json.success && json.data.requestsBarData) {
                    setChartData(json.data.requestsBarData)
                }
            } catch (error) {
                console.error("Failed to fetch requests chart data:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchChartData()
    }, [])

    const totalLeads = React.useMemo(
        () => chartData.reduce((acc, curr) => acc + curr.leads, 0),
        [chartData]
    )

    if (loading) {
        return (
            <Card className="py-0">
                <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
                    <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0 min-h-[100px]">
                        <CardTitle>Leads Requests</CardTitle>
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
                    <CardTitle>Leads Requests</CardTitle>
                    <CardDescription>
                        Total volume over the last 3 months
                    </CardDescription>
                </div>
                <div className="flex">
                    <div className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left sm:border-t-0 sm:border-l sm:px-8 sm:py-6">
                        <span className="text-muted-foreground text-xs">
                            {chartConfig.leads.label}
                        </span>
                        <span className="text-lg leading-none font-bold sm:text-3xl">
                            {totalLeads.toLocaleString()}
                        </span>
                    </div>
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
                        <Bar dataKey="leads" fill={`var(--color-leads)`} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
