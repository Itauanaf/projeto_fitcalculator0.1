/** Fields exclusive to a trainer, keyed by their `Profile.id`. */
export interface TrainerProfile {
  userId: string
  phone?: string
  /** Professional registration number (CREF, in Brazil) — optional, shown for credibility. */
  cref?: string
  bio?: string
  createdAt: Date
  updatedAt: Date
}
