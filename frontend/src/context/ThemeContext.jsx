import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');
  const [accentColor, setAccentColor] = useState('blue');
  const [fontSize, setFontSize] = useState('medium');
  const [animations, setAnimations] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [loading, setLoading] = useState(true);

  // Available themes
  const themes = {
    dark: {
      name: 'Dark',
      primary: '#0a0a0a',
      secondary: '#1a1a1a',
      tertiary: '#2d2d2d',
      text: '#ffffff',
      textSecondary: '#cccccc',
      textMuted: '#888888',
      border: '#333333',
      accent: '#1a73e8',
      success: '#4caf50',
      danger: '#f44336',
      warning: '#ff9800',
      info: '#2196f3'
    },
    light: {
      name: 'Light',
      primary: '#ffffff',
      secondary: '#f5f5f5',
      tertiary: '#e0e0e0',
      text: '#333333',
      textSecondary: '#666666',
      textMuted: '#999999',
      border: '#dddddd',
      accent: '#1a73e8',
      success: '#4caf50',
      danger: '#f44336',
      warning: '#ff9800',
      info: '#2196f3'
    },
    midnight: {
      name: 'Midnight',
      primary: '#000000',
      secondary: '#111111',
      tertiary: '#222222',
      text: '#ffffff',
      textSecondary: '#cccccc',
      textMuted: '#777777',
      border: '#444444',
      accent: '#00d4ff',
      success: '#00ff88',
      danger: '#ff4444',
      warning: '#ffaa00',
      info: '#4488ff'
    },
    professional: {
      name: 'Professional',
      primary: '#fafafa',
      secondary: '#ffffff',
      tertiary: '#f0f0f0',
      text: '#1a1a1a',
      textSecondary: '#444444',
      textMuted: '#888888',
      border: '#e0e0e0',
      accent: '#0066cc',
      success: '#2e7d32',
      danger: '#d32f2f',
      warning: '#f57c00',
      info: '#1976d2'
    }
  };

  // Available accent colors
  const accentColors = {
    blue: { name: 'Blue', color: '#1a73e8' },
    green: { name: 'Green', color: '#4caf50' },
    purple: { name: 'Purple', color: '#9c27b0' },
    orange: { name: 'Orange', color: '#ff9800' },
    red: { name: 'Red', color: '#f44336' },
    teal: { name: 'Teal', color: '#009688' },
    pink: { name: 'Pink', color: '#e91e63' },
    indigo: { name: 'Indigo', color: '#3f51b5' }
  };

  // Font sizes
  const fontSizes = {
    small: { name: 'Small', scale: 0.875 },
    medium: { name: 'Medium', scale: 1 },
    large: { name: 'Large', scale: 1.125 },
    extra: { name: 'Extra Large', scale: 1.25 }
  };

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const initTheme = () => {
      try {
        // Load saved preferences
        const savedTheme = localStorage.getItem('stockforge_theme');
        const savedAccent = localStorage.getItem('stockforge_accent');
        const savedFontSize = localStorage.getItem('stockforge_fontsize');
        const savedAnimations = localStorage.getItem('stockforge_animations');
        const savedHighContrast = localStorage.getItem('stockforge_highcontrast');

        // Apply saved theme or detect system preference
        if (savedTheme && themes[savedTheme]) {
          setTheme(savedTheme);
        } else {
          // Detect system preference
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          setTheme(prefersDark ? 'dark' : 'light');
        }

        // Apply other saved preferences
        if (savedAccent && accentColors[savedAccent]) {
          setAccentColor(savedAccent);
        }

        if (savedFontSize && fontSizes[savedFontSize]) {
          setFontSize(savedFontSize);
        }

        if (savedAnimations !== null) {
          setAnimations(savedAnimations === 'true');
        }

        if (savedHighContrast !== null) {
          setHighContrast(savedHighContrast === 'true');
        }

        console.log('🎨 Theme initialized:', {
          theme: savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),
          accent: savedAccent || 'blue',
          fontSize: savedFontSize || 'medium'
        });

      } catch (error) {
        console.error('🎨 Error initializing theme:', error);
      } finally {
        setLoading(false);
      }
    };

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e) => {
      // Only change if user hasn't explicitly set a theme
      const savedTheme = localStorage.getItem('stockforge_theme');
      if (!savedTheme) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    initTheme();

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (loading) return;

    const currentTheme = themes[theme];
    const currentAccent = accentColors[accentColor];
    const currentFontSize = fontSizes[fontSize];

    // Apply CSS custom properties
    const root = document.documentElement;
    
    // Theme colors
    root.style.setProperty('--color-primary', currentTheme.primary);
    root.style.setProperty('--color-secondary', currentTheme.secondary);
    root.style.setProperty('--color-tertiary', currentTheme.tertiary);
    root.style.setProperty('--color-text', currentTheme.text);
    root.style.setProperty('--color-text-secondary', currentTheme.textSecondary);
    root.style.setProperty('--color-text-muted', currentTheme.textMuted);
    root.style.setProperty('--color-border', currentTheme.border);
    root.style.setProperty('--color-accent', currentAccent.color);
    root.style.setProperty('--color-success', currentTheme.success);
    root.style.setProperty('--color-danger', currentTheme.danger);
    root.style.setProperty('--color-warning', currentTheme.warning);
    root.style.setProperty('--color-info', currentTheme.info);

    // Font size
    root.style.setProperty('--font-scale', currentFontSize.scale.toString());

    // Animations
    root.style.setProperty('--animation-duration', animations ? '0.3s' : '0.01s');

    // High contrast
    if (highContrast) {
      root.style.setProperty('--color-border', theme === 'dark' ? '#666666' : '#999999');
      root.style.setProperty('--color-text-secondary', currentTheme.text);
    }

    // Apply theme class to body
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    document.body.classList.add(`theme-${theme}`);
    
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }

    if (!animations) {
      document.body.classList.add('reduced-motion');
    } else {
      document.body.classList.remove('reduced-motion');
    }

    console.log('🎨 Theme applied:', theme, accentColor);

    // Dispatch theme change event
    window.dispatchEvent(new CustomEvent('stockforge:theme_changed', {
      detail: { 
        theme, 
        accentColor, 
        fontSize, 
        animations, 
        highContrast 
      }
    }));

  }, [theme, accentColor, fontSize, animations, highContrast, loading]);

  // Change theme
  const changeTheme = (newTheme) => {
    if (themes[newTheme]) {
      setTheme(newTheme);
      localStorage.setItem('stockforge_theme', newTheme);
      console.log('🎨 Theme changed to:', newTheme);
    }
  };

  // Toggle theme (dark/light)
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    changeTheme(newTheme);
  };

  // Change accent color
  const changeAccentColor = (newAccent) => {
    if (accentColors[newAccent]) {
      setAccentColor(newAccent);
      localStorage.setItem('stockforge_accent', newAccent);
      console.log('🎨 Accent color changed to:', newAccent);
    }
  };

  // Change font size
  const changeFontSize = (newSize) => {
    if (fontSizes[newSize]) {
      setFontSize(newSize);
      localStorage.setItem('stockforge_fontsize', newSize);
      console.log('🎨 Font size changed to:', newSize);
    }
  };

  // Toggle animations
  const toggleAnimations = () => {
    const newAnimations = !animations;
    setAnimations(newAnimations);
    localStorage.setItem('stockforge_animations', newAnimations.toString());
    console.log('🎨 Animations toggled:', newAnimations);
  };

  // Toggle high contrast
  const toggleHighContrast = () => {
    const newHighContrast = !highContrast;
    setHighContrast(newHighContrast);
    localStorage.setItem('stockforge_highcontrast', newHighContrast.toString());
    console.log('🎨 High contrast toggled:', newHighContrast);
  };

  // Reset to defaults
  const resetTheme = () => {
    const defaultTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    
    setTheme(defaultTheme);
    setAccentColor('blue');
    setFontSize('medium');
    setAnimations(true);
    setHighContrast(false);

    // Clear localStorage
    localStorage.removeItem('stockforge_theme');
    localStorage.removeItem('stockforge_accent');
    localStorage.removeItem('stockforge_fontsize');
    localStorage.removeItem('stockforge_animations');
    localStorage.removeItem('stockforge_highcontrast');

    console.log('🎨 Theme reset to defaults');
  };

  // Get current theme data
  const getCurrentTheme = () => {
    return {
      theme: themes[theme],
      themeName: theme,
      accentColor: accentColors[accentColor],
      accentName: accentColor,
      fontSize: fontSizes[fontSize],
      fontSizeName: fontSize,
      animations,
      highContrast
    };
  };

  // Check if current theme is dark
  const isDark = () => {
    return theme === 'dark' || theme === 'midnight';
  };

  // Check if current theme is light
  const isLight = () => {
    return theme === 'light' || theme === 'professional';
  };

  // Get contrast color for text
  const getContrastColor = (backgroundColor) => {
    // Simple contrast check - you can enhance this
    const hex = backgroundColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    return brightness > 128 ? '#000000' : '#ffffff';
  };

  // Create custom theme
  const createCustomTheme = (themeName, themeConfig) => {
    // This could be extended to allow custom themes
    console.log('🎨 Custom theme creation:', themeName, themeConfig);
  };

  const value = {
    // Current state
    theme,
    accentColor,
    fontSize,
    animations,
    highContrast,
    loading,

    // Available options
    themes,
    accentColors,
    fontSizes,

    // Functions
    changeTheme,
    toggleTheme,
    changeAccentColor,
    changeFontSize,
    toggleAnimations,
    toggleHighContrast,
    resetTheme,
    getCurrentTheme,
    isDark,
    isLight,
    getContrastColor,
    createCustomTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
