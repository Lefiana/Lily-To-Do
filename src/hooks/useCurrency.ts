// src/hooks/useCurrency.ts
"use client";

import useSWR, { mutate } from 'swr';

const fetcher = (url: string) => fetch(url).then(res => {
    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    return res.json();
});

//URL for API
const CURRENCY_API_URL = '/api/v1/reward/currency';
const GACHA_API_URL = '/api/v1/reward/gacha';
const PUBLIC_GACHA_API_URL = '/api/v1/reward/public-gacha';
const WALLHAVEN_API_URL = '/api/v1/reward/wallhaven-gacha';

const MANUAL_GACHA_COST = 200; // Your existing cost
const PUBLIC_GACHA_COST = 300; // New cost for public gacha
// --- MAIN HOOK ---

export const useCurrency = () => {
    const { data: currencyData, error: currencyError, isLoading: currencyLoading } = useSWR(CURRENCY_API_URL, fetcher);

    const currency = currencyData?.currency ?? 0;

    const updateCurrency = async (newAmount: number) => {
        mutate(CURRENCY_API_URL, {currency: newAmount}, false);

        try{
            mutate(CURRENCY_API_URL);
        }catch(error){
            mutate(CURRENCY_API_URL);
            console.error("Error updating currency:", error);
        }
    };

    const performGacha = async (mode: 'manual' | 'public' | 'wallhaven' = 'manual', character?: string) => {
        const apiUrl = mode === 'manual' ? GACHA_API_URL : mode === 'public' ? PUBLIC_GACHA_API_URL : WALLHAVEN_API_URL;
        try{
            const res = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({mode, cost: mode === 'manual' ? MANUAL_GACHA_COST : PUBLIC_GACHA_COST, character }),
            });

            if (!res.ok){
                const errorData = await res.json();
                throw new Error(errorData.error || `Gacha failed: ${res.status}`);
            }

            const result = await res.json();
            // Revalidate currency data after gacha pull
            mutate(CURRENCY_API_URL);
            return result; // Return the gacha result (item details)
        }catch(error){
            console.error("Error performing gacha:", error);
            throw error;
        }
    }

    return {
        currency,
        currencyLoading,
        currencyError,
        updateCurrency,
        performGacha,
        revalidate: () => mutate(CURRENCY_API_URL),
    }
}