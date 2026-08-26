import { Search, Flame, Clock } from 'lucide-react';

export default function RecipeTab() {
  const recipes = [
    {
      title: 'Oatmeal Blueberry High Protein',
      calories: 350,
      time: '10 Min',
      image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=400&q=80',
    },
    {
      title: 'Grilled Chicken Dada & Brokoli',
      calories: 450,
      time: '25 Min',
      image: 'https://images.unsplash.com/photo-1532550907401-4aa2c7fb383c?auto=format&fit=crop&w=400&q=80',
    },
    {
      title: 'Smoothie Pisang Protein',
      calories: 280,
      time: '5 Min',
      image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=400&q=80',
    }
  ];

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Buku Menu Diet</h2>
        <p className="text-slate-400 text-sm">Resep sehat yang disesuaikan dengan kebutuhan makro kamu.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input 
          type="text" 
          placeholder="Cari resep sehat..." 
          className="w-full bg-white/5 border border-white/20 rounded-2xl pl-12 pr-4 py-3.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-400/50 backdrop-blur-sm"
        />
      </div>

      <div className="flex flex-col gap-4">
        {recipes.map((recipe, idx) => (
          <div key={idx} className="glass-card flex overflow-hidden border border-white/10 hover:border-brand-400/50 transition-colors">
            <div className="w-28 h-28 flex-shrink-0">
              <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-3 flex flex-col justify-center flex-1">
              <h3 className="text-sm font-semibold text-slate-100 mb-2 line-clamp-2">{recipe.title}</h3>
              <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                <div className="flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-brand-400" />
                  <span>{recipe.calories} kkal</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{recipe.time}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
