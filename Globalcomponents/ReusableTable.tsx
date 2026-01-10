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
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder={`Search ${search_alias_name}...`}
                        value={(table.getState().globalFilter as string) ?? ""}
                        onChange={(e) => table.setGlobalFilter(e.target.value.toString())}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring text-sm"
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
                                        className={`${classnames} px-4 py-2 text-sm font-medium rounded-lg transition-all bg-muted text-foreground hover:bg-accent hover:cursor-pointer ${filtervalue === table.getColumn(filtercolumn)?.getFilterValue() ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-accent"}
                                }`}
                                    >
                                        {filtervalue}
                                    </button>
                            ):(
                                        <button
                                            onClick={() => table.getColumn(filtercolumn)?.setFilterValue(filtervalue)}
                                            className={`${classnames} px-4 py-2 text-sm font-medium rounded-lg transition-all bg-muted text-foreground hover:bg-accent hover:cursor-pointer ${filtervalue === defaultfilter ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-accent"}
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

            <div className="glass-card rounded-xl border border-border overflow-hidden">
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-card rounded-xl border border-border max-w-md w-full p-6">
                <h3 className="text-xl font-bold text-foreground mb-2">Delete Product</h3>
                <p className="text-muted-foreground mb-6">
                    Are you sure you want to delete "<strong>{productTitle}</strong>"? This action cannot be
                    undone.
                </p>
                <div className="flex items-center justify-end gap-3">
                    <button
                        onClick={onCancel}
                        disabled={isDeleting}
                        className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-all text-sm font-medium disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-all text-sm font-medium disabled:opacity-50"
                    >
                        {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
}