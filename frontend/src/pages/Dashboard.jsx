import { Routes, Route } from 'react-router-dom';
import HomeTab from '../components/HomeTab';
import PlaylistTab from '../components/PlaylistTab';
import RecipeTab from '../components/RecipeTab';
import AccountTab from '../components/AccountTab';
import AITrainerTab from '../components/AITrainerTab';
import FoodCamTab from '../components/FoodCamTab';
import ProgressTab from '../components/ProgressTab';
import MuscleBookTab from '../components/MuscleBookTab';
import NavbarTop from '../components/NavbarTop';
import NavbarBottom from '../components/NavbarBottom';

export default function Dashboard() {
  return (
    <div className="flex-1 flex flex-col z-10 relative bg-transparent h-full">
      <NavbarTop />

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto pb-24 relative">
        <Routes>
          <Route path="/" element={<HomeTab />} />
          <Route path="/photo" element={<FoodCamTab />} />
          <Route path="/ai" element={<AITrainerTab />} />
          <Route path="/progress" element={<ProgressTab />} />
          <Route path="/playlist" element={<PlaylistTab />} />
          <Route path="/recipes" element={<RecipeTab />} />
          <Route path="/account" element={<AccountTab />} />
          <Route path="/musclebook" element={<MuscleBookTab />} />
        </Routes>
      </div>

      <NavbarBottom />
    </div>
  );
}
