export type ThemeId = 'rose' | 'purple' | 'midnight' | 'emerald' | 'amber';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  gradientBg: string;
  orb1: string;
  orb2: string;
  orb3: string;
  cardBg: string;
  cardBorder: string;
  textColor: string;
  textSecondary: string;
  accentColor: string;
  buttonBg: string;
  buttonText: string;
}

export interface MemoryItem {
  id: string;
  title: string;
  date: string;
  imageUrl: string;
  caption: string;
  tag?: string;
}

export interface GiftVoucher {
  id: string;
  title: string;
  description: string;
  iconName: string;
  code: string;
  isClaimed: boolean;
}

export interface BirthdayConfig {
  recipientName: string;
  senderName: string;
  age?: number;
  birthDate: string; // ISO String or YYYY-MM-DDTHH:mm
  passcode: string;
  passcodeHint: string;
  specialMessage: string;
  subMessage: string;
  wishText?: string;
  audioTrackId: 'musicbox' | 'acoustic' | 'party' | 'custom';
  customAudioUrl?: string;
  themeId: ThemeId;
  adminPin?: string;
  memories: MemoryItem[];
  vouchers: GiftVoucher[];
}
