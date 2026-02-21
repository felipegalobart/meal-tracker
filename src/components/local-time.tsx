"use client"

import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface LocalTimeProps {
  date: Date | string
  fmt: string
  className?: string
}

export function LocalTime({ date, fmt, className }: LocalTimeProps) {
  return (
    <span className={className}>
      {format(new Date(date), fmt, { locale: ptBR })}
    </span>
  )
}
