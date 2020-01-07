import React from 'react';
import { TableChart, BlockText, AccountsQuery, NerdGraphQuery, Dropdown, DropdownItem, Grid, GridItem } from 'nr1';
import { fakeTabledata } from './fake'
import PropTypes from 'prop-types';
import AccountPicker  from './account-picker'
import TableChartWrapper from './TableChartWrapper'
import { getCustomEventList } from './utils';

// https://docs.newrelic.com/docs/new-relic-programmable-platform-introduction

export default class CeViewer extends React.Component {

  constructor(props) {
    super(props); 
    this.state = { sectedAccountId: null };
    this.onAccountSelected = this.onAccountSelected.bind(this);
    this.tableData = null;
  }
  
  async componentDidUpdate() {
    const tableData = await getCustomEventList(this.state.selectedAccountId);
    console.log("XX.5 onAccountSelect is tabledata array? : " + Array.isArray(tableData));
    this.tableData = tableData;
    console.debug(this.tableData);
  }
  
  async onAccountSelected(accountId) {
    this.setState({selectedAccountId: accountId});
  }
  
  render() {
    
    // if(this.tableData && this.tableData.data.length > 0)
    if(false)
    {
      return (
        <>
          <Grid spacingType={[Grid.SPACING_TYPE.NONE, Grid.SPACING_TYPE.NONE]} >
            <GridItem>
            <AccountPicker accountChangedCallback={this.onAccountSelected} />
            </GridItem>
          </Grid>
          {console.log("selectedAccountID: XX.2: " + this.state.selectedAccountId)}
          <TableChartWrapper accountId={this.state.selectedAccountId}
                            tableData={this.tableData}/>
        </>
        );
      } else {
        return (
          <Grid spacingType={[Grid.SPACING_TYPE.NONE, Grid.SPACING_TYPE.NONE]} >
        <GridItem>
        <AccountPicker accountChangedCallback={this.onAccountSelected} />
        </GridItem>
      </Grid>
      );
    }   
  }
}
// console.log("XX.4 ============= DidUpdate ============");
// console.log("XX.3 ceviewer ============= DidMount ============");

// {/* {console.log("Selected Account ID 1: " + selectedAccountId)} */}
// {/* {console.log("Selected Account ID 1: " + selectedAccountId)} */}

          // console.log("XX 7.1 =========== table data is array " + Array.isArray(this.state.tableData));
          // console.log("XX 7.2 =========== stringify" + JSON.stringify(this.state.tableData));

          // {/* <TableChart accountId={this.state.selectedAccountId} data={this.state.tableData}
          // fullWidth fullHeight className="" />  */}
          // {/* <TableChart accountId={1} data={fakeTabledata}
          // fullWidth fullHeight className="" />
          // {console.log("Selected Account ID 1.1: " + selectedAccountId)} */}
          // {/* <TableChart accountId={selectedAccountId} query={'SELECT count(*) from Transaction facet name '}
          // fullWidth fullHeight className="" /> */}
