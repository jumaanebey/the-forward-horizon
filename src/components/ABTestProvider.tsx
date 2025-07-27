'use client';
import { createContext, useContext, useEffect, useState } from 'react';

interface ABTest {
  name: string;
  variant: 'A' | 'B';
}

interface ABTestContextType {
  getVariant: (testName: string) => 'A' | 'B';
  trackConversion: (testName: string, variant: 'A' | 'B') => void;
}

const ABTestContext = createContext<ABTestContextType | undefined>(undefined);

export function ABTestProvider({ children }: { children: React.ReactNode }) {
  const [tests, setTests] = useState<Record<string, 'A' | 'B'>>({});

  useEffect(() => {
    // Load existing test assignments from localStorage
    const stored = localStorage.getItem('ab_tests');
    if (stored) {
      try {
        setTests(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading A/B tests:', error);
      }
    }
  }, []);

  const getVariant = (testName: string): 'A' | 'B' => {
    // If user already has assignment, return it
    if (tests[testName]) {
      return tests[testName];
    }

    // Assign new variant (50/50 split)
    const variant = Math.random() < 0.5 ? 'A' : 'B';
    
    const newTests = { ...tests, [testName]: variant };
    setTests(newTests);
    
    // Save to localStorage
    localStorage.setItem('ab_tests', JSON.stringify(newTests));
    
    // Track assignment
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'ab_test_assignment', {
        test_name: testName,
        variant: variant,
        event_category: 'ab_testing'
      });
    }

    return variant;
  };

  const trackConversion = (testName: string, variant: 'A' | 'B') => {
    // Track conversion in Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'ab_test_conversion', {
        test_name: testName,
        variant: variant,
        event_category: 'ab_testing'
      });
    }

    // Track conversion in Facebook Pixel
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('trackCustom', 'ABTestConversion', {
        test_name: testName,
        variant: variant
      });
    }

    console.log(`A/B Test Conversion: ${testName} - Variant ${variant}`);
  };

  return (
    <ABTestContext.Provider value={{ getVariant, trackConversion }}>
      {children}
    </ABTestContext.Provider>
  );
}

export function useABTest() {
  const context = useContext(ABTestContext);
  if (context === undefined) {
    throw new Error('useABTest must be used within an ABTestProvider');
  }
  return context;
}

// Hook for specific A/B tests with conversion tracking
export function useABTestWithConversion(testName: string) {
  const { getVariant, trackConversion } = useABTest();
  const variant = getVariant(testName);

  const convert = () => {
    trackConversion(testName, variant);
  };

  return { variant, convert };
}