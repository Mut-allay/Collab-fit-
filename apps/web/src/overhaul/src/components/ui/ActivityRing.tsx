interface RingSpec {
  ratio: number;
  colorClassName: string;
}

interface ActivityRingGroupProps {
  size?: number;
  strokeWidth?: number;
  gap?: number;
  rings: RingSpec[];
}

/** Concentric ring cluster, Apple-Fitness-style. Outer ring is rings[0]. */
export function ActivityRingGroup({
  size = 176,
  strokeWidth = 14,
  gap = 6,
  rings,
}: ActivityRingGroupProps) {
  const center = size / 2;

  return (
    <svg width={size} height={size} className="-rotate-90">
      {rings.map((ring, i) => {
        const radius = center - strokeWidth / 2 - i * (strokeWidth + gap);
        const circumference = 2 * Math.PI * radius;
        return (
          <g key={i}>
            <circle
              className="text-surface-container-lowest"
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke="currentColor"
              strokeWidth={strokeWidth}
            />
            <circle
              className={ring.colorClassName}
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={circumference - circumference * Math.min(1, ring.ratio)}
              strokeLinecap="round"
            />
          </g>
        );
      })}
    </svg>
  );
}
