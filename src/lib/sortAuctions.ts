type HasEndsAt = { endsAt: string }

export function sortByEndingSoon(a: HasEndsAt, b: HasEndsAt) {
  return new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime()
}