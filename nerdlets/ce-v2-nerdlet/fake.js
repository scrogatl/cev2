export const fakeData = {
    "Agent Revival" : "89,509", 
    "Agent Shutdown" : "32905827",
    "AgentAdoption" : "76"
}


export const fakeTabledata = [
    {
        metadata: {
            id: 'series-1',
            name: 'Serie 1',
            color: '#008c99',
            viz: 'main',
            columns: ['eventType', 'count'],
        },
       data: [
            {
                eventType: 'Agent Revival',
                count: 89521,
            },
            {
                eventType: 'Agent Shutdown ',
                count: 32905762,
            },
            {
                eventType: 'AgentAdoption',
                count: 76,
            },
            {
                eventType: 'AgentAdoptionSummary',
                count: 8,
            },
            {
                eventType: 'AgentAdoptionSummaryV2',
                count: 22,
            },
            {
                eventType: 'AgentLifecycle',
                count: 82325789,
            },
        ],
    },
];
