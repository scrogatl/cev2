import { NrqlQuery, NerdGraphQuery } from 'nr1';

export const nativeEvents = [
  "AjaxRequest",
"AutoScalingGroupSample",
"AutoScalingInstanceSample",
"AutoScalingLaunchConfigurationSample",
"AutoScalingPolicySample",
"AutoScalingRegionLimitSample",
"AwsWafWebACLSample",
"BrowserInteraction",
"ComputeSample",
"DatastoreSample",
"DistributedTraceIndex",
"ErrorTrace",
"FinanceSample",
"InfrastructureEvent",
"IntegrationDataFreshnessReport",
"IntegrationError",
"IntegrationProviderReport",
"JavaScriptError",
"LoadBalancerSample",
"Log",
"Metric",
"NRUsageEvent",
"NetworkSample",
"NginxSample",
"NrAuditEvent",
"NrDailyUsage",
"NrIntegrationError",
"NrUsage",
"PageAction",
"PageView",
"PageView",
"PageViewTiming",
"PageViewTiming",
"Plugins_Heartbeat",
"PrivateNetworkSample",
"ProcessSample",
"RedisKeyspaceSample",
"RedisSample",
"Relationship",
"SampledTransaction",
"SampledTransactionError",
"Span",
"Span",
"SqlTrace",
"StatsDApplicationEvent",
"StorageSample",
"SyntheticCheck",
"SyntheticCheck",
"SyntheticRequest",
"SyntheticsPrivateLocationStatus",
"SyntheticsPrivateMinion",
"SystemSample",
"Transaction",
"TransactionError",
"TransactionTrace"
];

export async function genTableDataV2(accountId, timeRange) {
  // console.debug("-------- genTableDataV2 fired----------");
  // console.debug(accountId);
  let nrqlQueries = '';
  let _totalCount = null; 
  const rv = await _nrqlQuery('show event types', accountId);
  const allEvents = rv.data.chart[0].data[0].eventTypes;
  for(var i=0, n=allEvents.length; i < n; ++i) {
    let anEvent = allEvents[i];
    if(nativeEvents.indexOf(anEvent) == -1) {
      const query = await _buildCountQuery(anEvent) + timeRangeToNrql(timeRange);
      const nrqlClause = await _buildGraphClause(anEvent, query);
      nrqlQueries = nrqlQueries.concat(nrqlClause);
    }
  }
  const data = [];
  let rv2 = await _buildGraphQuery(accountId, nrqlQueries);
  if(nrqlQueries.length > 0 ) {
    let result = await NerdGraphQuery.query( {query:rv2} );
    for (const property in result.data.actor.account) {
      if(property != '__typename') {
        data.push(
          {
            'eventType' : property,
            'count' : result.data.actor.account[property].results[0].count
          } 
        );
        _totalCount = _totalCount + result.data.actor.account[property].results[0].count; 
      }
    }
  } 
  const  _tableData =  [
    {
      metadata: {
        id: 'series-1',
        name: 'Serie 1',
        color: '#008c99',
        viz: 'main',
        columns: ['eventType', 'count'],
      } ,
      data: data
    }
  ];
  if(data.length > 0) {
    console.debug(">>>>> _totalCount: " + _totalCount);
    return {
     td:  _tableData,
     tc:  _totalCount
    }
  } else {
    return {
      td: [],
      tc: 0,
    }
  }

}

const _buildCountQuery = async anEvent => {
  const query = `SELECT COUNT(*) FROM \`${anEvent}\` `;
  return query;
};

const _buildGraphClause = async (theEvent, theQuery) => {
  const query = `${theEvent}: nrql(query: "${theQuery}") { 
    results 
  }
  `;
  return query;
};

const _nrqlQuery = async(query, accountId) => {
  return await NrqlQuery.query({query:query, accountId: accountId});
}

const _buildGraphQuery = async (accountId, queries) => {
  const rv = `{
      actor {
        account(id: ${accountId}) {
          ${queries}
        }
      }
    }
  `
  return rv;
}
  
/*
 * Helper function to turn timeRange into NRQL Since
 */
export const timeRangeToNrql = timeRange => {
  if (!timeRange) {
    return "";
  } else if (timeRange.begin_time && timeRange.end_time) {
    return ` SINCE ${timeRange.begin_time} UNTIL ${timeRange.end_time}`;
  } else if (timeRange.duration) {
    return ` SINCE ${timeRange.duration / 1000} SECONDS AGO`;
  }

  return "";
};


