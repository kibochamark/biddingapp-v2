"use client";

import { DataTableColumnHeader } from "@/Globalcomponents/data-table-column-header";
import { Product } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { Edit } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import DeleteModal from "@/components/admin/DeleteModal";
import { deleteProduct } from "../actions/products";
import { Badge } from "@/components/ui/badge";


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
                        className="p-2 hover:bg-soft-cloud rounded-full transition-colors"
                        title="Edit product"
                    >
                        <Edit className="w-4 h-4 text-mute hover:text-ink" />
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
                <div className="flex items-center justify-center w-16 h-16 bg-soft-cloud overflow-hidden">
                    {firstImage ? (
                        <Image
                            src={firstImage}
                            alt={row.getValue("title") as string}
                            width={64}
                            height={64}
                            className="object-cover w-full h-full"
                        />
                    ) : (
                        <div className="flex items-center justify-center w-full h-full text-xs text-mute">
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
                <Badge variant="default">
                    {conditionLabels[condition] || condition}
                </Badge>
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