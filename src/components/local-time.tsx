"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface LocalTimeProps {
  date: Date | string
  fmt: string
  className?: string
}

export function LocalTime({ date, fmt, className }: LocalTimeProps) {
  const [formatted, setFormatted] = useState("")

  useEffect(() => {
    setFormatted(format(new Date(date), fmt, { locale: ptBR }))
  }, [date, fmt])

  if (!formatted) return <span className={className} />

  return (
    <span className={className}>
      {formatted}
    </span>
  )
}
