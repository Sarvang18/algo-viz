import React, { useState, useRef, useEffect } from 'react';
import { toCanvas } from 'html-to-image';
import { Video, StopCircle, Download } from 'lucide-react';

interface VideoExporterProps {
  targetRef: React.RefObject<HTMLDivElement | null>;
}

export const VideoExporter: React.FC<VideoExporterProps> = ({ targetRef }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const isActiveRef = useRef<boolean>(false);
  const shouldDownloadRef = useRef(false);

  const isCancellationError = (error: unknown): boolean => {
    if (typeof error !== 'object' || error === null) return false;
    const candidate = error as { type?: unknown; message?: unknown; msg?: unknown };
    return candidate.type === 'cancelation'
      || candidate.message === 'operation is manually canceled'
      || (typeof candidate.msg === 'string' && candidate.msg.includes('canceled'));
  };

  const startRecording = () => {
    if (!targetRef.current) return;
    setErrorMessage(null);

    try {
      if (typeof MediaRecorder === 'undefined') throw new Error('Video recording is not supported by this browser.');
      const canvas = document.createElement('canvas');
      if (typeof canvas.captureStream !== 'function') throw new Error('Canvas recording is not supported by this browser.');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('The browser could not create a recording canvas.');
      setIsRecording(true);
      chunksRef.current = [];
      shouldDownloadRef.current = false;

      const rect = targetRef.current.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(rect.width));
      canvas.height = Math.max(1, Math.round(rect.height));

    // Use WebM codec with a fallback if vp9 isn't supported
      const options = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? { mimeType: 'video/webm;codecs=vp9' } 
        : { mimeType: 'video/webm' };
        
      const stream = canvas.captureStream(30);
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      mediaRecorder.onerror = () => {
        isActiveRef.current = false;
        setIsRecording(false);
        setIsProcessing(false);
        setErrorMessage('The browser stopped the recording unexpectedly.');
      };

      mediaRecorder.onstop = () => {
        if (shouldDownloadRef.current && chunksRef.current.length > 0) {
          const blob = new Blob(chunksRef.current, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          const anchor = document.createElement('a');
          anchor.href = url;
          anchor.download = 'algo-showcase.webm';
          anchor.click();
          window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
        }
        setIsProcessing(false);
      };

      mediaRecorder.start();
      isActiveRef.current = true;

      const captureFrame = async () => {
        if (!isActiveRef.current || !targetRef.current) return;
      
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

        } catch (error: unknown) {
        // Ignore html-to-image internal cancelation errors or overlapping errors
          if (isCancellationError(error)) {
           // silently ignore cancelations from rapidly changing dom elements
        } else {
            console.error('Frame capture error:', error);
        }
      }

        if (isActiveRef.current) {
        // Schedule next frame ONLY after this one completes to prevent overlapping overload
          window.setTimeout(captureFrame, 1000 / 15);
        }
      };

      void captureFrame();
    } catch (error: unknown) {
      isActiveRef.current = false;
      setIsRecording(false);
      setIsProcessing(false);
      setErrorMessage(error instanceof Error ? error.message : 'Video recording could not start.');
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsProcessing(true);
    isActiveRef.current = false;
    shouldDownloadRef.current = true;
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    } else {
      setIsProcessing(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isActiveRef.current = false;
      shouldDownloadRef.current = false;
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
      aria-label={isRecording ? 'Stop and download video recording' : 'Start video recording'}
      title={errorMessage ?? undefined}
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
      ) : errorMessage ? (
        <><Video size={16} className="text-red-400" /> Retry Export</>
      ) : (
        <><Video size={16} className="text-purple-400" /> Export to Video</>
      )}
    </button>
  );
};
