import { BirthdayConfig } from '../types';

const STORAGE_KEY = 'birthday_surprise_config_v1';

// Default preset memories with high quality Unsplash photos
export const DEFAULT_CONFIG: BirthdayConfig = {
  recipientName: 'Aurelia Catherine',
  senderName: 'LD',
  age: 24,
  birthDate: new Date(Date.now() + 10000).toISOString(), // 10 seconds from now for immediate testing experience, or configurable!
  passcode: '2512',
  passcodeHint: 'XXXXXX',
  specialMessage: 'Happy Birthday LA❤️! Semoga di usiamu yang ke-24 ini membawa sejuta kebahagiaan, senyuman manis, dan semua impian indahmu menjadi kenyataan. Terima kasih telah hadir dan mewarnai setiap detik dalam hidupku. ✨💖',
  subMessage: 'Setiap senyumanmu adalah alasan mengapa hari-hariku menjadi jauh lebih indah.',
  wishText: 'Semoga di usia ke-24 ini selalu dilimpahi kesehatan, kebahagiaan sejati, cinta tulus, dan tercapai segala cita-cita indahmu ✨',
  audioTrackId: 'musicbox',
  themeId: 'emerald',
  adminPin: '2512',
  memories: [
    {
      id: 'mem-1',
      title: 'Momen Pertama Bersama',
      date: '12 Agustus 2023',
      imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop',
      caption: 'Hari pertama kita jalan dan ngobrol berjam-jam tanpa terasa waktu berputar begitu cepat.',
      tag: 'Kenangan Manis'
    },
    {
      id: 'mem-2',
      title: 'Kencan di Kafe Favorit',
      date: '25 November 2023',
      imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop',
      caption: 'Tertawa lepas sambil menikmati secangkir kopi hangat dan cerita konyol kita.',
      tag: 'Canda & Tawa'
    },
    {
      id: 'mem-3',
      title: 'Petualangan Liburan Kita',
      date: '14 Februari 2024',
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
      caption: 'Melihat matahari terbenam bersama di tepi pantai. Momen indah yang takkan pernah terlupakan.',
      tag: 'Liburan Romantis'
    },
    {
      id: 'mem-4',
      title: 'Senyuman Paling Manis',
      date: '20 Mei 2024',
      imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800&auto=format&fit=crop',
      caption: 'Foto favoritku! Senyuman tulus yang selalu berhasil menenangkan hatiku.',
      tag: 'Favoritku'
    }
  ],
  vouchers: [
    {
      id: 'v-1',
      title: 'Voucher Jalan-jalan Gratis',
      description: 'Berlaku untuk kencan seharian penuh ke tempat impian pilihanmu!',
      iconName: 'Compass',
      code: 'DATE-NIGHT-2024',
      isClaimed: false
    },
    {
      id: 'v-2',
      title: 'Voucher Bebas Marah 1 Hari',
      description: 'Dapat digunakan sewaktu-waktu saat kamu mau diturutin semua kemauannya!',
      iconName: 'Smile',
      code: 'FREE-HAPPY-DAY',
      isClaimed: false
    },
    {
      id: 'v-3',
      title: 'Voucher Ice Cream & Coffee',
      description: 'Traktiran es krim dan kopi favoritmu tanpa batas!',
      iconName: 'Coffee',
      code: 'SWEET-TREATS',
      isClaimed: false
    }
  ]
};

export function loadBirthdayConfig(): BirthdayConfig {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_CONFIG, ...parsed };
    }
  } catch (err) {
    console.error('Failed to parse saved config:', err);
  }
  return DEFAULT_CONFIG;
}

export function saveBirthdayConfig(config: BirthdayConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (err) {
    console.error('Failed to save config:', err);
  }
}

export function resetBirthdayConfig(): BirthdayConfig {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to reset config:', err);
  }
  return DEFAULT_CONFIG;
}
