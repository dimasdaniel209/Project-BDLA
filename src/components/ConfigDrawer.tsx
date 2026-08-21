import React, { useState, useRef } from 'react';
import {
  X,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Calendar,
  Lock,
  MessageSquare,
  Image as ImageIcon,
  Gift,
  Share2,
  Check,
  User,
  Music,
  Flame,
  FileKey,
  Download,
  Upload,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { BirthdayConfig, MemoryItem, GiftVoucher } from '../types';
import { saveBirthdayConfig, resetBirthdayConfig, encodeConfigToUrl } from '../utils/storage';
import { encryptConfig, decryptConfig, downloadEncryptedConfigFile } from '../utils/crypto';
import { saveCloudBirthdayConfig } from '../utils/firebase';

interface Props {
  config: BirthdayConfig;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedConfig: BirthdayConfig) => void;
}

export const ConfigDrawer: React.FC<Props> = ({ config, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<BirthdayConfig>({ ...config });
  const [activeSubTab, setActiveSubTab] = useState<'general' | 'memories' | 'vouchers' | 'encryption'>('general');
  const [isSavedToast, setIsSavedToast] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [encryptStatusMsg, setEncryptStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleGeneralChange = (
    field: keyof BirthdayConfig,
    val: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleSaveAll = async () => {
    saveBirthdayConfig(formData);
    onSave(formData);
    setIsSavedToast(true);
    // Auto-sync to Cloud Firestore database
    await saveCloudBirthdayConfig(formData);
    setTimeout(() => {
      setIsSavedToast(false);
      onClose();
    }, 1200);
  };

  const handleReset = async () => {
    if (window.confirm('Kembalikan ke pengaturan default awal?')) {
      const def = resetBirthdayConfig();
      setFormData(def);
      onSave(def);
      await saveCloudBirthdayConfig(def);
    }
  };

  // Memory Operations
  const handleAddMemory = () => {
    const newMem: MemoryItem = {
      id: `mem-${Date.now()}`,
      title: 'Judul Kenangan Baru',
      date: 'Hari Ini',
      imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop',
      caption: 'Tuliskan deskripsi kenangan manismu di sini...',
      tag: 'Kenangan Baru',
    };
    setFormData((prev) => ({ ...prev, memories: [...prev.memories, newMem] }));
  };

  const handleUpdateMemory = (id: string, field: keyof MemoryItem, val: string) => {
    setFormData((prev) => ({
      ...prev,
      memories: prev.memories.map((m) => (m.id === id ? { ...m, [field]: val } : m)),
    }));
  };

  const handleDeleteMemory = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      memories: prev.memories.filter((m) => m.id !== id),
    }));
  };

  // Voucher Operations
  const handleAddVoucher = () => {
    const newV: GiftVoucher = {
      id: `v-${Date.now()}`,
      title: 'Voucher Spesial Baru',
      description: 'Deskripsi hadiah yang bisa diklaim...',
      iconName: 'Gift',
      code: `SPECIAL-${Math.floor(1000 + Math.random() * 9000)}`,
      isClaimed: false,
    };
    setFormData((prev) => ({ ...prev, vouchers: [...prev.vouchers, newV] }));
  };

  const handleUpdateVoucher = (id: string, field: keyof GiftVoucher, val: string) => {
    setFormData((prev) => ({
      ...prev,
      vouchers: prev.vouchers.map((v) => (v.id === id ? { ...v, [field]: val } : v)),
    }));
  };

  const handleDeleteVoucher = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      vouchers: prev.vouchers.filter((v) => v.id !== id),
    }));
  };

  const handleShareLink = () => {
    saveBirthdayConfig(formData);
    onSave(formData);
    const shareableUrl = encodeConfigToUrl(formData);
    navigator.clipboard.writeText(shareableUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleExportEncryptedFile = async () => {
    try {
      setIsExporting(true);
      setEncryptStatusMsg(null);
      await downloadEncryptedConfigFile(formData, 'birthday-config.enc');
      setEncryptStatusMsg({
        type: 'success',
        text: 'File "birthday-config.enc" berhasil diunduh dan dienkripsi dengan aman (AES-256)!',
      });
    } catch (e: any) {
      setEncryptStatusMsg({
        type: 'error',
        text: e.message || 'Gagal mengunduh file terenkripsi.',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setEncryptStatusMsg(null);
      const text = await file.text();
      const decrypted = await decryptConfig(text);
      setFormData(decrypted);
      saveBirthdayConfig(decrypted);
      onSave(decrypted);
      setEncryptStatusMsg({
        type: 'success',
        text: `Berhasil mendekripsi dan memuat data untuk ${decrypted.recipientName}!`,
      });
    } catch (err: any) {
      setEncryptStatusMsg({
        type: 'error',
        text: err.message || 'Gagal membaca atau mendekripsi file.',
      });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="relative z-10 w-full max-w-xl bg-slate-900/90 text-white border-l border-white/20 shadow-2xl flex flex-col h-full overflow-hidden backdrop-blur-2xl">
        {/* Drawer Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div>
            <h2 className="text-lg font-extrabold flex items-center gap-2">
              ⚙️ Pengaturan & Edit Kejutan
            </h2>
            <p className="text-slate-400 text-xs">Sesuaikan nama, tanggal, pesan, foto, dan kode akses</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Subtab Navigation */}
        <div className="flex border-b border-white/10 bg-slate-950/50 p-2 gap-1.5 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('general')}
            className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeSubTab === 'general' ? 'bg-rose-500 text-white' : 'text-slate-400 hover:bg-white/5'
            }`}
          >
            <User className="w-3.5 h-3.5" /> Umum & Akses
          </button>
          <button
            onClick={() => setActiveSubTab('memories')}
            className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeSubTab === 'memories' ? 'bg-rose-500 text-white' : 'text-slate-400 hover:bg-white/5'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" /> Foto ({formData.memories.length})
          </button>
          <button
            onClick={() => setActiveSubTab('vouchers')}
            className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeSubTab === 'vouchers' ? 'bg-rose-500 text-white' : 'text-slate-400 hover:bg-white/5'
            }`}
          >
            <Gift className="w-3.5 h-3.5" /> Voucher
          </button>
          <button
            onClick={() => setActiveSubTab('encryption')}
            className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeSubTab === 'encryption' ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:bg-white/5'
            }`}
          >
            <FileKey className="w-3.5 h-3.5 text-emerald-300" /> File .enc
          </button>
        </div>

        {/* Form Body Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5">
          {/* TAB: General Settings */}
          {activeSubTab === 'general' && (
            <div className="space-y-4">
              {/* Recipient, Sender Names & Age */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Nama Penerima
                  </label>
                  <input
                    type="text"
                    value={formData.recipientName}
                    onChange={(e) => handleGeneralChange('recipientName', e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Umur (Tahun)
                  </label>
                  <input
                    type="number"
                    value={formData.age ?? 24}
                    onChange={(e) => setFormData((prev) => ({ ...prev, age: parseInt(e.target.value) || 24 }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Nama Pengirim
                  </label>
                  <input
                    type="text"
                    value={formData.senderName}
                    onChange={(e) => handleGeneralChange('senderName', e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              {/* Target Birthday Date & Time */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-rose-400" /> Target Tanggal & Waktu Ulang Tahun
                </label>
                <input
                  type="datetime-local"
                  value={formData.birthDate ? new Date(formData.birthDate).toISOString().slice(0, 16) : ''}
                  onChange={(e) => handleGeneralChange('birthDate', new Date(e.target.value).toISOString())}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-rose-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  💡 Tips: Kamu bisa mengatur tanggal beberapa detik ke depan untuk menguji countdown secara langsung!
                </p>
              </div>

              {/* Passcode & Hint */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-amber-400" /> Kode Akses Kotak Hadiah
                  </label>
                  <input
                    type="text"
                    value={formData.passcode}
                    onChange={(e) => handleGeneralChange('passcode', e.target.value)}
                    placeholder="Contoh: 1208"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-rose-500 font-mono tracking-wider"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Petunjuk Kode Akses
                  </label>
                  <input
                    type="text"
                    value={formData.passcodeHint}
                    onChange={(e) => handleGeneralChange('passcodeHint', e.target.value)}
                    placeholder="Contoh: Tanggal jadian kita"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              {/* Special Messages */}
              <div className="pt-2 border-t border-slate-800">
                <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-400" /> Doa & Harapan di Lampion (Tulisan Harapan)
                </label>
                <textarea
                  rows={2}
                  value={formData.wishText || ''}
                  onChange={(e) => handleGeneralChange('wishText', e.target.value)}
                  placeholder="Tuliskan doa & harapan yang tertera pada lampion terbang..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="pt-2 border-t border-slate-800">
                <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-pink-400" /> Pesan Spesial Utama (Isi Surat)
                </label>
                <textarea
                  rows={4}
                  value={formData.specialMessage}
                  onChange={(e) => handleGeneralChange('specialMessage', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Pesan Tambahan (Sub-headline)
                </label>
                <input
                  type="text"
                  value={formData.subMessage}
                  onChange={(e) => handleGeneralChange('subMessage', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Audio Track Option */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1">
                  <Music className="w-3.5 h-3.5 text-cyan-400" /> Musik Latar Default
                </label>
                <select
                  value={formData.audioTrackId}
                  onChange={(e) =>
                    handleGeneralChange(
                      'audioTrackId',
                      e.target.value as BirthdayConfig['audioTrackId']
                    )
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="musicbox">🎵 Kotak Musik Ulang Tahun</option>
                  <option value="acoustic">🎸 Petikan Akustik Romantis</option>
                  <option value="party">🎉 Melodi Pesta Ceria</option>
                  <option value="custom">🔗 YouTube / YouTube Music / URL Audio</option>
                </select>

                {formData.audioTrackId === 'custom' && (
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Link YouTube / YouTube Music / Direct Audio MP3
                    </label>
                    <input
                      type="text"
                      value={formData.customAudioUrl || ''}
                      onChange={(e) => handleGeneralChange('customAudioUrl', e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=... atau https://music.youtube.com/..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>
                )}
                <p className="text-[11px] text-slate-400">
                  💡 Catatan: Mendukung link YouTube, YouTube Music, maupun file .mp3. Lagu bisa diputar/diganti kapan saja.
                </p>
              </div>

              {/* Admin Security PIN to Lock Settings */}
              <div className="pt-3 border-t border-slate-800">
                <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-rose-400" /> PIN Admin (Pengunci Pengaturan)
                </label>
                <input
                  type="text"
                  value={formData.adminPin || '2512'}
                  onChange={(e) => handleGeneralChange('adminPin', e.target.value)}
                  placeholder="PIN Pengunci (Contoh: 2512)"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-rose-500 font-mono tracking-wider"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  🔒 PIN ini digunakan untuk mengunci menu pengaturan ini agar penerima tidak dapat mengubah nama, tanggal, atau isi pesan.
                </p>
              </div>
            </div>
          )}

          {/* TAB: Photo Memories */}
          {activeSubTab === 'memories' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Daftar Foto & Kenangan Spesial</span>
                <button
                  onClick={handleAddMemory}
                  className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Tambah Foto
                </button>
              </div>

              <div className="space-y-3">
                {formData.memories.map((mem, index) => (
                  <div
                    key={mem.id}
                    className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/80 space-y-2 relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-rose-400">
                        Foto #{index + 1}
                      </span>
                      <button
                        onClick={() => handleDeleteMemory(mem.id)}
                        className="text-slate-400 hover:text-red-400 p-1"
                        title="Hapus foto ini"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={mem.title}
                        onChange={(e) => handleUpdateMemory(mem.id, 'title', e.target.value)}
                        placeholder="Judul Kenangan"
                        className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                      />
                      <input
                        type="text"
                        value={mem.date}
                        onChange={(e) => handleUpdateMemory(mem.id, 'date', e.target.value)}
                        placeholder="Tanggal (Cth: 12 Aug)"
                        className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                      />
                    </div>

                    <input
                      type="text"
                      value={mem.imageUrl}
                      onChange={(e) => handleUpdateMemory(mem.id, 'imageUrl', e.target.value)}
                      placeholder="URL Gambar (Google Drive, Unsplash, Imgur, dll)"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                    />
                    <p className="text-[10px] text-slate-400">
                      📷 Boleh gunakan link 'Bagikan' Google Drive, otomatis dikonversi ke gambar!
                    </p>

                    <input
                      type="text"
                      value={mem.caption}
                      onChange={(e) => handleUpdateMemory(mem.id, 'caption', e.target.value)}
                      placeholder="Keterangan / Cerita Singkat"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: Vouchers */}
          {activeSubTab === 'vouchers' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Voucher Hadiah Yang Bisa Diklaim</span>
                <button
                  onClick={handleAddVoucher}
                  className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Tambah Voucher
                </button>
              </div>

              <div className="space-y-3">
                {formData.vouchers.map((v, idx) => (
                  <div
                    key={v.id}
                    className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/80 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-400">
                        Voucher #{idx + 1}
                      </span>
                      <button
                        onClick={() => handleDeleteVoucher(v.id)}
                        className="text-slate-400 hover:text-red-400 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={v.title}
                      onChange={(e) => handleUpdateVoucher(v.id, 'title', e.target.value)}
                      placeholder="Judul Voucher"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                    />

                    <input
                      type="text"
                      value={v.description}
                      onChange={(e) => handleUpdateVoucher(v.id, 'description', e.target.value)}
                      placeholder="Deskripsi Voucher"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                    />

                    <input
                      type="text"
                      value={v.code}
                      onChange={(e) => handleUpdateVoucher(v.id, 'code', e.target.value)}
                      placeholder="Kode Klaim"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-amber-300 font-mono"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: Encrypted File (.enc) Storage & Backup */}
          {activeSubTab === 'encryption' && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4 space-y-2 text-emerald-200">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  <h3 className="font-bold text-sm text-emerald-300">
                    Enkripsi File Aman (AES-256 GCM)
                  </h3>
                </div>
                <p className="text-xs leading-relaxed text-emerald-200/80">
                  Kamu bisa menyimpan seluruh pengaturan (nama, foto, countdown, doa lampion, surat cinta, voucher) ke dalam satu file terenkripsi (<span className="font-mono font-bold text-emerald-300">.enc</span>). Data di dalamnya tidak bisa dibaca langsung secara sembarangan karena diproteksi enkripsi kriptografi.
                </p>
              </div>

              {/* Status Alert Message */}
              {encryptStatusMsg && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                    encryptStatusMsg.type === 'success'
                      ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                      : 'bg-rose-500/20 border border-rose-500/40 text-rose-300'
                  }`}
                >
                  {encryptStatusMsg.type === 'success' ? (
                    <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  )}
                  <span>{encryptStatusMsg.text}</span>
                </div>
              )}

              {/* Action 1: Export / Download .enc */}
              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 space-y-3">
                <div>
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    <Download className="w-4 h-4 text-emerald-400" /> 1. Unduh File Terenkripsi (.enc)
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Download file <span className="font-mono text-amber-300 font-bold">birthday-config.enc</span> yang berisi seluruh konfigurasi saat ini.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleExportEncryptedFile}
                  disabled={isExporting}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98 cursor-pointer disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  {isExporting ? 'Mengenkripsi & Mengunduh...' : 'Unduh File birthday-config.enc'}
                </button>
              </div>

              {/* Action 2: Import / Load .enc */}
              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 space-y-3">
                <div>
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    <Upload className="w-4 h-4 text-cyan-400" /> 2. Unggah & Baca File Terenkripsi
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Pilih file <span className="font-mono text-cyan-300">.enc</span> yang pernah kamu unduh untuk memuat dan mendekripsi semua datanya ke aplikasi ini.
                  </p>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".enc,application/octet-stream,text/plain"
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 border border-slate-600 transition-all active:scale-98 cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-cyan-400" />
                  Pilih File .enc dari Komputer / HP
                </button>
              </div>

              {/* Guide: How Auto-Load Works */}
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs text-slate-300">
                <h5 className="font-bold text-amber-300 flex items-center gap-1.5">
                  💡 Cara Kerja Otomatis Saat Di-Host / Dibagikan:
                </h5>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-400 leading-relaxed">
                  <li>
                    Unduh file <span className="font-mono text-white">birthday-config.enc</span> dari tombol di atas.
                  </li>
                  <li>
                    Masukkan file tersebut ke dalam folder <span className="font-mono text-amber-200">public/birthday-config.enc</span> di repositori GitHub kamu.
                  </li>
                  <li>
                    Saat website dibuka di browser mana pun (tanpa URL link panjang), aplikasi akan **otomatis membaca dan mendekripsi** file tersebut secara langsung!
                  </li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-white/10 bg-slate-950/80 flex items-center justify-between gap-3">
          <button
            onClick={handleReset}
            className="text-slate-400 hover:text-white text-xs flex items-center gap-1 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Default
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShareLink}
              className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              {copiedLink ? 'Tautan Tersalin!' : 'Bagikan Link'}
            </button>

            <button
              onClick={handleSaveAll}
              className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-extrabold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-lg active:scale-95 transition-transform"
            >
              <Save className="w-4 h-4" /> Simpan Perubahan
            </button>
          </div>
        </div>

        {isSavedToast && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4" /> Perubahan berhasil disimpan!
          </div>
        )}
      </div>
    </div>
  );
};
