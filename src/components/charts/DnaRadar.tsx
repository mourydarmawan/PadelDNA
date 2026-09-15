interface RadarPoint {
  label: string;
  value: number; // 0-10
}

interface DnaRadarProps {
  points: RadarPoint[];
  size?: number;
  className?: string;
  /** Show the numeric value next to each label. */
  showValues?: boolean;
}

const MAX_VALUE = 10;
const RINGS = [2, 4, 6, 8, 10];

function polar(cx: number, cy: number, radius: number, angleDeg: number) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(angleRad),
    y: cy + radius * Math.sin(angleRad),
  };
}

export function DnaRadar({ points, size = 360, showValues = true, className }: DnaRadarProps) {
  const cx = size / 2;
  const cy = size / 2;
  const maxRadius = size * 0.34;
  const step = 360 / points.length;

  const ringPolygons = RINGS.map((ring) => {
    const r = (ring / MAX_VALUE) * maxRadius;
    return points.map((_, i) => polar(cx, cy, r, i * step)).map((p) => `${p.x},${p.y}`).join(' ');
  });

  const dataPolygon = points
    .map((p, i) => polar(cx, cy, (Math.max(p.value, 0) / MAX_VALUE) * maxRadius, i * step))
    .map((p) => `${p.x},${p.y}`)
    .join(' ');

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      role="img"
      aria-label={`DNA radar: ${points.map((p) => `${p.label} ${p.value.toFixed(1)}`).join(', ')}`}
    >
      {/* background rings — structural, mark the 2/4/6/8/10 scale */}
      {ringPolygons.map((poly, i) => (
        <polygon
          key={i}
          points={poly}
          fill="none"
          stroke="var(--color-ink-600)"
          strokeWidth={i === ringPolygons.length - 1 ? 1.5 : 1}
        />
      ))}

      {/* axis spokes */}
      {points.map((_, i) => {
        const p = polar(cx, cy, maxRadius, i * step);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={p.x}
            y2={p.y}
            stroke="var(--color-ink-600)"
            strokeWidth={1}
          />
        );
      })}

      {/* data shape */}
      <polygon
        points={dataPolygon}
        fill="var(--color-court-500)"
        fillOpacity={0.28}
        stroke="var(--color-court-400)"
        strokeWidth={2}
        strokeLinejoin="round"
      />

      {/* vertex markers */}
      {points.map((p, i) => {
        const vertex = polar(cx, cy, (Math.max(p.value, 0) / MAX_VALUE) * maxRadius, i * step);
        return <circle key={i} cx={vertex.x} cy={vertex.y} r={3.5} fill="var(--color-ball-500)" />;
      })}

      {/* labels */}
      {points.map((p, i) => {
        const labelPos = polar(cx, cy, maxRadius + 30, i * step);
        const anchor = labelPos.x < cx - 4 ? 'end' : labelPos.x > cx + 4 ? 'start' : 'middle';
        return (
          <text
            key={i}
            x={labelPos.x}
            y={labelPos.y}
            textAnchor={anchor}
            dominantBaseline="middle"
            className="font-display"
            fill="var(--color-mist-100)"
            fontSize={14}
            letterSpacing="0.02em"
          >
            {p.label}
            {showValues ? ` ${p.value.toFixed(1)}` : ''}
          </text>
        );
      })}
    </svg>
  );
}
