import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DataTableState } from '../../model/data-table';
import * as fromDataTable from './data-table.reducer';

export const selectDataTableState = createFeatureSelector<DataTableState>(fromDataTable.dataTableFeatureKey);

export const selectSortDirection = createSelector(selectDataTableState, (state: DataTableState) => state.sortDirection);
export const selectSortKey = createSelector(selectDataTableState, (state: DataTableState) => state.sortKey);
export const selectPainVisible = createSelector(selectDataTableState, (state: DataTableState) => state.isPaneVisible);
export const selectTableData = createSelector(selectDataTableState, (state: DataTableState) => state.tableData);

export const selectFilterQuery = createSelector(selectDataTableState, (state: DataTableState) => state.filterQuery);
export const selectFilterBy = createSelector(selectDataTableState, (state: DataTableState) => state.filterBy);

export const selectdataTableParams = createSelector(selectDataTableState, (state: DataTableState) => state.dataTableParams);
export const selectData = createSelector(
  selectTableData,
  selectSortDirection,
  selectSortKey,
  selectPainVisible,
  selectFilterQuery,
  selectFilterBy,
  selectdataTableParams,
  (tableData, sortDirection, sortKey, isPaneVisible, filterQuery, filterBy,selectdataTableParams) => {
    let filteredData = [...tableData];

    // Filter Array
    if (filterQuery !== '') {
      filteredData = filteredData.filter((item) => {
        const result = filterBy
          .map((filterBy) => {
            return item[filterBy]?.toLowerCase().includes(filterQuery);
          })
          .some((item) => item);
        return result;
      });
    }

    if (sortDirection === '') {
      return filteredData;
    }

    const sortedData = [...filteredData].sort((a, b) => {
      const paramA = a[sortKey];
      const paramB = b[sortKey];
      return compare(paramA, paramB, sortDirection);
    });
    return sortedData;
  }
);

// Utils
export function compare(a: any, b: any, sortDirection: string): number {
  if (a > b) {
    return sortDirection === 'asc' ? 1 : -1;
  }
  if (a < b) {
    return sortDirection === 'desc' ? 1 : -1;
  }
  return 0;
}
