'use client';

import { motion } from 'framer-motion';
import { Star, Hash } from 'lucide-react';
import { Food } from '@/types';
import Image from 'next/image';

interface FoodCardProps {
    food: Food;
}

export function FoodCard({ food }: FoodCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-sm w-full mx-auto border border-orange-100"
        >
            <div className="relative h-48 w-full bg-gray-100">
                {food.image_url ? (
                    <Image
                        src={food.image_url}
                        alt={food.name}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        No Image
                    </div>
                )}
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold text-orange-600 shadow-sm border border-orange-100">
                    {food.category}
                </div>
            </div>

            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">{food.name}</h2>
                    <div className="flex items-center bg-orange-50 px-2 py-1 rounded-lg">
                        <Star className="w-4 h-4 text-orange-500 fill-orange-500 mr-1" />
                        <span className="font-bold text-orange-700">{food.rating}</span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {food.tags?.map((tag) => (
                        <span
                            key={tag}
                            className="flex items-center text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full"
                        >
                            <Hash className="w-3 h-3 mr-1 text-gray-400" />
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
