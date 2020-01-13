// This file copied from cloud-optimize

import { NrqlQuery, UserStorageQuery, UserStorageMutation, NerdGraphQuery } from 'nr1';
import gql from 'graphql-tag';
import { fakeTabledata } from './fake';
 
export const getCollection = async (collection) => {
    let result = await UserStorageQuery.query({ collection: collection })
    let collectionResult = (result || {}).data || []
    return collectionResult
}

export const writeDocument = async (collection, documentId, payload) => {
  let result = await UserStorageMutation.mutate({
                  actionType: UserStorageMutation.ACTION_TYPE.WRITE_DOCUMENT,
                  collection: collection,
                  documentId: documentId,
                  document: payload
                })
  return result
}

export const deleteDocument = async (collection, documentId) => {
  let result = await UserStorageMutation.mutate({
                  actionType: UserStorageMutation.ACTION_TYPE.DELETE_DOCUMENT,
                  collection: collection,
                  documentId: documentId
                })
  return result
}

export const accountsQuery = gql`{
  actor {
    accounts {
      id
      name
    }   
  }
}`

export const getInstanceData = (accountId) => {
  return gql`{
    actor {
      account(id: ${accountId}) {
        system: nrql(query: "FROM SystemSample SELECT  latest(timestamp) as 'timestamp', latest(providerAccountName) as 'providerAccountName', latest(coreCount) as 'numCpu', latest(memoryTotalBytes) as 'memTotalBytes', latest(operatingSystem) as 'operatingSystem', latest(ec2InstanceType) as 'ec2InstanceType', max(cpuPercent) as 'maxCpuPercent', max(memoryUsedBytes/memoryTotalBytes)*100 as 'maxMemoryPercent', latest(instanceType) as 'instanceType', latest(ec2InstanceType) as 'ec2InstanceType', latest(ec2InstanceId) as 'ec2InstanceId' FACET hostname, apmApplicationNames, entityGuid, awsRegion WHERE coreCount is not null and (instanceType is not null OR ec2InstanceType is not null) limit 2000 since 1 week ago", timeout: 30000) {
          results
        }
        network: nrql(query: "FROM NetworkSample SELECT latest(timestamp) as 'timestamp', max(receiveBytesPerSecond) as 'receiveBytesPerSecond', max(transmitBytesPerSecond) as 'transmitBytesPerSecond' FACET hostname, entityGuid, awsRegion, instanceType WHERE (instanceType is not null OR ec2InstanceType is not null) limit 2000 since 1 week ago", timeout: 30000) {
          results
        }
      }
    }
  }`
}

// don't use - here for example to me - Scott R - the following is a comment from creator (not me)
// Taken from Lew's nr1-container-explorer https://github.com/newrelic/nr1-container-explorer/
export const accountsWithData = async (eventType) => {
  const gql = `{actor {accounts {name id reportingEventTypes(filter:["${eventType}"])}}}`
  let result = await NerdGraphQuery.query({query: gql}) 
  if(result.errors) {
    console.log("Can't get reporting event types because NRDB is grumpy at NerdGraph.", result.errors)
    console.log(JSON.stringify(result.errors.slice(0, 5), 0, 2))
    return []
  }
  return result.data.actor.accounts.filter(a => a.reportingEventTypes.length > 0)
}

// ===============================
// my content below 
export const nativeEvents = [
  "AjaxRequest",
  "BrowserInteraction",
  "ErrorTrace",
  "InfrastructureEvent",
  "IntegrationError",
  "IntegrationProviderReport",
  "JavaScriptError",
  "Log",
  "Metric",
  "NetworkSample",
  "NginxSample",
  "NrAuditEvent",
  "NRUsageEvent",
  "NrDailyUsage",
  "NrIntegrationError",
  "NrUsage",
  "PageAction",
  "PageView",
  "PageView",
  "PageViewTiming",
  "PageViewTiming",
  "ProcessSample",
  "RedisKeyspaceSample",
  "RedisSample",
  "Relationship",
  "SampledTransaction",
  "SampledTransactionError",
  "Span",
  "Span",
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
  "TransactionTrace",
];

export async function getnTableDataV2(accountId) {
  await console.debug("-------- genTableDataV2 fired----------");
  await console.debug(accountId);
  let nrqlQueries = '';
  const rv = await _nrqlQuery('show event types', accountId);
  const allEvents = rv.data.chart[0].data[0].eventTypes;
  for(var i=0, n=allEvents.length; i < n; ++i) {
    let anEvent = allEvents[i];
    if(nativeEvents.indexOf(anEvent) == -1) {
      const query = await _buildCountQuery(anEvent);
      const nrqlClause = await _buildGraphClause(anEvent, query);
      nrqlQueries = nrqlQueries.concat(nrqlClause);
    }
  }
  const data = [];
  await console.debug("=========== here ============");
  let rv2 = await _buildGraphQuery(accountId, nrqlQueries);
  // await console.debug(nrqlQueries);
  // await console.debug(nrqlQueries.length);
  // await console.debug(rv2);
  if(nrqlQueries.length > 0 ) {
    let result = await NerdGraphQuery.query( {query:rv2} );
    await console.debug(JSON.stringify(result));
    await console.debug(JSON.stringify(result.data.actor.account));
    // await console.debug(JSON.stringify(result.data.actor.account));
    for (const property in result.data.actor.account) {
      if(property != '__typename') {
        console.debug(`${property}:  ${JSON.stringify(result.data.actor.account[property].results[0].count)}`);
        data.push(
          {
            'eventType' : property,
            'count' : result.data.actor.account[property].results[0].count
          } 
        );
      }
    }
    console.debug(JSON.stringify(data));
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
  return _tableData;
}

export async function genTableData(accountId) {
  return await getnTableDataV2(accountId);
  const data = [];
  const rv = await _nrqlQuery('show event types', accountId);
  const allEvents = rv.data.chart[0].data[0].eventTypes;
  await console.debug("-------- genTableData fired----------");
  await console.debug(accountId);
  for(var i=0, n=allEvents.length; i < n; ++i) {
    let anEvent = allEvents[i];
    // console.log(anEvent);
    if(nativeEvents.indexOf(anEvent) == -1) {
      // console.log("Found custom event");
      const query = await _buildCountQuery(anEvent);
      const rv = await _nrqlQuery(query, accountId);
      let count = rv.data.chart[0].data[0].y;
      data.push(
        {
          'eventType' : anEvent,
          'count' : count
        } 
      )
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
  // await console.debug(_tableData);
  await console.debug(" <<<<<< returning");
  return _tableData;
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
  

