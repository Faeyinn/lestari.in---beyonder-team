import React from 'react';
import { motion } from 'motion/react';

const WaterQualityCard: React.FC = () => {
  const cleanWater = 67;
  const dirtyWater = 33;

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg p-6"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: 0.5 }}
    >
      <h3 className="text-sm text-gray-600 mb-2">Rasio Kualitas Air</h3>
      <h2 className="text-xl font-bold text-gray-800 mb-6">Air Jernih & Air Keruh</h2>

      <div className="flex items-end justify-center gap-8 mb-6">
        {/* Clean Water Bar */}
        <div className="flex flex-col items-center">
          <div className="relative w-24 h-48 bg-gray-100 rounded-lg overflow-hidden">
            <motion.div
              className="absolute bottom-0 w-full bg-blue-500 rounded-t-lg"
              initial={{ height: '0%' }}
              whileInView={{ height: `${cleanWater}%` }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 1.0, ease: 'easeOut', delay: 0.1 }}
              style={{ willChange: 'height' }}
            />
          </div>
          <p className="mt-3 text-2xl font-bold text-gray-800">{cleanWater}%</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full" />
            <span className="text-sm text-gray-600">Air Jernih</span>
          </div>
        </div>

        {/* Dirty Water Bar */}
        <div className="flex flex-col items-center">
          <div className="relative w-24 h-48 bg-gray-100 rounded-lg overflow-hidden">
            <motion.div
              className="absolute bottom-0 w-full bg-amber-700 rounded-t-lg"
              initial={{ height: '0%' }}
              whileInView={{ height: `${dirtyWater}%` }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 1.0, ease: 'easeOut', delay: 0.2 }}
              style={{ willChange: 'height' }}
            />
          </div>
          <p className="mt-3 text-2xl font-bold text-gray-800">{dirtyWater}%</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-3 h-3 bg-amber-700 rounded-full" />
            <span className="text-sm text-gray-600">Air Keruh</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WaterQualityCard;