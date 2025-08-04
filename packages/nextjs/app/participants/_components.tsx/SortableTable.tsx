"use client";

import React from "react";
import { RewardInfoCell } from "./RewardInfoCell";
import { TotalInfoCell } from "./TotalInfoCell";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { formatEther } from "viem";
import { BlockieAvatar } from "~~/components/scaffold-eth";
import { IParticipantWithData } from "~~/types/abitype/interfaces";
import { parseTimestamp } from "~~/utils/scaffold-eth";

export const SortableTable: React.FC<{ data: IParticipantWithData[] }> = ({ data }) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const columns = React.useMemo<ColumnDef<IParticipantWithData>[]>(
    () => [
      {
        accessorKey: "staker",
        header: () => "Staker",
        cell: info => {
          const address = info.getValue() as string;
          return (
            <div className="flex flex-row">
              <BlockieAvatar address={address} size={30} />
              <span className="ml-2 mr-1">{address.slice(0, 12) + "..."}</span>
            </div>
          );
        },
        //this column will sort in ascending order by default since it is a string column
      },
      {
        header: () => "Principal",
        accessorFn: row => row.stake,
        id: "stake",
        cell: info => formatEther(info.getValue() as bigint) + " ETH",
      },
      {
        accessorKey: "depositTimestamp",
        header: () => "Date",
        sortingFn: "datetime",
        cell: info => parseTimestamp(info.getValue() as bigint),
      },
      {
        accessorKey: "reward",
        header: () => "Reward",
        cell: info => <RewardInfoCell participant={info.row.original} />,
      },
      {
        accessorKey: "total",
        header: () => "Total",
        cell: info => <TotalInfoCell participant={info.row.original} />,
      },
    ],
    [],
  );

  const table = useReactTable({
    columns,
    data,
    debugTable: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(), //client-side sorting
    onSortingChange: setSorting, //optionally control sorting state in your own scope for easy access
    // sortingFns: {
    //   sortStatusFn, //or provide our custom sorting function globally for all columns to be able to use
    // },
    //no need to pass pageCount or rowCount with client-side pagination as it is calculated automatically
    state: {
      sorting,
    },
    // autoResetPageIndex: false, // turn off page index reset when sorting or filtering - default on/true
    // enableMultiSort: false, //Don't allow shift key to sort multiple columns - default on/true
    // enableSorting: false, // - default on/true
    // enableSortingRemoval: false, //Don't allow - default on/true
    // isMultiSortEvent: (e) => true, //Make all clicks multi-sort - default requires `shift` key
    // maxMultiSortColCount: 3, // only allow 3 columns to be sorted at once - default is Infinity
  });

  //access sorting state from the table instance
  console.log(table.getState().sorting);

  return (
    <div className="p-2">
      <div className="h-2" />
      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div
                        className={header.column.getCanSort() ? "cursor-pointer select-none" : ""}
                        onClick={header.column.getToggleSortingHandler()}
                        title={
                          header.column.getCanSort()
                            ? header.column.getNextSortingOrder() === "asc"
                              ? "Sort ascending"
                              : header.column.getNextSortingOrder() === "desc"
                                ? "Sort descending"
                                : "Clear sort"
                            : undefined
                        }
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: " 🔼",
                          desc: " 🔽",
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table
            .getRowModel()
            .rows.slice(0, 10)
            .map(row => {
              return (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => {
                    return <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>;
                  })}
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};
