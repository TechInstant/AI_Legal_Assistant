import React, { useMemo, useState } from 'react';

/**
 * Renders a real cartographic world map as the page watermark. The default
 * source is a public-domain SVG hosted on Wikimedia Commons. If that fails
 * to load (offline, blocked, etc.), we transparently fall back to a local
 * SVG built from a hand-tuned land-mask grid so the page still has a
 * recognisable map.
 *
 * Override the URL with the `src` prop. Override the rendering mode of the
 * fallback with `variant`.
 */

const REMOTE_WORLD_MAP =
  'https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg';

interface WorldMapProps {
  className?: string;
  /** External SVG/PNG to use as the primary world map image. */
  src?: string;
  /** Used only if the remote image fails. */
  variant?: 'dots' | 'silhouette';
  /** Soft radial gradient toward the edges (silhouette/dots fallback only). */
  fade?: boolean;
}

export const WorldMap: React.FC<WorldMapProps> = ({
  className = '',
  src = REMOTE_WORLD_MAP,
  variant = 'silhouette',
  fade = true,
}) => {
  const [failed, setFailed] = useState(false);

  if (!failed) {
    return (
      <img
        src={src}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className={`select-none ${className}`}
        // grayscale removes any tint baked into the map; dark mode inverts so
        // light-grey continents read against the dark page; opacity is
        // controlled via the `className` from the consumer (e.g. opacity-10).
        style={{ filter: 'grayscale(1)' }}
      />
    );
  }

  // ----- Local fallback (only used if the remote image fails) -----
  return <FallbackMap className={className} variant={variant} fade={fade} />;
};

// =========================================================================
// Local fallback — the previous hand-tuned land mask, used only offline
// =========================================================================

const LAND_MASK = [
  '                                                                                ',
  '                       ##           #     ##  ##                                ',
  '            ###     ########       ##  ########### ##                          ',
  '         ##############       #################################                ',
  '       ##################   ###################################                ',
  '      ####################  ####################################               ',
  '       #####################  ##################################               ',
  '         ##################  ####################################              ',
  '           ##############   #####################################              ',
  '            ############    ##################################                 ',
  '             ##########    ###############################  ###                ',
  '              ########    ##########  ##################                       ',
  '                #####    #########       #############                         ',
  '                  ###  ##########         #############                        ',
  '                    # #########            ##########                          ',
  '                  ############              ##########                         ',
  '                  ###########                #########                         ',
  '                  ###########                 #######                          ',
  '                  ##########                   ######         #######          ',
  '                   #########                    ###          #########         ',
  '                   ########                     ##          ##########         ',
  '                    ######                                  #########          ',
  '                     #####                                    ####             ',
  '                      ###                                      ##              ',
  '                       #                                                       ',
  '                                                                                ',
  '                                                                                ',
  '       ##############################################################          ',
  '      ################################################################         ',
  '       ##############################################################          ',
  '         ##########################################################            ',
  '             ##################################################                ',
  '                                                                                ',
  '                                                                                ',
];

const COLS = 80;
const ROWS = LAND_MASK.length;
const CELL = 12;

interface Cell {
  x: number;
  y: number;
}

const computeCells = (): Cell[] => {
  const cells: Cell[] = [];
  for (let r = 0; r < ROWS; r++) {
    const row = LAND_MASK[r];
    for (let c = 0; c < COLS; c++) {
      if (row[c] === '#') cells.push({ x: c * CELL, y: r * CELL });
    }
  }
  return cells;
};

const FallbackMap: React.FC<{
  className: string;
  variant: 'dots' | 'silhouette';
  fade: boolean;
}> = ({ className, variant, fade }) => {
  const cells = useMemo(() => computeCells(), []);
  const w = COLS * CELL;
  const h = ROWS * CELL;
  const filterId = `wmBlur-${variant}`;
  const fadeId = `wmFade-${variant}`;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
      className={className}
    >
      <defs>
        {variant === 'silhouette' && (
          <filter id={filterId} x="-5%" y="-5%" width="110%" height="110%">
            <feGaussianBlur stdDeviation="8" />
          </filter>
        )}
        {fade && (
          <radialGradient id={fadeId} cx="50%" cy="50%" r="65%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.25" />
          </radialGradient>
        )}
      </defs>
      <g
        fill={fade ? `url(#${fadeId})` : 'currentColor'}
        filter={variant === 'silhouette' ? `url(#${filterId})` : undefined}
      >
        {variant === 'dots'
          ? cells.map((c, i) => (
              <circle key={i} cx={c.x + CELL / 2} cy={c.y + CELL / 2} r={1.7} />
            ))
          : cells.map((c, i) => (
              <rect
                key={i}
                x={c.x}
                y={c.y}
                width={CELL + 1}
                height={CELL + 1}
                rx={3}
              />
            ))}
      </g>
    </svg>
  );
};
