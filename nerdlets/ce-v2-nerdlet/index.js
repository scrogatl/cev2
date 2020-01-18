import React from 'react';
import { Spinner, TableChart, Grid, GridItem, PlatformStateContext } from 'nr1';
import AccountPicker from './account-picker'
import { genTableDataV2 } from './utils';

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
    // await console.debug(">>>>>>>>>>>> onAccountSelected fired <<<<<<<<<<<<<<<");
    await console.debug("accountId: " + accountId);
    this.setState({ selectedAccountId: accountId });
    this.setState({ isLoading: true });
    // const { timeRange }  = this.props.launcherUrlState;
    const tableData = await genTableDataV2(this.state.selectedAccountId);
    this.setState({ tableData, isLoading: false });
  }

  render() {
    console.debug("++++++++++ render fired ++++++++++++ ");
    // console.debug(JSON.stringify(this.state.tableData));
    if (!this.state.isLoading) {
      // console.debug(this.state.tableData[0].data.length);
      let chartData = this.state.tableData;
      return (
        <>
          <Grid spacingType={[Grid.SPACING_TYPE.NONE, Grid.SPACING_TYPE.NONE]} >
            <GridItem>
              <AccountPicker accountChangedCallback={this.onAccountSelected} />
            </GridItem>
          </Grid>
          <PlatformStateContext.Consumer>
            {(platformState) => {
              return(
                console.debug("hello"),
                <TableChart data={chartData} fullWidth fullHeight className="" /> 
              );
            }}
            
          </PlatformStateContext.Consumer>
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
          <Spinner />
        </>
      );
    }
  }
}

