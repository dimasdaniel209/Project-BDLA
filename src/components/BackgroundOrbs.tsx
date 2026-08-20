import React from 'react';
import { ThemeConfig } from '../types';

interface Props {
  theme: ThemeConfig;
}

export const BackgroundOrbs: React.FC<Props> = ({ theme }) => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div
        className={`absolute -top-16 -left-16 w-80 h-80 sm:w-96 sm:h-96 rounded-full blur-[90px] animate-pulse transition-colors duration-700 ${theme.orb1}`}
      />
      <div
        className={`absolute top-1/2 -right-20 w-80 h-80 sm:w-[30rem] sm:h-[30rem] rounded-full blur-[100px] transition-colors duration-700 ${theme.orb2}`}
      />
      <div
        className={`absolute -bottom-24 left-1/3 w-96 h-96 sm:w-[32rem] sm:h-[32rem] rounded-full blur-[110px] transition-colors duration-700 ${theme.orb3}`}
      />
    </div>
  );
};
