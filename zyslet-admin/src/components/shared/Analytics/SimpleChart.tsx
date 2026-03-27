'use client';
import React from 'react';

interface ChartData {
    label: string;
    value: number;
    color: string;
}

interface SimpleChartProps {
    title: string;
    data: ChartData[];
    type: 'bar' | 'doughnut';
}

const SimpleChart: React.FC<SimpleChartProps> = ({ title, data, type }) => {
    const maxValue = Math.max(1, ...data.map((d) => d.value));

    if (type === 'bar') {
        return (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
                <div className="space-y-4">
                    {data.map((item, index) => (
                        <div key={index}>
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-sm font-medium text-gray-700">{item.label}</span>
                                <span className="text-sm font-bold text-gray-900">{item.value}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="h-2 rounded-full transition-all duration-500"
                                    style={{
                                        width: `${Math.max((item.value / maxValue) * 100, item.value > 0 ? 4 : 0)}%`,
                                        backgroundColor: item.color,
                                    }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const total = data.reduce((sum, item) => sum + item.value, 0);
    const gradientStops = data.reduce(
        (acc, item) => {
            const percentage = total > 0 ? (item.value / total) * 100 : 0;
            const start = acc.current;
            const end = start + percentage;
            acc.stops.push(`${item.color} ${start}% ${end}%`);
            acc.current = end;
            return acc;
        },
        {stops: [] as string[], current: 0},
    );
    const conicBg =
        total > 0 ? `conic-gradient(${gradientStops.stops.join(', ')})` : 'conic-gradient(#e5e7eb 0% 100%)';

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
            <div className="flex items-center justify-center mb-4">
                <div className="relative w-32 h-32">
                    <div
                        className="w-32 h-32 rounded-full"
                        style={{
                            background: conicBg,
                        }}></div>
                    <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                        <span className="text-lg font-bold text-gray-900">{total}</span>
                    </div>
                </div>
            </div>
            <div className="space-y-2">
                {data.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                            <span className="text-sm text-gray-700">{item.label}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SimpleChart;
