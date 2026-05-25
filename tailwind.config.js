/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontSize: {
        "window-title": [
                "13px",
                {
                        "lineHeight": "16px",
                        "letterSpacing": "-0.01em",
                        "fontWeight": "700"
                }
        ],
        "section-header": [
                "13px",
                {
                        "lineHeight": "20px",
                        "fontWeight": "700"
                }
        ],
        "headline-lg-mobile": [
                "17px",
                {
                        "lineHeight": "22px",
                        "fontWeight": "700"
                }
        ],
        "sidebar-item-active": [
                "13px",
                {
                        "lineHeight": "18px",
                        "fontWeight": "600"
                }
        ],
        "body-bold": [
                "13px",
                {
                        "lineHeight": "18px",
                        "fontWeight": "600"
                }
        ],
        "caption": [
                "11px",
                {
                        "lineHeight": "14px",
                        "fontWeight": "400"
                }
        ],
        "body": [
                "13px",
                {
                        "lineHeight": "18px",
                        "fontWeight": "400"
                }
        ],
        "headline-lg": [
                "19px",
                {
                        "lineHeight": "24px",
                        "fontWeight": "700"
                }
        ],
        "sidebar-item": [
                "13px",
                {
                        "lineHeight": "18px",
                        "fontWeight": "400"
                }
        ]
},
      spacing: {
        'gutter': '16px',
        'window-padding': '24px',
        'sidebar-width': '260px',
        'group-spacing': '32px',
        'item-gap': '8px',
        'control-inner-padding': '12px',
      },

      /* ── Typography ──────────────────────────────────────────── */
      fontFamily: {
        'window-title': ['Inter'],
        'section-header': ['Inter'],
        'headline-lg-mobile': ['Inter'],
        'sidebar-item-active': ['Inter'],
        'body-bold': ['Inter'],
        'caption': ['Inter'],
        'body': ['Inter'],
        'headline-lg': ['Inter'],
        'sidebar-item': ['Inter'],
        sans:  ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
        mono:  ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
      },

      /* ── Paper & Ink Colour Tokens ───────────────────────────── */
      colors: {
        'on-secondary-fixed': '#1a1b1f',
        'primary-fixed-dim': '#adc6ff',
        'on-tertiary-container': '#fdfcfd',
        'primary-fixed': '#d8e2ff',
        'on-surface-variant': '#414755',
        'secondary-fixed': '#e3e2e7',
        'inverse-on-surface': '#f0f1f1',
        'inverse-surface': '#2f3131',
        'on-primary-container': '#fefcff',
        'surface-container-low': '#f3f3f4',
        'background': '#f9f9f9',
        'tertiary-fixed': '#e2e2e3',
        'on-primary-fixed': '#001a41',
        'on-secondary': '#ffffff',
        'on-primary': '#ffffff',
        'secondary-container': '#e0dfe4',
        'on-surface': '#1a1c1c',
        'inverse-primary': '#adc6ff',
        'on-primary-fixed-variant': '#004493',
        'on-tertiary': '#ffffff',
        'surface-tint': '#005bc1',
        'on-secondary-fixed-variant': '#46464b',
        'surface': '#f9f9f9',
        'surface-container-highest': '#e2e2e2',
        'outline-variant': '#c1c6d7',
        'error': '#ba1a1a',
        'on-tertiary-fixed': '#1a1c1d',
        'on-secondary-container': '#626267',
        'tertiary-container': '#737576',
        'secondary': '#5d5e63',
        'surface-container-high': '#e8e8e8',
        'surface-dim': '#dadada',
        'on-error-container': '#93000a',
        'error-container': '#ffdad6',
        'on-error': '#ffffff',
        'on-tertiary-fixed-variant': '#454748',
        'surface-container': '#eeeeee',
        'on-background': '#1a1c1c',
        'surface-variant': '#e2e2e2',
        'tertiary-fixed-dim': '#c6c6c7',
        'surface-bright': '#f9f9f9',
        'tertiary': '#5b5c5d',
        'secondary-fixed-dim': '#c6c6cb',
        'primary': '#0058bc',
        'outline': '#717786',
        'surface-container-lowest': '#ffffff',
        'primary-container': '#0070eb',
        paper:          'var(--bg-paper)',
        'paper-2':      'var(--bg-paper-2)',
        'paper-3':      'var(--bg-paper-3)',
        ink:            'var(--ink)',
        'ink-2':        'var(--ink-2)',
        'ink-3':        'var(--ink-3)',
        'ink-4':        'var(--ink-4)',
        rule:           'var(--rule)',
        'rule-strong':  'var(--rule-strong)',
        primary:        'var(--primary)',
        'primary-hover':'var(--primary-hover)',
        'primary-soft': 'var(--primary-soft)',
        success:        'var(--success)',
        error:          'var(--error)',
        warning:        'var(--warning)',
        info:           'var(--info)',

        /* macOS chrome */
        'win-bg':       'var(--win-bg)',
        'win-sidebar':  'var(--win-sidebar-bg)',
        'win-titlebar': 'var(--win-titlebar-bg)',
        'win-border':   'var(--win-border)',
        'menubar-bg':   'var(--menubar-bg)',
        'dock-bg':      'var(--dock-bg)',
        'sidebar-bg':   'var(--sidebar-bg)',

        /* Traffic lights */
        'traffic-close':   'var(--traffic-close)',
        'traffic-min':     'var(--traffic-min)',
        'traffic-max':     'var(--traffic-max)',
        'traffic-inactive':'var(--traffic-inactive)',
      },

      /* ── Backdrop Blur — macOS depth levels ──────────────────── */
      backdropBlur: {
        'xs':         'var(--blur-xs)',      /* 2px  */
        'mac-sm':     'var(--blur-sm)',      /* 8px  */
        'mac-md':     'var(--blur-md)',      /* 16px dropdown */
        'mac-dock':   'var(--blur-dock)',    /* 20px dock */
        'mac-menu':   'var(--blur-menu)',    /* 28px menu bar */
        'mac-window': 'var(--blur-window)', /* 40px window vibrancy */
        'mac-frosted':'var(--blur-frosted)',/* 60px heavy glass */
      },

      /* ── Box Shadows ─────────────────────────────────────────── */
      boxShadow: {
        'win':        'var(--win-shadow)',
        'win-focus':  'var(--win-shadow-focus)',
        'dock':       'var(--dock-shadow)',
        'mac-sm':     '0 2px 8px rgba(0,0,0,0.14)',
        'mac-md':     '0 8px 24px rgba(0,0,0,0.20)',
        'mac-lg':     '0 22px 70px rgba(0,0,0,0.40), 0 8px 24px rgba(0,0,0,0.26)',
        'mac-xl':     '0 28px 80px rgba(0,0,0,0.52), 0 10px 30px rgba(0,0,0,0.30)',
      },

      /* ── Border Radius ───────────────────────────────────────── */
      borderRadius: {
        'DEFAULT': '0.25rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        'full': '9999px',
        'mac':    'var(--win-radius)',      /* 10px windows */
        'mac-lg': 'var(--win-radius-lg)',   /* 14px larger dialogs */
        'dock':   '18px',
      },

      /* ── Spacing / Heights ───────────────────────────────────── */
      height: {
        'menubar':    'var(--menubar-h)',   /* 28px */
        'titlebar':   'var(--win-titlebar-h)',
      },
      width: {
        'sidebar':    'var(--sidebar-w)',   /* 200px */
      },
      minWidth: {
        'sidebar':    'var(--sidebar-w)',
      },

      /* ── Z-Index Layers ──────────────────────────────────────── */
      zIndex: {
        'desktop':   'var(--z-desktop)',
        'windows':   'var(--z-windows)',
        'tweaks':    'var(--z-tweaks)',
        'dock':      'var(--z-dock)',
        'menubar':   'var(--z-menubar)',
        'modal':     'var(--z-modal)',
        'tooltip':   'var(--z-tooltip)',
      },

      /* ── Transitions ─────────────────────────────────────────── */
      transitionTimingFunction: {
        'calm':   'var(--ease-calm)',
        'spring': 'var(--ease-spring)',
        'mac-out':'var(--ease-out)',
      },
      transitionDuration: {
        'fast': 'var(--dur-fast)',   /* 150ms */
        'base': 'var(--dur-base)',   /* 240ms */
        'slow': 'var(--dur-slow)',   /* 400ms */
      },

      /* ── Keyframe Animations ─────────────────────────────────── */
      animation: {
        'fade-in':     'fadeIn  0.24s var(--ease-calm) forwards',
        'slide-up':    'slideUp 0.30s var(--ease-calm) forwards',
        'slide-down':  'slideDown 0.30s var(--ease-calm) forwards',
        'scale-in':    'scaleIn 0.20s var(--ease-spring) forwards',
        'dock-bounce': 'dockBounce 0.5s var(--ease-spring)',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        slideDown: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.85)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        dockBounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '40%':      { transform: 'translateY(-12px)' },
          '70%':      { transform: 'translateY(-4px)' },
        },
      },
    },
  },
  plugins: [],
}
