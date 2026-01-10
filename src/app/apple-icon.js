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
          background: '#ffffff',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 40,
          border: '2px solid #e5e5e5',
        }}
      >
        {/* Stylized R letter */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: 100,
              fontWeight: 700,
              color: '#1a1a1a',
              lineHeight: 1,
            }}
          >
            R
          </span>
          {/* Decorative dot */}
          <div
            style={{
              position: 'absolute',
              top: 30,
              right: 40,
              width: 16,
              height: 16,
              borderRadius: '50%',
              background: '#1a1a1a',
            }}
          />
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
