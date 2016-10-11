
module.exports = {
    "main-source": {
        role: "miner",
        sourceId: "57ef9e8f86f108ae6e60f791",
        depotId: "57f3cdf7904e9c5270ba5a0c",
        spots: 2,
    },
    "west-source": {
        role: "miner",
        sourceId: "57ef9e8f86f108ae6e60f792",
        depotId: "57f403f18b44ac277fdb2cea",
        spots: 2,
    },
    "main-upgrade": {
        role: "upgrader",
        depotId: "57fc3b7fea447086341d6057",
        controllerId: "57ef9e8f86f108ae6e60f790",
        spots: 3,
    },
    "central-haul": {
        role: "hauler",
        originId: "57f3cdf7904e9c5270ba5a0c",
        destIds: ["57f59e4edd67a2e74287fa84"],
        withDrawThreshold: 0,
        spots: 1,
    },
    "west-haul": {
        role: "hauler",
        originId: "57f403f18b44ac277fdb2cea",
        destIds: ["57f59e4edd67a2e74287fa84"],
        withDrawThreshold: 0,
        spots: 3,
    },
    // "ctrl-upgrade-haul": {
    //     role: "hauler",
    //     originId: "57f59e4edd67a2e74287fa84",
    //     destIds: ["57f3e3016cf1470e6740d811"],
    //     withDrawThreshold: 5000,
    //     spots: 1,
    // },
    "main-tower-haul": { // also used to store in the link
        role: "hauler",
        originId: "57f59e4edd67a2e74287fa84",
        destIds: [
            "57f4eea7692f33584d2be148",
            "57fc3e6e7689f8f859946714",
        ],
        withDrawThreshold: 0,
        spots: 1,
    },
    "spawn-caretaker": {
        role: "hauler",
        originId: "57f59e4edd67a2e74287fa84",
        destIds: [STRUCTURE_SPAWN],
        withDrawThreshold: 0,
        spots: 1,
    },
};