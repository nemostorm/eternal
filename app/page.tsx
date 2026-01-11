import Svg from './components/Svg';
import { Footer } from './components/Footer';

export default function Home() {
  return(
    <>
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 relative flex items-center justify-center overflow-hidden bg-black">
        <Svg />
      </main>
      <Footer />
    </div>
    </>
  )
  
}
