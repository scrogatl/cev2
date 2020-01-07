import React from 'react';
import PropTypes from 'prop-types';

import {
  AccountsQuery,
  Dropdown,
  DropdownItem,
  UserStorageMutation,
  UserStorageQuery,
  TextField,
  TableChart
} from 'nr1';

import {getCustomEventList} from './utils';
import { fakeTabledata } from './fake';

export default class TableChartWrapper extends React.Component {
  constructor(props) {
    super(props);
}

  render() {
    const lv = this.props.tableData;
    console.log("AA.1 ======");
    console.debug(lv);
    console.log("AA.1 ======");

    return (
      <TableChart accountId={Number(this.props.accountId)} data={fakeTabledata} fullWidth fullHeight className="" /> 
      //  <TableChart accountId={Number(this.props.accountId)} data={lv} fullWidth fullHeight className="" /> 
      //  <TableChart accountId={Number(this.props.accountId)} query={'SELECT count(*) from Transaction, PageView facet name '}
      //  fullWidth fullHeight className="" />
      
      ) 
    }
  }
  
  
  
  // console.log("YY.2 TableChartWrapper didUpdate============");
  // console.log("YY.2-2 props: " + JSON.stringify(this.props));
  
  // console.log("YY.1 TableChartWrapper didMount============");
  // console.log("YY.1-2 props: " + JSON.stringify(this.props));
