'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Food } from '@/types';
import { FoodCard } from '@/components/FoodCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Utensils, RefreshCw, Filter, ChefHat } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Home() {
    const [foods, setFoods] = useState<Food[]>([]);
    const [filteredFoods, setFilteredFoods] = useState<Food[]>([]);
    const [recommendation, setRecommendation] = useState<Food | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    // Unique categories and tags
    const categories = Array.from(new Set(foods.map((f) => f.category)));

    useEffect(() => {
        fetchFoods();
    }, []);

    useEffect(() => {
        if (selectedCategory) {
            setFilteredFoods(foods.filter((f) => f.category === selectedCategory));
        } else {
            setFilteredFoods(foods);
        }
    }, [selectedCategory, foods]);

    const fetchFoods = async () => {
        const { data, error } = await supabase.from('foods').select('*');
        if (error) {
            console.error('Error fetching foods:', error);
        } else {
            setFoods(data || []);
        }
    };

    const recommendFood = () => {
        if (filteredFoods.length === 0) return;

        setIsAnimating(true);
        setRecommendation(null);

        // Simulation of shuffling/roulette effect
        let count = 0;
        const interval = setInterval(() => {
            const random = filteredFoods[Math.floor(Math.random() * filteredFoods.length)];
            setRecommendation(random);
            count++;
            if (count > 10) {
                clearInterval(interval);
                const finalChoice = filteredFoods[Math.floor(Math.random() * filteredFoods.length)];
                setRecommendation(finalChoice);
                setIsAnimating(false);
            }
        }, 100);
    };

    return (
        <main className="min-h-screen bg-white text-gray-900 font-sans pb-20">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-center z-50">
                <div className="flex items-center gap-2">
                    <ChefHat className="w-6 h-6 text-orange-500" />
                    <h1 className="text-lg font-bold">배달 음식 추천기</h1>
                </div>
            </header>

            <div className="max-w-md mx-auto px-4 pt-24">
                {/* Main Action Area */}
                <section className="flex flex-col items-center justify-center min-h-[50vh] space-y-8">
                    <div className="text-center space-y-2">
                        <h2 className="text-3xl font-extrabold text-gray-900">
                            오늘 뭐 먹지?
                        </h2>
                        <p className="text-gray-500">고민하지 말고 버튼을 눌러보세요!</p>
                    </div>

                    <div className="relative w-full h-80 flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            {recommendation ? (
                                <FoodCard key={recommendation.id} food={recommendation} />
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col items-center justify-center w-full h-full bg-orange-50 rounded-2xl border-2 border-dashed border-orange-200"
                                >
                                    <Utensils className="w-16 h-16 text-orange-300 mb-4" />
                                    <span className="text-orange-400 font-medium">
                                        아직 추천된 음식이 없어요
                                    </span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={recommendFood}
                        disabled={isAnimating || filteredFoods.length === 0}
                        className={cn(
                            "w-full py-4 rounded-xl text-xl font-bold text-white shadow-lg shadow-orange-200 transition-all",
                            isAnimating
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-gradient-to-r from-orange-500 to-red-500 hover:shadow-orange-300"
                        )}
                    >
                        {isAnimating ? (
                            <span className="flex items-center justify-center gap-2">
                                <RefreshCw className="animate-spin w-6 h-6" />
                                고르는 중...
                            </span>
                        ) : (
                            "밥 골라줘!"
                        )}
                    </motion.button>
                </section>

                {/* Filters */}
                <section className="mt-12 space-y-4">
                    <div className="flex items-center gap-2 text-gray-800 font-bold text-lg mb-4">
                        <Filter className="w-5 h-5 text-orange-500" />
                        <span>카테고리 필터</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={cn(
                                "px-4 py-2 rounded-full text-sm font-medium transition-colors border",
                                selectedCategory === null
                                    ? "bg-gray-900 text-white border-gray-900"
                                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                            )}
                        >
                            전체
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={cn(
                                    "px-4 py-2 rounded-full text-sm font-medium transition-colors border",
                                    selectedCategory === cat
                                        ? "bg-orange-500 text-white border-orange-500"
                                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}
