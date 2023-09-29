import { createAction, props } from '@ngrx/store';

enum Actions {
  SET_DATA_TABLE = '[Data Table] Set Table Data',
  SET_SORT_KEY = '[Data Table] Set Sort Key',
  SET_PAIN_VISIBLE = '[Data Table] Set Pain Visible',
  SET_DT_PARAMETERS = '[Data Table] Set Data Table Parameters ',
  // RESET_DATATABLE_STORE = '[Data Table] Reset Store',
  SET_FILTER_BY = '[Data Table] Set Filter By Properties and Query', 
}

export const setData = createAction(Actions.SET_DATA_TABLE, props<{ data: string }>());
export const setSortKey = createAction(Actions.SET_SORT_KEY, props<{ sortKey: any }>());
export const setPainVisible = createAction(Actions.SET_PAIN_VISIBLE, props<{ isPaneVisible: any }>());
export const setdataTableParams = createAction(Actions.SET_DT_PARAMETERS, props<{ dataTableParams: object }>());
// export const resetDataTableStore = createAction(Actions.RESET_DATATABLE_STORE);
export const setFilterBy = createAction(Actions.SET_FILTER_BY, props<{ filters: { filterBy: string[]; query: string } }>()); 




