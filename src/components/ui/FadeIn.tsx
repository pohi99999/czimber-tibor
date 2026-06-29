'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  /** Delay in seconds before animation starts */
  delay?: number;
  /** Direction of slide-in: up (default), left, right, none */
  direction?: 'up' | 'left' | 'right' | 'none';
  /** Amount of element visible before triggering (0–1) */
  threshold?: number;
}

export default function FadeIn({
  children,
  className,
  delay = 0,
  direction = 'up',
  threshold = 0.15,
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: threshold });

  const initialOffset = {
    up: { y: 40 },
    left: { x: -40 },
    right: { x: 40 },
    none: {},
  }[direction];

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, ...initialOffset }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}
