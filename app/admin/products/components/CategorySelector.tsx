"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, Loader } from "lucide-react";
import { fetchCategories, CategoryWithRelations } from "../../actions/categories";
import { toast } from "sonner";

interface CategorySelectorProps {
  value: string;
  onChange: (categoryId: string) => void;
  error?: string;
}

export default function CategorySelector({ value, onChange, error }: CategorySelectorProps) {
  const [categories, setCategories] = useState<CategoryWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const result = await fetchCategories();
      if (result.success && result.data) {
        setCategories(result.data);
        // Auto-expand parent categories that have children
        const parentsWithChildren = result.data
          .filter((cat: CategoryWithRelations) => cat.children?.length > 0 && !cat.parentId)
          .map((cat: CategoryWithRelations) => cat.id);
        setExpandedCategories(new Set(parentsWithChildren));
      } else {
        toast.error(result.error || "Failed to load categories");
      }
    } catch (error) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const getParentCategories = () => {
    return categories.filter((cat) => !cat.parentId);
  };

  const getSelectedCategoryName = () => {
    if (!value) return "Select a category";
    const findCategory = (cats: CategoryWithRelations[]): CategoryWithRelations | null => {
      for (const cat of cats) {
        if (cat.id === value) return cat;
        if (cat.children?.length > 0) {
          const found = findCategory(cat.children);
          if (found) return found;
        }
      }
      return null;
    };
    const selected = findCategory(categories);
    return selected ? `${selected.icon || ""} ${selected.name}` : "Select a category";
  };

  const renderCategory = (category: CategoryWithRelations, level: number = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedCategories.has(category.id);
    const isSelected = value === category.id;

    return (
      <div key={category.id}>
        <div
          className={`flex items-center gap-2 px-3 py-2.5 hover:bg-accent cursor-pointer transition-colors ${
            isSelected ? "bg-primary/10 text-primary" : ""
          }`}
          style={{ paddingLeft: `${level * 1.5 + 0.75}rem` }}
        >
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(category.id);
              }}
              className="p-0.5 hover:bg-accent rounded"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
          ) : (
            <div className="w-5" />
          )}
          <div
            onClick={() => {
              onChange(category.id);
              setIsOpen(false);
            }}
            className="flex-1 flex items-center gap-2"
          >
            {category.icon && <span className="text-lg">{category.icon}</span>}
            <span className="text-sm font-medium">{category.name}</span>
            {category._count && category._count.products > 0 && (
              <span className="text-xs text-muted-foreground">
                ({category._count.products})
              </span>
            )}
          </div>
        </div>
        {hasChildren && isExpanded && (
          <div>
            {category.children.map((child) => renderCategory(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="w-full px-4 py-2.5 rounded-lg border border-border bg-background flex items-center gap-2">
        <Loader className="w-4 h-4 animate-spin text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Loading categories...</span>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-2.5 rounded-lg border ${
          error ? "border-destructive" : "border-border"
        } bg-background text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-ring`}
      >
        <span className={value ? "text-foreground" : "text-muted-foreground"}>
          {getSelectedCategoryName()}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 w-full mt-2 bg-card border border-border rounded-lg shadow-lg max-h-80 overflow-y-auto">
            {getParentCategories().length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                No categories available
              </div>
            ) : (
              <div className="py-2">
                {getParentCategories().map((category) => renderCategory(category))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
