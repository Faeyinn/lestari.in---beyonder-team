import React from 'react';
import { type LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';
import BgStat from '@/assets/bg-stat-card.png';

interface ReportStatCardProps {
  title: string;
  subtitle: string;
  value: string | number;
  icon: LucideIcon;
  gradient: string;
  delay?: number;
}

const ReportStatCard: React.FC<ReportStatCardProps> = ({
  title,
  subtitle,
  value,
  icon: Icon,
  delay = 0,
}) => {
  return (
    <motion.div
      className={`rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all cursor-pointer relative overflow-hidden bg-cover bg-center`}
      style={{ backgroundImage: `url(${BgStat})` }}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: (delay ?? 0) / 1000 }}
    >
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12" />
      
      {/* color overlay to make text readable (you can tweak) */}
      <div className="absolute inset-0 bg-green-700/30 backdrop-blur-sm" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm opacity-90 mb-1">{subtitle}</p>
            <h3 className="text-lg font-bold">{title}</h3>
          </div>
          <div className="bg-white bg-opacity-20 p-3 rounded-xl backdrop-blur-sm">
            <Icon size={24} className="text-green-800" />
          </div>
        </div>
        <p className="text-5xl font-bold">{value}</p>
      </div>
    </motion.div>
  );
};

export default ReportStatCard;