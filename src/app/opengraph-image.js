import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'My Precious Collection';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Sparkle decorations */}
        <svg
          width="80"
          height="80"
          viewBox="0 0 32 32"
          style={{ position: 'absolute', top: 80, left: 150 }}
        >
          <path d="M16 2 L18 12 L28 14 L18 16 L16 26 L14 16 L4 14 L14 12 Z" fill="#a855f7" />
        </svg>
        <svg
          width="60"
          height="60"
          viewBox="0 0 32 32"
          style={{ position: 'absolute', top: 120, right: 200 }}
        >
          <path d="M16 2 L18 12 L28 14 L18 16 L16 26 L14 16 L4 14 L14 12 Z" fill="#ec4899" />
        </svg>
        <svg
          width="50"
          height="50"
          viewBox="0 0 32 32"
          style={{ position: 'absolute', bottom: 100, left: 250 }}
        >
          <path d="M16 2 L18 12 L28 14 L18 16 L16 26 L14 16 L4 14 L14 12 Z" fill="#ec4899" />
        </svg>
        <svg
          width="70"
          height="70"
          viewBox="0 0 32 32"
          style={{ position: 'absolute', bottom: 80, right: 180 }}
        >
          <path d="M16 2 L18 12 L28 14 L18 16 L16 26 L14 16 L4 14 L14 12 Z" fill="#a855f7" />
        </svg>

        {/* Main sparkle icon */}
        <svg width="120" height="120" viewBox="0 0 32 32" style={{ marginBottom: 30 }}>
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

        {/* Title */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
          }}
        >
          <span
            style={{
              fontSize: 72,
              fontWeight: 'bold',
              background: 'linear-gradient(90deg, #9333ea, #db2777, #9333ea)',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            My Precious Collection
          </span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 28,
            color: '#c4b5fd',
            marginTop: 20,
          }}
        >
          A beautiful showcase of treasured collectibles
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
