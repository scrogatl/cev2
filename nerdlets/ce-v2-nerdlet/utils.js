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

// don't use - here for example to me - Scott R
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
  "Log",
  "Metric",
  "NetworkSample",
  "NginxSample",
  "NrAuditEvent",
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

export const getCustomEventList = async (accountId) => {
  let  tableData =  [
    {
      metaData: {
      id: 's1',
      name: 'Series 1',
      color: '#008c99',
      viz: 'main',
      columns: ['eventType', 'count'],
    } ,
    data: data
  }
];
  const customEventList = await _getCustomEventList(accountId);
  const customEventsWithCounts = await _getCounts(customEventList, accountId);
  const data = await _buildTableDataBody(customEventsWithCounts);
  tableData.data = data;
  console.debug("ZZ.1========");
  console.debug(tableData);
  console.debug("ZZ.1========");
  return(tableData);
}

const _getCustomEventList = async (accountId) => {
      console.log("ZZ.2 _getCustomEveList accountId: " + accountId );
      const query = 'show event types';
      let rv = await _nrqlQuery(query, accountId);
      const allEvents = rv.data.chart[0].data[0].eventTypes;
      let customEvents = [];
      allEvents.forEach(element => {
            var index = nativeEvents.indexOf(element);
            if(index == -1 ) {
                // console.log("Custom event found: " + element);
                customEvents.push(element);
            }
      });
  return customEvents;
}

async function _buildTableDataBody(counts) {
  const listOfObjects = [];
  for (let key of counts.keys()) {
    console.log(key + " : " + counts.get(key));
    let singleObject = {};
    singleObject = { 
      eventType: key,
      count: counts.get(key)
    };
    listOfObjects.push(singleObject);
  }
  console.log("ZZ.2 listOfObjects: " + JSON.stringify(listOfObjects));
  return (listOfObjects);
}

async function _buildTableDataBodyString(counts) {
  let rv = '';
  for (let key of counts.keys()) {
    console.log(key + " : " + counts.get(key));
    rv += "{ \"eventType\": \"" + key + "\" ," + "\"count\" : " + counts.get(key) + " } , ";
  }
  console.log("rv: " + rv);
  return (rv);
}

async function _getCounts(customEvents, accountId) {
  let customEventMap = new Map();
  for (let event of customEvents) {
    const query = _buildCountQuery(event);
    let rv = await _nrqlQuery(query, accountId);
    let count = rv.data.chart[0].data[0].y;
    customEventMap.set(event, count);
  }
  return customEventMap;
}

const _buildCountQuery = eventName => {
  const query = `SELECT COUNT(*) FROM \`${eventName}\` SINCE 1 DAY AGO`;
  return query;
};

const _nrqlQuery = async(query, accountId) => {
  return await NrqlQuery.query({query:query, accountId: accountId});
}

export const tableMetaData = [
  {
    metadata: {
      id: 'series-1',
      name: 'Serie 1',
      color: '#008c99',
      viz: 'main',
      columns: ['eventType', 'count'],
    },
  }
];
  

