'use client'

import { Escuelas } from '@/modules/portal/schools/components/escuelas-screen'
import { PublicCourse } from '@/modules/portal/schools/actions/schools.action'

export default function EscuelasContent({ initialCourses }: { initialCourses: PublicCourse[] }) {
  return <Escuelas initialCourses={initialCourses} />
}
