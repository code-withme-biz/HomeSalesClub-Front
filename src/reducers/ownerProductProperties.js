import moment from 'moment';

/**
 * Action types
 */

export const FETCH_PUBLIC_RECORD_LINE_ITEMS = 'FETCH_PUBLIC_RECORD_LINE_ITEMS';
export const RECEIVE_PUBLIC_RECORD_LINE_ITEMS = 'RECEIVE_PUBLIC_RECORD_LINE_ITEMS';
export const FAILED_PUBLIC_RECORD_LINE_ITEMS = 'FAILED_PUBLIC_RECORD_LINE_ITEMS';

export const UPDATE_DATE_RANGE = 'UPDATE_DATE_RANGE';
export const UPDATE_FILTER_DATA = 'UPDATE_FILTER_DATA';
export const UPDATE_PRACTICE_TYPE = 'UPDATE_PRACTICE_TYPE';
export const UPDATE_STATE = 'UPDATE_STATE';
export const UPDATE_COUNTY = 'UPDATE_COUNTY';
export const UPDATE_ZIP = 'UPDATE_ZIP'
export const UPDATE_OWNERS = 'UPDATE_OWNERS';

/**
 * Actions creator
 */

export const fetchOwnerProductProperties = data => ({type: FETCH_PUBLIC_RECORD_LINE_ITEMS, data});
export const receiveOwnerProductProperties = data => ({type: RECEIVE_PUBLIC_RECORD_LINE_ITEMS, data});
export const failedOwnerProductProperties = _ => ({type: FAILED_PUBLIC_RECORD_LINE_ITEMS });
export const updateDateRange = data => ({type: UPDATE_DATE_RANGE, data});
export const updateFilerData = data => ({type: UPDATE_FILTER_DATA, data});
export const updatePracticeType = data => ({type: UPDATE_PRACTICE_TYPE, data});
export const updateState = data => ({type: UPDATE_STATE, data});
export const updateCounty = data => ({type: UPDATE_COUNTY, data});
export const updateZip = data =>({type:UPDATE_ZIP,data});
export const updateOwners = data =>({type:UPDATE_OWNERS,data});

/**
 * Reducers
 */

const initialState = {
  data: [],
  count:0,
  startDate: moment().subtract(29, 'days').format('MM/DD/yyyy'),
  endDate: moment().format('MM/DD/yyyy'),
  isFetching: false,
  filterData: [],
  practiceType: [
    'foreclosure',
    'preforeclosure',
    'bankruptcy',
    'tax-lien',
    'auction',
    'inheritance',
    'probate',
    'eviction',
    'hoa-lien',
    'irs-lien',
    'enforce-lien',
    'mortgage-lien',
    'pre-inheritance',
    'pre-probate',
    'divorce',
    'tax-delinquency',
    'code-violation',
    'absentee-property-owner',
    'vacancy',
    'debt',
    'personal-injury',
    'marriage',
    'child-support',
    'criminal',
    'insurance-claims',
    'employment-discrimination',
    'traffic',
    'property-defect',
    'declaratory-judgment',
    'other-civil'
  ],
  selState: 'all',
  selCounty: 'all',
  zip: null,
  owners: 'all'
}

export default (state = initialState, action) => {
  switch(action.type) {
    case FETCH_PUBLIC_RECORD_LINE_ITEMS: 
      return {
        ...state,
        isFetching: true
      }
    case RECEIVE_PUBLIC_RECORD_LINE_ITEMS:
      let sum = 0;
      for (let record of action.data) {
        if (record.list === undefined) record.list = 1;
        sum += (record.list ? record.list : 0);
      }
      return {
        ...state,
        data: action.data,
        count:action.count,
        isFetching: false
      }
    case FAILED_PUBLIC_RECORD_LINE_ITEMS:
      return {
        ...state,
        isFetching: false
      }
    case UPDATE_DATE_RANGE:
      return {
        ...state,
        startDate: action.data.startDate,
        endDate: action.data.endDate
      }
    case UPDATE_FILTER_DATA:
      return {
        ...state,
        filterData: action.data
      }
    case UPDATE_PRACTICE_TYPE:
      return {
        ...state,
        practiceType: action.data.practiceType
      }
    case UPDATE_STATE:
      return {
        ...state,
        selState: action.data.state
      }
    case UPDATE_COUNTY:
      return {
        ...state,
        selCounty: action.data.county
      }
    case UPDATE_ZIP:
      return {
        ...state,
        zip: action.data.zip
      }
    case UPDATE_OWNERS:
      return {
        ...state,
        owners: action.data.owners
      }
    default:
      return state
  }
}