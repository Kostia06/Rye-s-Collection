import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 180,
  height: 180,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 40,
        }}
      >
        <svg width="140" height="140" viewBox="0 0 32 32">
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#9333ea' }} />
              <stop offset="50%" style={{ stopColor: '#db2777' }} />
              <stop offset="100%" style={{ stopColor: '#9333ea' }} />
            </linearGradient>
          </defs>
          <path d="M16 2 L18 12 L28 14 L18 16 L16 26 L14 16 L4 14 L14 12 Z" fill="url(#grad)" />
          <path d="M25 4 L26 7 L29 8 L26 9 L25 12 L24 9 L21 8 L24 7 Z" fill="#ec4899" />
          <path d="M7 20 L8 23 L11 24 L8 25 L7 28 L6 25 L3 24 L6 23 Z" fill="#a855f7" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
