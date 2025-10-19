import React, { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, LabelList } from "recharts";
import { getCurrencyRates } from "../../api/currencyApi.js";
import styles from "./CurrencyAreaChart.module.css";

const MOCK_RATES = [
    { currencyCodeA: 840, rateBuy: 40.5, rateSell: 41.0 }, 
    { currencyCodeA: 978, rateBuy: 43.5, rateSell: 44.0 } 
];

const CustomDot = ({ cx, cy, value }) => {
    
    const val = Number(value);

    if (cx === undefined || cy === undefined || isNaN(val)) {
        return null;
    }

    return (
        <g>
            <circle 
                cx={cx} 
                cy={cy} 
                r={5} 
                fill="white" 
                stroke="#FF868D" 
                strokeWidth={2}
                style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
            />
            <text
                x={cx}
                y={cy - 15}
                fontSize={12}
                fontWeight="bold"
                fill="#FF868D"
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ 
                    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))',
                    pointerEvents: 'none'
                }}
            >
                {val.toFixed(2)}
            </text>
        </g>
    );
};

const CurrencyAreaChart = () => {
    const [currencyRates, setCurrencyRates] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null); 

    useEffect(() => {
        const fetchRates = async () => {
            setIsLoading(true);
            setError(null); 
            
            let rates;
            try {
                rates = await getCurrencyRates();
            } catch (err) {
                console.error("API hatası! Geçici veri kullanılıyor. Hata:", err);
                setError("API Rate Limit Hatası? Geçici veriler gösteriliyor."); 
                rates = MOCK_RATES; 
            } finally {
                const processed = rates
                    .filter(r => r.currencyCodeA === 840 || r.currencyCodeA === 978)
                    .map(r => ({
                        currency: r.currencyCodeA === 840 ? "USD" : "EUR",
                        buy: parseFloat(r.rateBuy) || 0,
                    }));
                
                if (processed.length === 0 && !error) {
                    setError("Filtreleme sonrasında veri bulunamadı.");
                }
                
                setCurrencyRates(processed);
                setIsLoading(false);
            }
        };

        fetchRates();
    }, [error]);

    const data = currencyRates.map(r => ({ 
        name: r.currency, 
        buy: r.buy,
        currency: r.currency
    }));

    return (
        <div className={styles.currencyWidget}>
            {error && <div className={styles.currencyError}>{error}</div>} 
            
            {isLoading ? (
                <div className={styles.currencyLoading}>Loading rates...</div>
            ) : (
                <ResponsiveContainer width="100%" height="100%" className={styles.areaChart}>
                    <AreaChart 
                        data={data} 
                        margin={{ top: 30, right: 30, left: 30, bottom: 20 }}
                        style={{ background: 'transparent' }}
                    >
                        <defs>
                            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#FF868D" stopOpacity={0.8} />
                                <stop offset="50%" stopColor="#FF868D" stopOpacity={0.4} />
                                <stop offset="100%" stopColor="#FF868D" stopOpacity={0.1} />
                            </linearGradient>
                            <linearGradient id="areaShadow" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="rgba(255,134,141,0.3)" />
                                <stop offset="100%" stopColor="rgba(255,134,141,0)" />
                            </linearGradient>
                        </defs>

                        <XAxis 
                            dataKey="name" 
                            hide
                        />
                        <YAxis 
                            hide 
                            domain={['dataMin - 0.5', 'dataMax + 0.5']} 
                        />

                        <Area
                            type="monotone"
                            dataKey="buy"
                            stroke="#FF868D"
                            strokeWidth={2}
                            fill="url(#areaGradient)"
                            dot={CustomDot} 
                            activeDot={false}
                        >
                            <LabelList 
                                dataKey="buy" 
                                position="top" 
                                style={{ 
                                    fontSize: '12px', 
                                    fontWeight: 'bold', 
                                    fill: '#FF868D',
                                    textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                                }}
                                formatter={(value) => value.toFixed(2)}
                            />
                        </Area>
                    </AreaChart>
                </ResponsiveContainer>
            )}
        </div>
    );
};

export default CurrencyAreaChart;