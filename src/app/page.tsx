import { Navbar } from './components/NavBar/Navbar';
import { Shop } from "./pages/Shop.jsx";
import {Product} from "./pages/Product";

export default function Home() {
  return (
    <div> 
      <Navbar/>
      <Shop/>
    </div>
  );
}
