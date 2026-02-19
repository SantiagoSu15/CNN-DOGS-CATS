export const getVideo = async (videoRef: React.RefObject<HTMLVideoElement | null>) => {
    const v = videoRef.current;
    if (!v) return null;

    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: { ideal: 1280 },
                height: { ideal: 720 },
                facingMode: { ideal: "environment" }
            },
            audio: false
        });

        v.muted = true;
        v.autoplay = true;
        v.playsInline = true;
        v.setAttribute("playsinline", "true");
        v.setAttribute("webkit-playsinline", "true");
        v.srcObject = stream;

        await new Promise<void>((resolve) => {
            if (v.readyState >= 1) {
                resolve();
                return;
            }

            const onLoadedMetadata = () => {
                resolve();
            };

            v.addEventListener("loadedmetadata", onLoadedMetadata, { once: true });
        });

        await v.play();
        return stream;
    } catch (err) {
        console.error(err);
        return null;
    }
};