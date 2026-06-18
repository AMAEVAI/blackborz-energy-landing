'use client';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface Brand {
  name: string;
  color: string;
  svg: string;
}

const BRANDS: Brand[] = [
  {
    name: 'Slack',
    color: '#4A154B',
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zm10.122 2.521a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zm-1.268 0a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zm-2.523 10.122a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zm0-1.268a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/></svg>`,
  },
  {
    name: 'Stripe',
    color: '#635BFF',
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/></svg>`,
  },
  {
    name: 'Medium',
    color: '#000000',
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/></svg>`,
  },
  {
    name: 'Mailchimp',
    color: '#FFE01B',
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.507 12.507c-.32-.227-.477-.583-.41-.917.017-.09.04-.177.07-.263.148-.422.044-.71-.112-.892a.827.827 0 00-.609-.279c-.322-.011-.65.13-.87.423-.09.12-.148.253-.164.387-.042.33-.243.617-.546.762-1.14.546-2.65.872-4.082.872-1.473 0-2.813-.287-3.833-.758-.43-.197-.7-.6-.7-1.071 0-.28.099-.523.245-.72a1.11 1.11 0 00.217-.685c0-.627-.508-1.135-1.135-1.135-.628 0-1.137.508-1.137 1.135 0 .257.087.493.23.68.15.196.234.441.234.706 0 .56-.38 1.035-.934 1.168a8.26 8.26 0 01-1.898.221c-.617 0-1.204-.07-1.691-.2-.38-.101-.637-.456-.605-.849.053-.643.32-1.261.734-1.762.07-.084.124-.18.16-.286.063-.188.055-.39-.023-.572a.874.874 0 00-.455-.481.882.882 0 00-.673.018c-.31.124-.595.338-.827.624-.56.695-.887 1.574-.887 2.523 0 2.166 1.76 3.922 3.929 3.922.52 0 1.018-.1 1.473-.278.457.81 1.354 1.358 2.378 1.358.912 0 1.722-.433 2.24-1.104.598.22 1.257.342 1.948.342.683 0 1.338-.12 1.929-.337.52.663 1.325 1.09 2.231 1.09 1.573 0 2.849-1.277 2.849-2.85a2.85 2.85 0 00-.479-1.596zm-.7 3.327c-.674 0-1.221-.547-1.221-1.22 0-.674.547-1.22 1.22-1.22.674 0 1.221.546 1.221 1.22 0 .673-.547 1.22-1.22 1.22zm-5.025.843c-.673 0-1.22-.547-1.22-1.22 0-.673.547-1.22 1.22-1.22s1.22.547 1.22 1.22c0 .673-.547 1.22-1.22 1.22zm-4.49 0c-.672 0-1.218-.547-1.218-1.22 0-.673.546-1.22 1.219-1.22.672 0 1.218.547 1.218 1.22 0 .673-.546 1.22-1.219 1.22z"/></svg>`,
  },
  {
    name: 'Netflix',
    color: '#E50914',
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5.398 0v.006c3.028 8.556 5.37 15.175 8.348 23.596 2.344.058 4.85.398 4.85.398C14.228 15.918 11.876 8.048 9.468 0H5.398zm5.338 0v9.5h.004l.005 14.044c1.412.078 2.85.219 4.212.426V0h-4.221zm-5.338 0L0 .01V24c1.758-.18 3.687-.298 4.985-.366V0H5.398z"/></svg>`,
  },
  {
    name: 'Google',
    color: '#4285F4',
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/></svg>`,
  },
  {
    name: 'LinkedIn',
    color: '#0A66C2',
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
  },
  {
    name: 'Microsoft',
    color: '#00A4EF',
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z"/></svg>`,
  },
  {
    name: 'Airbnb',
    color: '#FF5A5F',
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .001C5.925.001 1 4.927 1 11.001c0 6.075 4.925 11 11 11s11-4.925 11-11c0-6.074-4.925-11-11-11zM8.25 17.27c-.495 0-.9-.36-.99-.84L6 10.17l-.045-.27c0-.495.405-.9.9-.9s.9.36.99.84L9.15 15.9l.045.27c-.045.495-.45.9-.945.9zm5.445-6.12c.945 0 1.71.765 1.71 1.71s-.765 1.71-1.71 1.71-1.71-.765-1.71-1.71.765-1.71 1.71-1.71zm2.115 6.12c-.495 0-.9-.36-.99-.84L13.5 10.17l-.045-.27c0-.495.405-.9.9-.9s.9.36.99.84l1.26 6.06.045.27c-.045.495-.45.9-.9.9z"/></svg>`,
  },
  {
    name: 'Spotify',
    color: '#1DB954',
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>`,
  },
  {
    name: 'Facebook',
    color: '#1877F2',
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`,
  },
  {
    name: 'PayPal',
    color: '#00457C',
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z"/></svg>`,
  },
  {
    name: 'Reddit',
    color: '#FF4500',
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/></svg>`,
  },
  {
    name: 'LemonSqueezy',
    color: '#FFC233',
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>`,
  },
];

