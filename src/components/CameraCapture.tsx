import { useState, useRef, useCallback, useEffect } from "react";
import { Camera, X, RotateCcw, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CameraCaptureProps {
  open: boolean;
  onClose: () => void;
  onCapture: (imageData: string) => void;
}

const CameraCapture = ({ open, onClose, onCapture }: CameraCaptureProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsReady(false);
  }, []);

  const startCamera = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setIsReady(false);
    
    try {
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError("Camera not supported on this device/browser. Please upload a photo instead.");
        setIsLoading(false);
        return;
      }

      // Stop any existing stream first
      stopCamera();

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: "user",
          width: { ideal: 480 },
          height: { ideal: 480 }
        },
        audio: false
      });
      
      streamRef.current = mediaStream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        
        // Wait for video to actually start playing
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().then(() => {
            setIsReady(true);
            setIsLoading(false);
          }).catch((playErr) => {
            console.error("Play error:", playErr);
            setError("Could not start video. Please try again.");
            setIsLoading(false);
          });
        };

        videoRef.current.onerror = () => {
          setError("Video stream error. Please try again.");
          setIsLoading(false);
        };
      }
    } catch (err: any) {
      console.error("Camera error:", err);
      setIsLoading(false);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setError("Camera permission denied. Please allow camera access and try again.");
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setError("No camera found. Please use the file upload option.");
      } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
        setError("Camera is busy. Close other apps using the camera.");
      } else if (err.name === "OverconstrainedError") {
        setError("Camera resolution not supported. Try again.");
      } else {
        setError("Could not access camera. Please upload a photo instead.");
      }
    }
  }, [stopCamera]);

  // Start camera when dialog opens
  useEffect(() => {
    if (open) {
      startCamera();
    } else {
      stopCamera();
      setCapturedImage(null);
      setError(null);
      setIsLoading(true);
    }
    
    return () => {
      stopCamera();
    };
  }, [open, startCamera, stopCamera]);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current && isReady) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 480;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL("image/jpeg", 0.8);
        setCapturedImage(imageData);
        stopCamera();
      }
    }
  };

  const retake = () => {
    setCapturedImage(null);
    startCamera();
  };

  const confirmCapture = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      setCapturedImage(null);
      onClose();
    }
  };

  const handleClose = () => {
    stopCamera();
    setCapturedImage(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <Camera size={20} />
            Take a Selfie for Santa
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-4">
          {error ? (
            <div className="space-y-4">
              <div className="bg-destructive/10 text-destructive p-4 rounded-lg text-center">
                {error}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={startCamera} className="flex-1">
                  <RotateCcw size={18} />
                  Try Again
                </Button>
                <Button variant="outline" onClick={handleClose} className="flex-1">
                  <X size={18} />
                  Close
                </Button>
              </div>
            </div>
          ) : capturedImage ? (
            <div className="space-y-4">
              <div className="rounded-lg overflow-hidden border-2 border-border">
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="w-full aspect-square object-cover"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={retake}
                  className="flex-1"
                >
                  <RotateCcw size={18} />
                  Retake
                </Button>
                <Button
                  onClick={confirmCapture}
                  className="flex-1 bg-accent hover:bg-accent/90"
                >
                  <Check size={18} />
                  Use This
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg overflow-hidden border-2 border-border bg-muted aspect-square relative">
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted z-10">
                    <div className="text-center space-y-2">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                      <p className="text-sm text-muted-foreground">Starting camera...</p>
                    </div>
                  </div>
                )}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                  style={{ transform: "scaleX(-1)" }}
                />
              </div>
              <Button
                onClick={capturePhoto}
                disabled={!isReady}
                className="w-full bg-primary hover:bg-primary/90"
              >
                <Camera size={18} />
                {isReady ? "Capture Photo" : "Waiting for camera..."}
              </Button>
            </div>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CameraCapture;
