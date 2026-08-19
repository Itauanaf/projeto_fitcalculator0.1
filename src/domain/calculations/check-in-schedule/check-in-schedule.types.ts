export type CheckInStatus =
  | { kind: 'not_scheduled' }
  | { kind: 'upcoming'; dueInDays: number }
  | { kind: 'due' }
  | { kind: 'overdue'; daysOverdue: number }
