import React from 'react';
import { View } from 'react-native';
import Svg, { Path, Text as SvgText } from 'react-native-svg';

import { Colors } from '@/constants/colors';

type Props = {
  percentage: number; // 0–100
  label: string;      // "K+ budget"
  sublabel?: string;  // "1,240 / 2,000 mg"
};

// SVG coordinate system: y increases downward.
// The gauge is a top semicircle from LEFT (cx−R, cy) to RIGHT (cx+R, cy) via TOP (cx, cy−R).
// Going counterclockwise in screen coords (sweep-flag=0) traces the top arc.
export function SemiCircleGauge({ percentage, label, sublabel }: Props) {
  const W = 220;
  const cy = 110; // arc center sits at bottom of viewport so we see only the top half
  const cx = W / 2;
  const R = 90;
  const trackWidth = 16;
  const pct = Math.max(0, Math.min(100, percentage));

  // Convert a math-convention angle (0°=right, 90°=up) to SVG x/y
  const toPoint = (angleDeg: number) => {
    const rad = (angleDeg * Math.PI) / 180;
    return { x: cx + R * Math.cos(rad), y: cy - R * Math.sin(rad) };
  };

  const left  = toPoint(180); // pct=0  endpoint
  const right = toPoint(0);   // pct=100 endpoint

  // Track is always the full 180° top arc (sweep=0 = counterclockwise in screen)
  const trackPath = `M ${left.x} ${left.y} A ${R} ${R} 0 0 0 ${right.x} ${right.y}`;

  // Value arc sweeps from LEFT toward RIGHT proportionally
  const valueAngleDeg = 180 - (pct / 100) * 180;
  const vp = toPoint(valueAngleDeg);
  const largeArc = pct > 50 ? 1 : 0;
  const valuePath = pct > 0
    ? `M ${left.x} ${left.y} A ${R} ${R} 0 ${largeArc} 0 ${vp.x} ${vp.y}`
    : null;

  // Color shifts to caution amber when ≥ 80% budget used
  const arcColor = pct >= 80 ? Colors.caution : Colors.brand;

  const viewH = cy + 8; // just below the diameter line

  return (
    <View className="items-center">
      <Svg width={W} height={viewH} viewBox={`0 0 ${W} ${viewH}`}>
        <Path
          d={trackPath}
          stroke={Colors.border}
          strokeWidth={trackWidth}
          fill="none"
          strokeLinecap="round"
        />
        {valuePath && (
          <Path
            d={valuePath}
            stroke={arcColor}
            strokeWidth={trackWidth}
            fill="none"
            strokeLinecap="round"
          />
        )}
        <SvgText
          x={cx}
          y={cy - 28}
          textAnchor="middle"
          fontSize="34"
          fontWeight="700"
          fill={Colors.primary}>
          {pct}%
        </SvgText>
        <SvgText
          x={cx}
          y={cy - 6}
          textAnchor="middle"
          fontSize="13"
          fill={Colors.tertiary}>
          {label}
        </SvgText>
        {sublabel && (
          <SvgText
            x={cx}
            y={cy + 10}
            textAnchor="middle"
            fontSize="11"
            fill={Colors.tertiary}>
            {sublabel}
          </SvgText>
        )}
      </Svg>
    </View>
  );
}
