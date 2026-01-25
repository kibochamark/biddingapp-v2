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
          href={`/catalog?category=${category.slug}`}
          className="group"
        >
          <div className="relative glass-card flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-primary/5 backdrop-blur-md p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10">

            {/* Icon */}
            <div className="relative h-14 w-14 rounded-xl  p-3 flex items-center justify-center transition-colors duration-300">
              <Image
                src={category.icon as string}
                alt={category.name}
                fill
                className="object-contain"
              />
            </div>

            {/* Title */}
            <h3 className="text-sm font-semibold text-center text-foreground/90 group-hover:text-primary transition-colors">
              {category.name}
            </h3>
          </div>
        </Link>
      ))}
    </div>
  );
}
