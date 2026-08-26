import { Camera, ScanLine, Image as ImageIcon } from 'lucide-react';

export default function FoodCamTab() {
  return (
    <div className="flex flex-col h-full absolute inset-0 bg-black z-0">
      {/* Camera Viewfinder Mockup */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80')] bg-cover bg-center opacity-60"></div>
      
      {/* Dark Gradient Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90 pointer-events-none"></div>

      {/* Header Info */}
      <div className="relative z-10 pt-8 px-6 text-center">
        <h2 className="text-xl font-bold text-white mb-2 shadow-black drop-shadow-md">Food Cam</h2>
        <div className="inline-flex items-center gap-2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
          <ScanLine className="w-4 h-4 text-brand-400" />
          <p className="text-sm font-medium text-slate-200">
            Petunjuk: Foto makanan / komposisi / nilai gizi
          </p>
        </div>
      </div>

      {/* Viewfinder Frame */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="w-3/4 aspect-square border-2 border-brand-400/50 rounded-3xl relative">
          {/* Corner marks */}
          <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-brand-400 rounded-tl-3xl"></div>
          <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-brand-400 rounded-tr-3xl"></div>
          <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-brand-400 rounded-bl-3xl"></div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-brand-400 rounded-br-3xl"></div>
          
          <div className="absolute inset-0 bg-brand-400/10 animate-pulse rounded-3xl"></div>
        </div>
      </div>

      {/* Controls */}
      <div className="relative z-10 mt-auto pb-32 px-8 flex justify-between items-center">
        {/* Gallery button */}
        <button className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/30 text-white">
          <ImageIcon className="w-5 h-5" />
        </button>

        {/* Shutter */}
        <button className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center border-4 border-white">
          <div className="w-16 h-16 rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.5)]"></div>
        </button>

        {/* Switch camera / placeholder */}
        <button className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/30 text-white">
          <Camera className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
