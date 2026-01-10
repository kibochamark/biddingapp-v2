"use client";

import { DataTableColumnHeader } from "@/Globalcomponents/data-table-column-header";
import { Product } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { Edit } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import DeleteModal from "@/components/admin/DeleteModal";
import { deleteProduct } from "../actions/products";


export const productcolumns: ColumnDef<Product>[] = [
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const product = row.original;
            return (
                <div className="flex items-center gap-2">
                    <Link
                        href={`/admin/products/edit?id=${product.id}`}
                        className="p-2 hover:bg-accent rounded-lg transition-colors"
                        title="Edit product"
                    >
                        <Edit className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                    </Link>
                    <DeleteModal
                        resourceName="Product"
                        resourceTitle={product.title}
                        onDelete={async () => await deleteProduct(product.id)}
                    />
                </div>
            );
        },
    },
    {
        accessorKey: "id",
    },
    {
        accessorKey: "images",
        header: "Image",
        cell: ({ row }) => {
            const images = row.getValue("images") as string[];
            const firstImage = images?.[0];

            return (
                <div className="flex items-center justify-center w-16 h-16 bg-muted rounded-md overflow-hidden">
                    {firstImage ? (
                        <Image
                            src={firstImage}
                            alt={row.getValue("title") as string}
                            width={64}
                            height={64}
                            className="object-cover w-full h-full"
                        />
                    ) : (
                        <div className="flex items-center justify-center w-full h-full text-xs text-muted-foreground">
                            No image
                        </div>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "title",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Title" />
        ),
    },
    {
        accessorKey: "description",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Description"  />
        ),
        cell: ({ row }) => (
            <div className="max-w-sm truncate">{row.getValue("description")}</div>
        ),
    },
    {
        accessorKey: "category.name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Category" />
        ),
    },
    {
        accessorKey: "condition",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Condition" />
        ),
        cell: ({ row }) => {
            const condition = row.getValue("condition") as string;
            const conditionStyles: Record<string, string> = {
                NEW: "bg-green-500/10 text-green-600 border-green-500/20",
                MINT: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
                EXCELLENT: "bg-blue-500/10 text-blue-600 border-blue-500/20",
                LIKE_NEW: "bg-blue-500/10 text-blue-600 border-blue-500/20",
                GOOD: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
                FAIR: "bg-orange-500/10 text-orange-600 border-orange-500/20",
                POOR: "bg-red-500/10 text-red-600 border-red-500/20",
            };

            const conditionLabels: Record<string, string> = {
                NEW: "New",
                MINT: "Mint",
                EXCELLENT: "Excellent",
                LIKE_NEW: "Like New",
                GOOD: "Good",
                FAIR: "Fair",
                POOR: "Poor",
            };

            return (
                <span
                    className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full border ${
                        conditionStyles[condition] || "bg-muted text-muted-foreground border-border"
                    }`}
                >
                    {conditionLabels[condition] || condition}
                </span>
            );
        },
    },
    {
        accessorKey: "status",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),
    },
    {
        accessorKey: "originalPrice",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Original Price" />
        ),
    },
    {
        accessorKey: "biddingFee",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Bidding Fee" />
        ),
    }

]