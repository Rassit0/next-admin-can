'use client'

import { useEffect, useState } from 'react'

interface TypewriterProps {
  words: string[]
  className?: string
}

export function Typewriter({ words, className }: TypewriterProps) {
  const [index, setIndex] = useState(0)
  const [text, setText] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = words[index % words.length]
    let timeout: ReturnType<typeof setTimeout>

    if (!deleting && text === current) {
      timeout = setTimeout(() => setDeleting(true), 1400)
    } else if (deleting && text === '') {
      setDeleting(false)
      setIndex((i) => (i + 1) % words.length)
    } else {
      timeout = setTimeout(
        () => {
          setText((prev) =>
            deleting
              ? current.slice(0, prev.length - 1)
              : current.slice(0, prev.length + 1),
          )
        },
        deleting ? 45 : 85,
      )
    }
    return () => clearTimeout(timeout)
  }, [text, deleting, index, words])

  return (
    <span className={className}>
      {text}
      <span className="ml-1 inline-block h-[0.9em] w-[3px] translate-y-[2px] animate-pulse bg-neon align-middle" />
    </span>
  )
}
