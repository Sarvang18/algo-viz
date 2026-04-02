import React, { useState, useRef, useEffect } from 'react';
import { toCanvas } from 'html-to-image';
import { Video, StopCircle, Download } from 'lucide-react';

interface VideoExporterProps {
  targetRef: React.RefObject<HTMLDivElement | null>;
}

export const VideoExporter: React.FC<VideoExporterProps> = ({ targetRef }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const isActiveRef = useRef<boolean>(false);

  const startRecording = async () => {
    if (!targetRef.current) return;
    setIsRecording(true);
    chunksRef.current = [];

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    const rect = targetRef.current.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Use WebM codec with a fallback if vp9 isn't supported
    const options = MediaRecorder.isTypeSupported('video/webm;codecs=vp9') 
        ? { mimeType: 'video/webm;codecs=vp9' } 
        : { mimeType: 'video/webm' };
        
    const stream = canvas.captureStream(30);
    const mediaRecorder = new MediaRecorder(stream, options);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'algo-showcase.webm';
      a.click();
      URL.revokeObjectURL(url);
      setIsProcessing(false);
    };

    mediaRecorder.start();
    isActiveRef.current = true;

    const captureFrame = async () => {
      if (!isActiveRef.current || !targetRef.current || !ctx) return;
      
      try {
        const tempCanvas = await toCanvas(targetRef.current, { 
           backgroundColor: '#0a0a0f',
           pixelRatio: 1, // Keep high performance
           skipFonts: true, // Fixes CORS CSSRules SecurityError
           filter: (node) => {
             // Avoid rendering the exporter button inside the video itself if we place it inside the wrapper
             if (node instanceof HTMLElement && node.dataset.ignoreExport === 'true') {
               return false;
             }
             return true;
           }
        });
        
        if (!isActiveRef.current) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(tempCanvas, 0, 0);

        // Watermark
        ctx.font = 'bold 18px Inter, sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.fillText('⚡ algo-viz.vercel.app', canvas.width - 200, canvas.height - 20);

      } catch (err: any) {
        // Ignore html-to-image internal cancelation errors or overlapping errors
        if (err?.type === 'cancelation' || err?.message === 'operation is manually canceled' || err?.msg?.includes('canceled')) {
           // silently ignore cancelations from rapidly changing dom elements
        } else {
           console.error("Frame capture error:", err);
        }
      }

      if (isActiveRef.current) {
        // Schedule next frame ONLY after this one completes to prevent overlapping overload
        setTimeout(captureFrame, 1000 / 15);
      }
    };

    captureFrame();
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsProcessing(true);
    isActiveRef.current = false;
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isActiveRef.current = false;
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  return (
    <button
      data-ignore-export="true"
      onClick={isRecording ? stopRecording : startRecording}
      disabled={isProcessing}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold tracking-wide uppercase transition-all border shadow-lg backdrop-blur-md cursor-pointer ${
        isRecording 
          ? 'bg-red-500/20 text-red-400 border-red-500/50 hover:bg-red-500/30' 
          : isProcessing
          ? 'bg-blue-500/20 text-blue-400 border-blue-500/50'
          : 'bg-white/5 border-white/10 hover:border-white/30 text-gray-300 hover:text-white hover:bg-white/10'
      }`}
    >
      {isRecording ? (
        <><StopCircle size={16} className="animate-pulse" /> Stop Recording</>
      ) : isProcessing ? (
        <><Download size={16} className="animate-bounce" /> Processing...</>
      ) : (
        <><Video size={16} className="text-purple-400" /> Export to Video</>
      )}
    </button>
  );
};
