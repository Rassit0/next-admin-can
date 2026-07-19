import { Card } from "@heroui/react";
import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import React from "react";

export interface CardLouncherProps {
  href: string;
  icon: any;
  title: string;
  description: string;
  tagText: string;
}

export const CardLouncher = ({
  href,
  icon,
  title,
  description,
  tagText,
}: CardLouncherProps) => {
  return (
    <Link href={href}>
      <Card
        className="
        group
        p-8
        shadow-sm
        flex
        flex-col
        h-full
        transition-all
        duration-300
        hover:-translate-y-2
        hover:shadow-xl
        hover:shadow-black/5
      "
      >
        <div className="flex items-start justify-between mb-6">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-accent-foreground">
            <HugeiconsIcon
              icon={icon}
              style={{ fontVariationSettings: "'FILL' 1" }}
            />
          </div>
        </div>

        <h3 className="text-xl font-headline font-bold text-on-surface mb-2">
          {title}
        </h3>

        <p className="text-sm text-gray-500 font-body leading-relaxed mb-6">
          {description}
        </p>

        <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            {tagText}
          </span>

          <HugeiconsIcon
            icon={ArrowRight02Icon}
            className="text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all"
            size={40}
          />
        </div>
      </Card>
    </Link>
  );
};
