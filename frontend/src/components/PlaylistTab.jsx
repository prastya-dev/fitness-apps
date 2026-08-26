import { Music, Play } from 'lucide-react';

export default function PlaylistTab() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Playlist Latihan</h2>
        <p className="text-slate-400 text-sm">Musik pembakar semangat untuk sesi gym kamu hari ini.</p>
      </div>

      <div className="glass-card p-5 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Music className="w-5 h-5 text-brand-400" />
          <h3 className="font-semibold text-slate-100">Spotify - Beast Mode</h3>
        </div>
        <div className="w-full rounded-2xl overflow-hidden border border-white/10">
          <iframe 
            style={{ borderRadius: '12px' }} 
            src="https://open.spotify.com/embed/playlist/37i9dQZF1DX76Wlfdnj7AP?utm_source=generator&theme=0" 
            width="100%" 
            height="352" 
            frameBorder="0" 
            allowFullScreen="" 
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
            loading="lazy">
          </iframe>
        </div>
      </div>

      <div className="glass-card p-5 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Play className="w-5 h-5 text-red-500" />
          <h3 className="font-semibold text-slate-100">YouTube - Gym Motivation</h3>
        </div>
        <div className="w-full rounded-2xl overflow-hidden border border-white/10 bg-black aspect-video relative">
          <iframe 
            width="100%" 
            height="100%" 
            src="https://www.youtube.com/embed/5y0xY_8fP-c" 
            title="YouTube video player" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            allowFullScreen
            className="absolute top-0 left-0"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
