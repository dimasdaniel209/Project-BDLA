import React, { useState, useEffect } from 'react';
import { Sparkles, Gift, Lock } from 'lucide-react';
import { BirthdayConfig, ThemeId } from './types';
import { THEMES } from './utils/themes';
import { loadBirthdayConfig, saveBirthdayConfig } from './utils/storage';
import { loadEncryptedConfigFromPublic } from './utils/crypto';
import {
  getCloudBirthdayConfig,
  saveCloudBirthdayConfig,
  subscribeToCloudBirthdayConfig,
} from './utils/firebase';
import { BackgroundOrbs } from './components/BackgroundOrbs';
import { Balloons } from './components/Balloons';
import { Navbar } from './components/Navbar';
import { CountdownTimer } from './components/CountdownTimer';
import { GiftBoxTrigger } from './components/GiftBoxTrigger';
import { GiftBoxModal } from './components/GiftBoxModal';
import { SpecialMessage } from './components/SpecialMessage';
import { ConfigDrawer } from './components/ConfigDrawer';

export default function App() {
  const [config, setConfig] = useState<BirthdayConfig>(loadBirthdayConfig);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [isConfigDrawerOpen, setIsConfigDrawerOpen] = useState(false);
  const [isAdminPinModalOpen, setIsAdminPinModalOpen] = useState(false);
  const [adminPinInput, setAdminPinInput] = useState('');
  const [adminPinError, setAdminPinError] = useState(false);

  // Check cloud Firestore first, encrypted public file, and subscribe to real-time changes
  useEffect(() => {
    // 1. Fetch initial cloud config
    getCloudBirthdayConfig().then((cloudCfg) => {
      if (cloudCfg) {
        setConfig(cloudCfg);
        saveBirthdayConfig(cloudCfg);
      } else {
        // Fallback to public .enc file if any
        loadEncryptedConfigFromPublic().then((encConfig) => {
          if (encConfig) {
            setConfig(encConfig);
            saveBirthdayConfig(encConfig);
          }
        });
      }
    });

    // 2. Real-time subscription across all devices
    const unsubscribe = subscribeToCloudBirthdayConfig((updatedCloudCfg) => {
      if (updatedCloudCfg) {
        setConfig(updatedCloudCfg);
        saveBirthdayConfig(updatedCloudCfg);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleOpenConfig = () => {
    // If admin PIN is set, require PIN verification first
    const requiredPin = config.adminPin || '2512';
    if (requiredPin) {
      setAdminPinInput('');
      setAdminPinError(false);
      setIsAdminPinModalOpen(true);
    } else {
      setIsConfigDrawerOpen(true);
    }
  };

  const handleVerifyAdminPin = (e: React.FormEvent) => {
    e.preventDefault();
    const requiredPin = config.adminPin || '2512';
    if (adminPinInput.trim() === requiredPin) {
      setIsAdminPinModalOpen(false);
      setIsConfigDrawerOpen(true);
      setAdminPinError(false);
    } else {
      setAdminPinError(true);
    }
  };

  const [isExpired, setIsExpired] = useState<boolean>(() => {
    return new Date(config.birthDate).getTime() <= Date.now();
  });

  useEffect(() => {
    const checkExpiration = () => {
      const expired = new Date(config.birthDate).getTime() <= Date.now();
      setIsExpired(expired);
    };
    checkExpiration();
    const timer = setInterval(checkExpiration, 1000);
    return () => clearInterval(timer);
  }, [config.birthDate]);

  const theme = THEMES.emerald;
  const age = config.age || 24;

  const handleAudioTrackChange = (track: 'musicbox' | 'acoustic' | 'party' | 'custom') => {
    setConfig((prev) => ({ ...prev, audioTrackId: track }));
  };

  return (
    <div
      className={`w-full min-h-screen ${
        isExpired ? theme.gradientBg : 'bg-black'
      } flex flex-col justify-between font-sans overflow-x-hidden relative transition-colors duration-700 selection:bg-emerald-400 selection:text-black`}
    >
      {/* Background Lighting */}
      {isExpired ? (
        <BackgroundOrbs theme={theme} />
      ) : (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[700px] h-[300px] sm:h-[400px] bg-emerald-500/10 rounded-full blur-[130px]" />
        </div>
      )}

      {/* Interactive Floating Balloons - Only shown when countdown is finished */}
      {isExpired && <Balloons />}

      {/* Top Glass Navigation */}
      <Navbar
        currentTheme={theme}
        onOpenConfig={handleOpenConfig}
        audioTrack={config.audioTrackId}
        customAudioUrl={config.customAudioUrl}
        onAudioTrackChange={handleAudioTrackChange}
        isExpired={isExpired}
      />

      {/* Main Container Content */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-8 py-6 z-10 flex flex-col items-center justify-center space-y-8 sm:space-y-12">
        {/* Layout container depending on expired state */}
        {isExpired ? (
          /* When countdown finishes, display Birthday Greeting & Passcode Card */
          <div className="w-full max-w-3xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-700">
            <SpecialMessage
              recipientName={config.recipientName}
              age={age}
              specialMessage={config.specialMessage}
              subMessage={config.subMessage}
              theme={theme}
              onOpenGiftBox={() => setIsGiftModalOpen(true)}
            />

            <div className="w-full max-w-md mx-auto">
              <GiftBoxTrigger
                theme={theme}
                correctPasscode={config.passcode}
                passcodeHint={config.passcodeHint}
                onOpenGiftBox={() => setIsGiftModalOpen(true)}
              />
            </div>
          </div>
        ) : (
          /* Single Centered Clean Countdown Timer before Birthday Time */
          <div className="w-full max-w-2xl mx-auto animate-in fade-in duration-500">
            <CountdownTimer
              targetDateStr={config.birthDate}
              recipientName={config.recipientName}
              age={age}
              theme={theme}
              onTimeReached={() => {
                setIsExpired(true);
              }}
            />
          </div>
        )}
      </main>

      {/* Footer Signature - Only shown when countdown is finished */}
      {isExpired && (
        <footer className="w-full p-6 text-center z-10">
          <span className="text-white/60 text-xs font-medium tracking-widest uppercase">
            Made with Love by {config.senderName}
          </span>
        </footer>
      )}

      {/* Fullscreen Gift Box Modal */}
      <GiftBoxModal
        config={config}
        isOpen={isGiftModalOpen}
        onClose={() => setIsGiftModalOpen(false)}
      />

      {/* Admin Verification PIN Modal */}
      {isAdminPinModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 w-full max-w-sm shadow-2xl text-center space-y-4 relative">
            <button
              onClick={() => setIsAdminPinModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors"
            >
              ✕
            </button>

            <div className="w-14 h-14 bg-rose-500/20 border border-rose-500/40 rounded-2xl flex items-center justify-center text-rose-400 mx-auto">
              <Lock className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white mb-1">
                PIN Admin
              </h3>
            </div>

            <form onSubmit={handleVerifyAdminPin} className="space-y-3">
              <div>
                <input
                  type="password"
                  value={adminPinInput}
                  onChange={(e) => {
                    setAdminPinInput(e.target.value);
                    setAdminPinError(false);
                  }}
                  placeholder="PIN"
                  autoFocus
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 text-center text-lg text-white font-mono tracking-widest focus:outline-none focus:border-rose-500 transition-all"
                />
                {adminPinError && (
                  <p className="text-xs text-rose-400 mt-1.5 font-medium animate-shake">
                    PIN salah
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold py-3 rounded-2xl text-sm shadow-lg transition-all"
              >
                Buka
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Sender Configuration Customizer Drawer */}
      <ConfigDrawer
        config={config}
        isOpen={isConfigDrawerOpen}
        onClose={() => setIsConfigDrawerOpen(false)}
        onSave={(updatedConfig) => setConfig(updatedConfig)}
      />
    </div>
  );
}
