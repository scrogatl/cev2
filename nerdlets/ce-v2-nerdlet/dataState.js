import React from 'react';
import { genTableDataV2 } from './utils';

export default class DataState extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedAccountId: null,
      timeRange: null,
      tableData: [],
      shouldUpdate: false
      };
}

  async getSomeData(timeRange, selectedAccountId,callBack) {
    if(this.state.selectedAccountId != selectedAccountId || this.state.timeRange != timeRange) {
      this.state.selectedAccountId = selectedAccountId;
      this.state.timeRange = timeRange;
      this.state.shouldUpdate = true;
    }
    if(this.state.selectedAccountId && this.state.timeRange && this.state.shouldUpdate ) {
      this.state.shouldUpdate = false;
      const tableData = await genTableDataV2(this.state.selectedAccountId,this.state.timeRange);
      if(callBack) {
          await callBack(tableData);
        }
    }
  }
}
