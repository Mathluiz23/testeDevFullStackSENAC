export const onlyDigits = (value: string) => value.replace(/\D/g, '')

export const formatCpf = (value: string) => {
  const digits = onlyDigits(value).slice(0, 11)

  if (digits.length <= 3) return digits
  if (digits.length <= 6) return digits.replace(/(\d{3})(\d+)/, '$1.$2')
  if (digits.length <= 9) return digits.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3')
  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, (_, p1, p2, p3, p4) =>
    [p1, p2, p3].join('.') + (p4 ? `-${p4}` : '')
  )
}
