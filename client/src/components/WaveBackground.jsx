import { useEffect, useState } from 'react';
import { DitheringShader } from '@/components/ui/dithering-shader';

export default function WaveBackground() {
  const [size, setSize] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1280,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  }));

  useEffect(() => {
    const onResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <DitheringShader
        width={size.width}
        height={size.height}
        shape="wave"
        type="8x8"
        colorBack="#001122"
        colorFront="#ff0088"
        pxSize={3}
        speed={0.6}
        className="h-full w-full"
        style={{ width: '100%', height: '100%' }}
      />
      <div className="absolute inset-0 bg-[#0c0c0e]/55 backdrop-blur-[1px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#001122]/30 via-transparent to-[#0c0c0e]/80" />
    </div>
  );
}
