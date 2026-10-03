import type { RubricCriterion, RubricLevel } from '@/lib/schemas/rubric'

export const createLevel = (label = '', points = 0): RubricLevel => ({
  label,
  points,
  description: '',
})

export const createCriterion = (template?: RubricCriterion): RubricCriterion => ({
  id: crypto.randomUUID(),
  name: '',
  levels: template
    ? template.levels.map((level) => createLevel(level.label, level.points))
    : [createLevel(), createLevel(), createLevel()],
})

const safePoints = (points: number) => (Number.isFinite(points) ? points : 0)

export const criterionMaxPoints = (criterion: RubricCriterion) =>
  Math.max(0, ...criterion.levels.map((level) => safePoints(level.points)))

export const rubricTotalPoints = (criteria: RubricCriterion[]) =>
  criteria.reduce((sum, criterion) => sum + criterionMaxPoints(criterion), 0)
