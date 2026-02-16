
import { useState } from 'react'
import './App.css'
import { BarraPredi } from './Components/barraPredi'
import Camara from './Components/camara'
import { cargarDetector, type ResultadoPrediccion } from './Utils/predecir'
import { useEffect } from 'react'


function App() {
  const [predic, setPredic] = useState<ResultadoPrediccion | null>(null);

  useEffect(() => {
        (async () => {
            await cargarDetector();
        })();
    }, []);

  return (
    <>
      <div id = "elementosPrinc">
          <Camara onPredic={setPredic} />
          <BarraPredi predic={predic} />
      </div>
    </>

  )
} 

export default App


