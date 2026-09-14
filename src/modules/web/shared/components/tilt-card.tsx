'use client'

import { useRef, type ReactNode } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TiltCardProps {
  children: ReactNode
  className?: string
  intensity?: number
  gloss?: boolean
  perimeter?: boolean
}

export function TiltCard({
  children,
  className,
  intensity = 10,
  gloss = true,
  perimeter = true,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)

  const rx = useSpring(useTransform(my, [0, 1], [intensity, -intensity]), {
    stiffness: 200,
    damping: 18,
  })
  const ry = useSpring(useTransform(mx, [0, 1], [-intensity, intensity]), {
    stiffness: 200,
    damping: 18,
  })

  const glossX = useTransform(mx, [0, 1], ['-30%', '130%'])
  const glossOpacity = useMotionValue(0)

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width)
    my.set((e.clientY - r.top) / r.height)
    glossOpacity.set(1)
  }

  function handleLeave() {
    mx.set(0.5)
    my.set(0.5)
    glossOpacity.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      className={cn(
        'group relative [transform-style:preserve-3d]',
        perimeter && 'neon-perimeter',
        className,
      )}
    >
      {children}
      {gloss && (
        <motion.span
          aria-hidden="true"
          style={{ x: glossX, opacity: glossOpacity }}
          className="pointer-events-none absolute inset-y-0 z-[3] w-1/2 gloss"
        />
      )}
    </motion.div>
  )
}
