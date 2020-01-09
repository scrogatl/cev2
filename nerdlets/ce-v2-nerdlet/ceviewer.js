import React from 'react';
import { Spinner, TableChart, BlockText, AccountsQuery, NerdGraphQuery, Dropdown, DropdownItem, Grid, GridItem } from 'nr1';
import { fakeTabledata } from './fake'
import AccountPicker  from './account-picker'
import { genTableData } from './utils';

// https://docs.newrelic.com/docs/new-relic-programmable-platform-introduction

export default class CeViewer extends React.Component {

  constructor(props) {
    super(props); 
    this.state = { 
      selectedAccountId: null,
      tableData: [],
      isLoading: true
    };
    this.onAccountSelected = this.onAccountSelected.bind(this);
  }
  
  async componentDidUpdate() {
    // account-picker callback seems a better choice
  }
  
  async onAccountSelected(accountId) {
    await console.debug(">>>>>>>>>>>> onAccountSelected fired <<<<<<<<<<<<<<<");
    await console.debug("accountId: "+ accountId);
    this.setState({selectedAccountId: accountId});
    this.setState({isLoading: true});
    const tableData = await genTableData(this.state.selectedAccountId);
    this.setState({tableData, 
                  isLoading: false});
    // this.setState({isLoading: false});
  }
  
  render() {
    console.debug("++++++++++ render fired ----------- ");
    // console.debug(JSON.stringify(this.state.tableData));
    if(!this.state.isLoading)
    {
    // console.debug(this.state.tableData[0].data.length);
    let chartData = this.state.tableData;
    if(this.state.tableData[0].data.length == 0) chartData = [];
    return (
        <>
          <Grid spacingType={[Grid.SPACING_TYPE.NONE, Grid.SPACING_TYPE.NONE]} >
            <GridItem>
            <AccountPicker accountChangedCallback={this.onAccountSelected} />
            </GridItem>
          </Grid>
            <TableChart data={chartData} fullWidth fullHeight className=""/>
        </>
        );
    } else {
      return (
        <>
        <Grid spacingType={[Grid.SPACING_TYPE.NONE, Grid.SPACING_TYPE.NONE]} >
        <GridItem>
        <AccountPicker accountChangedCallback={this.onAccountSelected} />
        </GridItem>
      </Grid>
      <Spinner  />
      </>
  );
    }
      }
    }

  