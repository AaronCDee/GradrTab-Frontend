import { RubricCriteriaTable } from '@/components/rubric/RubricCriteriaTable'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { rubricTotalPoints } from '@/lib/rubric'
import type { RubricCriterion } from '@/lib/schemas/rubric'

type RubricPreviewProps = {
  title: string
  courseName: string
  courseId: string
  criteria: RubricCriterion[]
}

export function RubricPreview({ title, courseName, courseId, criteria }: RubricPreviewProps) {
  const description = [courseId.trim(), courseName.trim(), `${rubricTotalPoints(criteria)} points total`]
    .filter(Boolean)
    .join(' · ')

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title || 'Untitled rubric'}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <RubricCriteriaTable criteria={criteria} />
      </CardContent>
    </Card>
  )
}
