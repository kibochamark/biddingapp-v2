import Link from "next/link";
import { Category } from "@/lib/types";

interface CategoryGridProps {
  categories: Category[];
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/catalog?category=${category.slug}`}
          className="group"
        >
          <div className="glass-card rounded-lg p-6 hover:shadow-2xl hover:border-primary/40 transition-all duration-300 text-center">
            <div className="text-4xl mb-3">{category.icon}</div>
            <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
              {category.name}
            </h3>
          </div>
        </Link>
      ))}
    </div>
  );
}
