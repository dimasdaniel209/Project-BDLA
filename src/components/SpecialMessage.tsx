import React from 'react';
import { Sparkles } from 'lucide-react';
import { ThemeConfig } from '../types';

interface Props {
  recipientName: string;
  age?: number;
  specialMessage?: string;
  subMessage?: string;
  theme?: ThemeConfig;
  onOpenGiftBox?: () => void;
}

export const SpecialMessage: React.FC<Props> = ({
  recipientName,
}) => {
  return (
    <div className="w-full text-center space-y-2 max-w-3xl mx-auto py-2">
      <h1 className="text-4xl sm:text-6xl font-black text-white drop-shadow-xl tracking-tight leading-tight">
        Happy Birthday My Beloved, <span className="text-amber-200">{recipientName}</span>
      </h1>
    </div>
  );
};

