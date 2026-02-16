import {useEffect, useRef, useState} from "react";
import { getVideo } from "../Utils/procesarCamara";
import { Canvas } from "./canvas";
import type { ResultadoPrediccion } from "../Utils/predecir";

type VideoProps = {
  onPredic: (value: ResultadoPrediccion) => void;
};

const Video = ({ onPredic }: VideoProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [ready, setReady] = useState(false);
    const [version,setVersion] = useState(0);

    useEffect(() => {
        if (videoRef.current) {
            getVideo(videoRef);
            setReady(true); 
            setVersion(v=>v+1)
          }
    }, []);
  
    return (
      <>
        <video ref={videoRef} />
        {ready && (
          <Canvas
            videoRef={videoRef.current}
            versionVideo={version}
            onPredic={onPredic}
          />
        )}
      </>
    );
  };
  


export default Video