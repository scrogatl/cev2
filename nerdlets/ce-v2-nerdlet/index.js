import React from 'react';
import { Spinner, TableChart, Grid, GridItem, PlatformStateContext, BlockText } from 'nr1';
import AccountPicker from './account-picker'
import DataState from './dataState';

export default class Wrapper extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedAccountId: null,
      timeRange: null,
      tableData: [],
      isLoading: true,
      dataState: new DataState(),
      totalCount: null
    };
    this.onAccountSelected = this.onAccountSelected.bind(this);
    this.onDataReady = this.onDataReady.bind(this);
  }

  async onDataReady(tableData, totalCount) {
    // console.debug("Data is ready!");
    this.setState({ tableData, isLoading: false, totalCount })
  }
  async onAccountSelected(accountId) {
    // await console.debug("accountId: " + accountId);
    this.setState({ selectedAccountId: accountId });
  }

  render() {
    return (
      <>
        <Grid spacingType={[Grid.SPACING_TYPE.NONE, Grid.SPACING_TYPE.NONE]} >
          <GridItem>
            <AccountPicker accountChangedCallback={this.onAccountSelected} />
          </GridItem>
        </Grid>
        <PlatformStateContext.Consumer>
          {(platformState) => {
            const { timeRange } = platformState;
            this.state.dataState.getSomeData(timeRange, this.state.selectedAccountId, this.onDataReady);
            if(!this.state.isLoading) {
            return (
            <>  
              <BlockText type={BlockText.TYPE.PARAGRAPH}>
                Total Custom Events: {this.state.totalCount}
              </BlockText>
              <TableChart data={this.state.tableData} fullWidth fullHeight className="" />
            </>
            );
            } else {
              <Spinner />
            }
          }}
        </PlatformStateContext.Consumer>
      </>
    );
  }
}

