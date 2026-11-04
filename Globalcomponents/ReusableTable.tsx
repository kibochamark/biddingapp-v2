"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    ColumnFiltersState,
    useReactTable,
    getFilteredRowModel,
    getPaginationRowModel,
    SortingState,
    getSortedRowModel,

} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { RefreshCcw, Search } from "lucide-react"
import { DataTablePagination } from "./pagination"
import { useCallback, useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    filters?:{
        filtercolumn: string;
        filtervalue: string;
        conditions?: string
        classnames?:string
    }[];
    search_alias_name:string;
    defaultfilter?: string;
}

interface GlobalFilter {
    globalFilter: any
}

export function DataTable<TData, TValue>({
    columns,
    data,
    filters,
    search_alias_name, defaultfilter
}: DataTableProps<TData, TValue>) {
    const router = useRouter()
    const path = usePathname()
    const searchParams = useSearchParams()
    // Get a new searchParams string by merging the current
    // searchParams with a provided key/value pair
    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString())
            params.set(name, value)

            return params.toString()
        },
        [searchParams]
    )


    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
    )
    const [globalFilter, setGlobalFilter] = useState<any>([])


   

    


    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        state: {
            sorting,
            columnFilters, 
            globalFilter, 
        },
    })

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-mute" />
                    <input
                        type="text"
                        placeholder={`Search ${search_alias_name}...`}
                        value={(table.getState().globalFilter as string) ?? ""}
                        onChange={(e) => table.setGlobalFilter(e.target.value.toString())}
                        className="w-full h-10 pl-11 pr-4 rounded-full bg-soft-cloud outline-none focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-ink text-sm transition-[background-color,box-shadow]"
                    />
                </div>

                {/* allow user to request more data / increase limit of data fetched */}

                <div className="mt-1">
                    <Select onValueChange={(value)=>{
                        let page = createQueryString("next", value)
                        router.replace(`${path}?${page}`)
                    
                    }}
                    defaultValue={searchParams.get('next') as string ?? "All"}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder={<RefreshCcw />} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Fetch more</SelectLabel>
                                <SelectItem value="All">Everything</SelectItem>
                                <SelectItem value="100">100+</SelectItem>
                                <SelectItem value="200">200+</SelectItem>
                                <SelectItem value="300">300+</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-2">
                    {filters?.map(({filtercolumn,filtervalue, conditions, classnames}, index) => {
                        return (
                            <>
                            {(table.getColumn(filtercolumn)?.getFilterValue() as string) ? (
                                    <button
                                        onClick={() => table.getColumn(filtercolumn)?.setFilterValue("")}
                                        className={`${classnames} h-10 px-4 text-sm font-medium rounded-full transition-colors hover:cursor-pointer ${filtervalue === table.getColumn(filtercolumn)?.getFilterValue() ? "bg-ink text-background" : "bg-soft-cloud text-ink hover:bg-hairline-soft"}
                                }`}
                                    >
                                        {filtervalue}
                                    </button>
                            ):(
                                        <button
                                            onClick={() => table.getColumn(filtercolumn)?.setFilterValue(filtervalue)}
                                            className={`${classnames} h-10 px-4 text-sm font-medium rounded-full transition-colors hover:cursor-pointer ${filtervalue === defaultfilter ? "bg-ink text-background" : "bg-soft-cloud text-ink hover:bg-hairline-soft"}
                                }`}
                                        >
                                            {filtervalue}
                                        </button>
                            )}
                           
                            </>
                        )
                      
                    })}
                </div>
            </div>

            <div className="border border-hairline overflow-hidden">
                <div className="relative w-full overflow-x-auto">
                    <Table className="min-w-full">
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>


                            <div className="bg-white">
                <DataTablePagination table={table} />
                            </div>
           

            {/* <DeleteConfirmModal
                productTitle={productToDelete.title}
                onConfirm={handleDelete}
                onCancel={() => setProductToDelete(null)}
                isDeleting={isDeleting}
            /> */}
        </div>
    )
}




function DeleteConfirmModal({
    productTitle,
    onConfirm,
    onCancel,
    isDeleting,
}: {
    productTitle: string;
    onConfirm: () => void;
    onCancel: () => void;
    isDeleting: boolean;
}) {
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-card border border-hairline max-w-md w-full p-6">
                <h3 className="text-xl font-semibold text-ink mb-2">Delete Product</h3>
                <p className="text-mute mb-6">
                    Are you sure you want to delete "<strong>{productTitle}</strong>"? This action cannot be
                    undone.
                </p>
                <div className="flex items-center justify-end gap-3">
                    <Button variant="outline" onClick={onCancel} disabled={isDeleting}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={onConfirm} disabled={isDeleting}>
                        {isDeleting ? "Deleting..." : "Delete"}
                    </Button>
                </div>
            </div>
        </div>
    );
}