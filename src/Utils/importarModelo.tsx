import * as tf from '@tensorflow/tfjs';
import { useEffect, useState } from 'react';

export const useImportarModeloCNN = () => {
  const [modelo, setModelo] = useState<tf.LayersModel | null>(null);

  useEffect(() => {
    (async () => {
      console.log('cargando modelo...');
      const m = await tf.loadLayersModel('/CNN-37-Perros-Gatos-tfjs/model.json');
      setModelo(m);
      console.log('modelo cargado');
    })();
  }, []);

  return modelo;
}