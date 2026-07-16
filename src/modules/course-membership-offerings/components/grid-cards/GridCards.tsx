import { Card } from "@heroui/react";
import React from "react";
import { CardAdd } from "./CardAdd";
import { ICourseSeason } from "@/modules/course-membership-offerings";
import { CardCourseOffering } from "./Card";

interface Props {
  courseSeasons: ICourseSeason[];
}

export const GridCards = ({ courseSeasons }: Props) => {
  if (courseSeasons.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No hay temporadas</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courseSeasons.map((courseSeason) => (
        <CardCourseOffering key={courseSeason.id} courseSeason={courseSeason} />
      ))}
    </div>
  );
};
