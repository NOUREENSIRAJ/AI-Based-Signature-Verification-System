import React from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const ManagerGrowthChart = ({ logs }) => {
    /* =========================
       1. Month-wise aggregation
    ========================== */

    const getMonthlyData = () => {
        const months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];

        const data = Array(12).fill(0);

        const list = logs?.logs || [];

        list.forEach((log) => {
            if (!log?.createdAt) return;

            const date = new Date(log.createdAt);
            const month = date.getMonth(); // 0 - 11

            data[month]++;
        });

        return months.map((name, index) => ({
            month: name,
            count: data[index],
        }));
    };

    const data = getMonthlyData();

    /* =========================
       2. UI
    ========================== */

    return (
        <div
            style={{
                width: "100%",
                height: 320,
                background: "#fff",
                borderRadius: 16,
                padding: 20,
                boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
            }}
        >
            <h3 style={{ marginBottom: 10 }}>
                Growth Analytics (Monthly)
            </h3>

            <ResponsiveContainer width="100%" height="85%">
                <AreaChart
                    data={data}
                    margin={{
                        top: 10,
                        right: 10, // Reduced from default to pull the graph right
                        left: -25, // Negative value pulls the Y-axis labels closer to the edge
                        bottom: 0,
                    }}
                >                    <defs>
                        <linearGradient
                            id="colorBlue"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop
                                offset="5%"
                                stopColor="#2563eb"
                                stopOpacity={0.4}
                            />
                            <stop
                                offset="95%"
                                stopColor="#2563eb"
                                stopOpacity={0}
                            />
                        </linearGradient>
                    </defs>

                    <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                    />

                    <XAxis
                        dataKey="month"
                        tick={{ fontSize: 12 }}
                    />

                    <YAxis
                        tick={{ fontSize: 12 }}
                    />

                    <Tooltip />

                    <Area
                        type="monotone"
                        dataKey="count"
                        stroke="#2563eb"
                        strokeWidth={3}
                        fill="url(#colorBlue)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ManagerGrowthChart;