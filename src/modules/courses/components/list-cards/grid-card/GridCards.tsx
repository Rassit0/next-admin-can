import { ICourse } from "@/modules/courses";
import { CardCourse } from "./Card";

interface Props {
  courses: ICourse[];
}

export const GridCards = ({ courses }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {courses.map((course) => (
        <CardCourse key={course.id} course={course} />
      ))}
    </div>
  );
};
