import React from 'react';

interface OfficialLbhAnsorLogoProps {
  className?: string;
  color?: string; // Default white
}

export const OfficialLbhAnsorLogo: React.FC<OfficialLbhAnsorLogoProps> = ({ 
  className = "w-48 h-52", 
  color = "#ffffff" 
}) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 600 660" 
      className={className}
      fill="none"
      role="img"
      aria-label="Logo Resmi LBH Ansor Provinsi Banten"
    >
      {/* Shield Outer Border */}
      <path 
        d="M 120 70 L 480 70 L 480 170 Q 480 370 300 550 Q 120 370 120 170 Z" 
        stroke={color} 
        strokeWidth="12" 
        strokeLinejoin="round" 
        strokeLinecap="round"
      />

      {/* Top Center Triangle (Ansor Crest) */}
      <polygon 
        points="300,105 175,345 425,345" 
        stroke={color} 
        strokeWidth="10" 
        strokeLinejoin="round" 
      />

      {/* Radiant Light Rays above Triangle Apex */}
      <line x1="300" y1="100" x2="300" y2="72" stroke={color} strokeWidth="4" strokeLinecap="round" />
      <line x1="288" y1="104" x2="278" y2="78" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <line x1="312" y1="104" x2="322" y2="78" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <line x1="278" y1="110" x2="260" y2="88" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <line x1="322" y1="110" x2="340" y2="88" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <line x1="268" y1="118" x2="245" y2="102" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="332" y1="118" x2="355" y2="102" stroke={color} strokeWidth="2.5" strokeLinecap="round" />

      {/* Center Star inside Crescent at (300, 162) */}
      <polygon 
        points="300,147 305,160 318,160 307,169 311,182 300,174 289,182 293,169 282,160 295,160" 
        fill={color} 
      />

      {/* Crescent Moon */}
      <path 
        d="M 268 180 A 34 34 0 0 0 332 180 A 30 26 0 0 1 268 180 Z" 
        fill={color} 
      />

      {/* 8 Surrounding Stars in an Arc (Ansor 9 Stars Total) */}
      <polygon points="258,190 261,197 268,197 262,202 264,208 258,204 252,208 254,202 248,197 255,197" fill={color} />
      <polygon points="274,212 277,218 284,218 279,222 281,228 274,225 268,228 270,222 265,218 271,218" fill={color} />
      <polygon points="293,222 295,227 300,227 296,230 298,235 293,232 288,235 290,230 286,227 291,227" fill={color} />
      <polygon points="307,222 309,227 314,227 310,230 312,235 307,232 302,235 304,230 300,227 305,227" fill={color} />
      <polygon points="326,212 329,218 336,218 331,222 333,228 326,225 320,228 322,222 317,218 323,218" fill={color} />
      <polygon points="342,190 345,197 352,197 346,202 348,208 342,204 336,208 338,202 332,197 339,197" fill={color} />
      <polygon points="262,162 264,167 269,167 265,170 267,175 262,172 257,175 259,170 255,167 260,167" fill={color} />
      <polygon points="338,162 340,167 345,167 341,170 343,175 338,172 333,175 335,170 331,167 336,167" fill={color} />

      {/* ANSOR Ribbon / Text Box */}
      <rect x="180" y="260" width="240" height="78" fill={color} rx="4" />
      <text 
        x="300" 
        y="323" 
        textAnchor="middle" 
        fill="#042f1f" 
        style={{
          fontFamily: "'Plus Jakarta Sans', Arial, sans-serif",
          fontWeight: 900,
          fontSize: '60px',
          letterSpacing: '2px'
        }}
      >
        ANSOR
      </text>

      {/* Ornate Scales of Justice Crossbeam & Curls */}
      <path 
        d="M 230 200 C 170 190 110 180 80 230 C 65 255 90 270 105 255 C 115 240 105 220 90 220 C 130 205 185 200 230 200" 
        fill={color} 
      />
      <path 
        d="M 370 200 C 430 190 490 180 520 230 C 535 255 510 270 495 255 C 485 240 495 220 510 220 C 470 205 415 200 370 200" 
        fill={color} 
      />

      {/* Left Scale Chains & Dish */}
      <line x1="88" y1="240" x2="20" y2="415" stroke={color} strokeWidth="5" />
      <line x1="88" y1="240" x2="156" y2="415" stroke={color} strokeWidth="5" />
      <path d="M 12 415 L 164 415 C 164 470 12 470 12 415 Z" fill={color} />

      {/* Right Scale Chains & Dish */}
      <line x1="512" y1="240" x2="444" y2="415" stroke={color} strokeWidth="5" />
      <line x1="512" y1="240" x2="580" y2="415" stroke={color} strokeWidth="5" />
      <path d="M 436 415 L 588 415 C 588 470 436 470 436 415 Z" fill={color} />

      {/* Lower Shield Text */}
      <text 
        x="300" 
        y="395" 
        textAnchor="middle" 
        fill={color} 
        style={{
          fontFamily: "'Plus Jakarta Sans', Arial, sans-serif",
          fontWeight: 800,
          fontSize: '28px',
          letterSpacing: '2.5px'
        }}
      >
        LEMBAGA
      </text>
      <text 
        x="300" 
        y="435" 
        textAnchor="middle" 
        fill={color} 
        style={{
          fontFamily: "'Plus Jakarta Sans', Arial, sans-serif",
          fontWeight: 800,
          fontSize: '28px',
          letterSpacing: '2.5px'
        }}
      >
        BANTUAN
      </text>
      <text 
        x="300" 
        y="475" 
        textAnchor="middle" 
        fill={color} 
        style={{
          fontFamily: "'Plus Jakarta Sans', Arial, sans-serif",
          fontWeight: 800,
          fontSize: '28px',
          letterSpacing: '2.5px'
        }}
      >
        HUKUM
      </text>

      {/* Bottom Arch / Swoosh inside Shield */}
      <path 
        d="M 170 475 Q 300 595 430 475 Q 300 550 170 475 Z" 
        fill={color} 
      />

      {/* Bottom Text outside Shield: PROVINSI BANTEN */}
      <text 
        x="300" 
        y="615" 
        textAnchor="middle" 
        fill={color} 
        style={{
          fontFamily: "'Plus Jakarta Sans', Arial, sans-serif",
          fontWeight: 900,
          fontSize: '30px',
          letterSpacing: '3px'
        }}
      >
        PROVINSI BANTEN
      </text>
    </svg>
  );
};
