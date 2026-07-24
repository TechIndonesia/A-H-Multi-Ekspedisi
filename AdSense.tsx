import { useEffect } from 'react';

interface AdSenseProps {
  slot: string; // ID Slot Iklan dari dashboard AdSense Anda
}

export default function AdSense({ slot }: AdSenseProps) {
  useEffect(() => {
    try {
      // Memicu Google AdSense untuk memuat iklan di komponen ini
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, []);

  return (
    <div style={{ overflow: 'hidden', margin: '10px 0', textAlign: 'center' }}>
      <ins className="adsbygoogle"
           style={{ display: 'block' }}
           data-ad-client="ca-pub-8253993926061966" // ID Client Anda
           data-ad-slot={slot}                     // ID Slot Iklan
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
    </div>
  );
}
