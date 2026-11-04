import Link from "next/link";
import Image from "next/image";
import { Category } from "@/lib/types";

interface CategoryGridProps {
  categories: Category[];
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/catalog?category=${category.slug}&sortBy=ending_soon`}
          className="group"
        >
          <div className="flex flex-col items-center gap-4 bg-soft-cloud p-5">
            {/* Icon */}
            <div className="relative h-20 w-20">
              <Image
                src={category.icon as string}
                alt={category.name}
                fill
                className="object-contain"
              />
            </div>

            {/* Title */}
            <h3 className="text-sm font-medium text-center text-ink group-hover:text-primary transition-colors">
              {category.name}
            </h3>
          </div>
        </Link>
      ))}
    </div>
  );
}
