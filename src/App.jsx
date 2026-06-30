import { Routes, Route } from "react-router-dom";
import CharacterSheet from "./CharacterSheet";
import MasterPanel from "./DMPannel";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<CharacterSheet />} />
      <Route path="/mestre" element={<MasterPanel />} />
    </Routes>
  );
}