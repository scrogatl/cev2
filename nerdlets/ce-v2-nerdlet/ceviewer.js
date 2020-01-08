import React from 'react';
import { TableChart, BlockText, AccountsQuery, NerdGraphQuery, Dropdown, DropdownItem, Grid, GridItem } from 'nr1';
import { fakeTabledata } from './fake'
import AccountPicker  from './account-picker'
import { generateTableData } from './utils';

// https://docs.newrelic.com/docs/new-relic-programmable-platform-introduction

export default class CeViewer extends React.Component {

  constructor(props) {
    super(props); 
    this.state = { 
      sectedAccountId: 1,
      tableData: []
    };
    this.onAccountSelected = this.onAccountSelected.bind(this);
  }
  
  async componentDidUpdate() {
    // account-picker callback seems a better choice
  }
  
  async onAccountSelected(accountId) {
    this.setState({selectedAccountId: accountId});
    const tableData = await generateTableData(this.state.selectedAccountId);
    this.setState({tableData});
  }
  
  render() {
    console.debug("XX=== ");
    console.debug(this.state.tableData);
    // if(this.state.tableData.length > 0)
    if(true)
    {
    return (
        <>
          <Grid spacingType={[Grid.SPACING_TYPE.NONE, Grid.SPACING_TYPE.NONE]} >
            <GridItem>
            <AccountPicker accountChangedCallback={this.onAccountSelected} />
            </GridItem>
          </Grid>
            {/* <TableChart  data={fakeTabledata} fullWidth fullHeight className="" />  */}
            <TableChart data={this.state.tableData} fullWidth fullHeight className="" /> 
            {/* <TableChart accountId={Number(this.state.selectedAccountId)} query={'SELECT count(*) from Transaction, PageView facet name '} 
                        fullWidth fullHeight className="" /> */}
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

  