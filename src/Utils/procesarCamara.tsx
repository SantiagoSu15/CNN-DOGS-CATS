export const getVideo =(videoRef:React.RefObject<HTMLVideoElement | null>) =>{

    navigator.mediaDevices.getUserMedia({video:{
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    }).then(stream =>{
        let v = videoRef.current;
        if (!v) return;
        v.srcObject = stream
        v.play();
    }).catch(err=>{
        console.error(err)
    })
}