import { AccountsQuery, PlatformStateContext, NerdletStateContext, AutoSizer } from 'nr1';
import CeViewer from './ceviewer';
import { getCustomEventList } from './utils';

export default class Wrapper extends React.PureComponent {

  render() {
    return (
              <AutoSizer>
                {({ width, height }) => (
                  <CeViewer
                    // launcherUrlState={launcherUrlState}
                    // nerdletUrlState={nerdletUrlState}
                    // width={width}
                    // height={height}
                  />
                )}
              </AutoSizer>
    );
  }
  // render() {
  //   return (
  //     <PlatformStateContext.Consumer>
  //       {launcherUrlState => (
  //         <NerdletStateContext.Consumer>
  //           {nerdletUrlState => (
  //             <AutoSizer>
  //               {({ width, height }) => (
  //                 <CeViewer
  //                   launcherUrlState={launcherUrlState}
  //                   nerdletUrlState={nerdletUrlState}
  //                   width={width}
  //                   height={height}
  //                 />
  //               )}
  //             </AutoSizer>
  //           )}
  //         </NerdletStateContext.Consumer>
  //       )}
  //     </PlatformStateContext.Consumer>
  //   );
  // }
}
