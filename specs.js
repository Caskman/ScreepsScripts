var specs = [
    {
        role: "miner",
        count: 4,
        parts: [WORK,WORK,WORK,WORK,MOVE,CARRY],
        version: 1,
    },
    {
        role: "hauler",
        count: 3,
        parts: [MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY],
        version: 1,
    },
    {
        role: "worker",
        count: 4,
        parts: [WORK,WORK,WORK,MOVE,MOVE,MOVE,CARRY,CARRY],
        version: 5,
        // parts: [WORK,MOVE,CARRY],
        // parts: [WORK,WORK,CARRY,CARRY,MOVE,MOVE],
    },
    {
        role: "upgrader",
        count: 1,
        version: 1,
        // parts: [WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,CARRY,CARRY],
        parts: [WORK,MOVE,CARRY],
    },
    {
        role: "mechanic",
        count: 1,
        version: 1,
        // parts: [WORK,WORK,WORK,WORK,MOVE,CARRY,CARRY],
        parts: [WORK,MOVE,CARRY],
    },
];

module.exports = specs;