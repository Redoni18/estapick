import type { SVGProps } from 'react';

export function EstapickLogo({
  className,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 120.47 19.2"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Estapick"
      role="img"
      className={className}
      {...props}
    >
      <defs>
        <linearGradient
          id="estapick-logo-gradient-b"
          x1="93.582"
          x2="114.577"
          y1="16.629"
          y2="-0.51"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#305DFF" />
          <stop offset="1" stopColor="#10C4AB" />
        </linearGradient>
        <linearGradient
          id="estapick-logo-gradient-c"
          x1="100.727"
          x2="121.722"
          y1="25.382"
          y2="8.244"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#305DFF" />
          <stop offset="1" stopColor="#10C4AB" />
        </linearGradient>
        <linearGradient
          id="estapick-logo-gradient-d"
          x1="102.925"
          x2="123.921"
          y1="28.075"
          y2="10.936"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#305DFF" />
          <stop offset="1" stopColor="#10C4AB" />
        </linearGradient>
        <clipPath id="estapick-logo-clip">
          <path fill="currentColor" d="M.082 0h120.47v19.2H.081z" />
        </clipPath>
      </defs>
      <g clipPath="url(#estapick-logo-clip)">
        <path
          fill="url(#estapick-logo-gradient-b)"
          d="M107.14 7.3 103.563 0H92.835l-4.47 9.127 4.47 9.126h8.046l-1.788-3.65h-3.576l-2.682-5.476 2.682-5.477h5.364l1.789 3.65h-7.153l1.788 3.653h23.246V7.3z"
        />
        <path
          fill="url(#estapick-logo-gradient-c)"
          d="M115.186 12.777h-3.576v3.65h3.576z"
        />
        <path
          fill="url(#estapick-logo-gradient-d)"
          d="M120.551 12.777h-3.576v3.65h3.576z"
        />
        <path
          fill="currentColor"
          d="M.082 15.544h10.991v-3.643H3.655V9.593h5.13V5.951h-5.13v-2.31h7.439V0H.082zM27.145 10.064v-2.78h1.776V3.638h-1.776V0h-3.57v3.64H21.8v3.645h1.768v3.46q0 4.8 4.227 4.8h1.968v-3.627h-1.177q-1.443 0-1.444-1.853zM69.521 7.281c.772 0 1.452.393 1.862.992l2.537-2.59A5.77 5.77 0 0 0 69.52 3.64c-3.224 0-5.838 2.669-5.838 5.96s2.614 5.96 5.838 5.96a5.77 5.77 0 0 0 4.398-2.045l-2.536-2.59c-.41.6-1.092.992-1.862.992-1.253 0-2.27-1.037-2.27-2.317s1.015-2.318 2.27-2.318M62.195 3.642h-3.573v11.916h3.573zM39.505 4.438a5.7 5.7 0 0 0-2.916-.797c-3.224 0-5.838 2.668-5.838 5.959s2.614 5.96 5.838 5.96a5.7 5.7 0 0 0 2.916-.798v.796h3.573V3.642h-3.573zm-2.593 7.81c-1.433 0-2.593-1.185-2.593-2.648 0-1.462 1.16-2.647 2.593-2.647 1.432 0 2.593 1.185 2.593 2.647 0 1.463-1.16 2.647-2.593 2.647M51.297 3.64a5.7 5.7 0 0 0-2.916.798v-.796h-3.574V19.2h3.573v-4.438a5.7 5.7 0 0 0 2.917.797c3.224 0 5.838-2.668 5.838-5.959s-2.614-5.96-5.838-5.96m-.325 8.606c-1.43 0-2.592-1.185-2.592-2.646s1.161-2.646 2.592-2.646S53.564 8.14 53.564 9.6s-1.16 2.646-2.592 2.646M82.7 9.127l2.68-5.488h-3.562l-2.675 5.482V0H75.57v15.558h3.573V9.134l3.136 6.424h3.56zM17.27 8.242c-.523-.11-.598-.945.164-.945h2.67V3.639h-2.572c-3.17 0-4.761 1.162-4.702 3.686.036 1.57.621 3.13 3.78 3.626.536.085.555.951-.21.951h-3.628v3.642h3.433c4.394 0 4.887-2.406 4.887-3.543 0-1.319-.566-3.07-3.822-3.758z"
        />
      </g>
    </svg>
  );
}
