'use client'

import { Escuelas } from '@/modules/web/schools/components/escuelas-screen'
import { PublicCourse } from '@/modules/web/schools/actions/schools.action'

export default function EscuelasContent({ initialCourses }: { initialCourses: PublicCourse[] }) {
  return <Escuelas initialCourses={initialCourses} />
}