interface PixelCanvasProps {
  color: string;
  gap?: number;
  speed?: number;
  noFocus?: boolean;
}

function PixelCanvas({ color, gap = 5, speed = 35, noFocus = false }: PixelCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const pixelsRef = useRef<{ x: number; y: number; alpha: number; speed: number }[]>([]);
  const isAnimatingRef = useRef(false);

  function initPixels(canvas: HTMLCanvasElement) {
    const cols = Math.floor(canvas.width / gap);
    const rows = Math.floor(canvas.height / gap);
    pixelsRef.current = [];
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        pixelsRef.current.push({
          x: i * gap + gap / 2,
          y: j * gap + gap / 2,
          alpha: 0,
          speed: (Math.random() * 0.3 + 0.1) * (speed / 35),
        });
      }
    }
  }

  function drawPixels(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of pixelsRef.current) {
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = color;
      ctx.fillRect(p.x - 1, p.y - 1, 2, 2);
    }
    ctx.globalAlpha = 1;
  }

  function animate(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, direction: 'in' | 'out') {
    let done = false;
    for (const p of pixelsRef.current) {
      if (direction === 'in') {
        if (p.alpha < 1) { p.alpha = Math.min(1, p.alpha + p.speed); }
      } else {
        if (p.alpha > 0) { p.alpha = Math.max(0, p.alpha - p.speed); }
      }
    }
    done = pixelsRef.current.every((p) => direction === 'in' ? p.alpha >= 1 : p.alpha <= 0);
    drawPixels(canvas, ctx);
    if (!done) {
      rafRef.current = requestAnimationFrame(() => animate(canvas, ctx, direction));
    } else {
      isAnimatingRef.current = false;
    }
  }

  function handleEnter() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    cancelAnimationFrame(rafRef.current);
    isAnimatingRef.current = true;
    animate(canvas, ctx, 'in');
  }

  function handleLeave() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    cancelAnimationFrame(rafRef.current);
    isAnimatingRef.current = true;
    animate(canvas, ctx, 'out');
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const resizeObserver = new ResizeObserver(() => {
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
      initPixels(canvas);
      const ctx = canvas.getContext('2d');
      if (ctx) drawPixels(canvas, ctx);
    });

    resizeObserver.observe(parent);
    canvas.width = parent.offsetWidth;
    canvas.height = parent.offsetHeight;
    initPixels(canvas);

    if (!noFocus) {
      parent.addEventListener('mouseenter', handleEnter);
      parent.addEventListener('mouseleave', handleLeave);
    }

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(rafRef.current);
      if (!noFocus) {
        parent.removeEventListener('mouseenter', handleEnter);
        parent.removeEventListener('mouseleave', handleLeave);
      }
    };
  }, [color, gap, speed, noFocus]);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 w-full h-full" />;
}

interface LogoCardProps {
  brand: Brand;
}

function LogoCard({ brand }: LogoCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={cn(
        'relative flex items-center justify-center rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden',
        'bg-[#111] border-[#222]',
        hovered ? 'border-white/10 scale-105' : 'scale-100',
      )}
      style={{
        boxShadow: hovered ? `0 8px 32px ${brand.color}33, 0 0 0 1px ${brand.color}22` : undefined,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <PixelCanvas color={brand.color} gap={5} speed={35} />
      <div
        className={cn(
          'relative z-10 w-8 h-8 transition-all duration-300',
          hovered ? 'opacity-100' : 'opacity-30 grayscale',
        )}
        style={{ color: brand.color }}
        dangerouslySetInnerHTML={{ __html: brand.svg }}
      />
    </div>
  );
}

export function PixelLogoGrid({ className }: { className?: string }) {
  return (
    <div className={cn('w-full', className)}>
      <div className="text-center mb-5">
        <div className="text-xs text-[#555] font-medium uppercase tracking-widest mb-1">Trusted by</div>
        <div className="text-sm text-white/60 font-semibold">Our clients &amp; partners</div>
      </div>
      <div className="grid grid-cols-7 gap-2" style={{ gridAutoRows: '52px' }}>
        {BRANDS.map((brand) => (
          <LogoCard key={brand.name} brand={brand} />
        ))}
      </div>
    </div>
  );
}
