var specs = [
    {
        role: "miner",
        count: 4,
        // parts: [WORK,WORK,MOVE,CARRY], // 1
        parts: [WORK,WORK,WORK,WORK,MOVE,CARRY,CARRY], // 2
        // parts: [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,CARRY,MOVE], // 4
        version: 1,
    },
    {
        role: "hauler",
        count: 5,
        // parts: [CARRY,CARRY,MOVE,MOVE], // 1
        parts: [MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY], // 2
        // parts: [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], // 4
        // parts: [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], // 4 w/roads
        version: 1,
    },
    {
        role: "worker",
        count: 4,
        version: 1,
        parts: [WORK,WORK,MOVE,CARRY], // 1
        // parts: [WORK,WORK,CARRY,CARRY,MOVE,MOVE],
        // parts: [WORK,WORK,WORK,MOVE,MOVE,MOVE,CARRY,CARRY],
    },
    {
        role: "upgrader",
        count: 3,
        version: 1,
        // parts: [WORK,WORK,MOVE,CARRY], // 1
        // parts: [WORK,WORK,WORK,WORK,MOVE,CARRY,CARRY], // 2
        parts: [WORK,WORK,WORK,WORK,WORK,WORK,WORK,MOVE,CARRY], // 3
        // parts: [CARRY,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK], // 4
    },
    {
        role: "mechanic",
        count: 2,
        version: 1,
        parts: [WORK,MOVE,CARRY],
        // parts: [WORK,WORK,WORK,WORK,MOVE,CARRY,CARRY],
    },
];

module.exports = specs;