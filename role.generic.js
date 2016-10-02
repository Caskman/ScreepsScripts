var constants = require('constants');


var GenericRole = {
    creep: null,
    setCreep: function(creep) {
        this.creep = creep;
    },
    run: function(creep) {
        this.setCreep(creep);
        if (this.onDeathRow()) {
            this.commitSuicide();
        } else {
            this.doStuff();
        }
    },
    onDeathRow: function() {
        return !!this.creep.memory.onDeathRow;
    },
    commitSuicide: function() {
        var spawn = Game.spawns[constants.mainSpawnName];
        if (this.creep.pos.getRangeTo(spawn) < 5) {
            this.creep.suicide();
            this.sayIntermittently('suicide');
        } else {
            this.creep.moveTo(spawn);
        }
    },
    atFullEnergy: function() {
        return this.creep.carry.energy == this.creep.carryCapacity;
    },
    atEmptyEnergy: function() {
        return this.creep.carry.energy == 0;
    },
    recharge: function() {
        var storageOptions = _.map(constants.energyStorage, id => Game.getObjectById(id));
        storageOptions = _.filter(storageOptions, s => s.store[RESOURCE_ENERGY] > 0);
        storageOptions = _.sortBy(storageOptions, s => s.store[RESOURCE_ENERGY]);
        
        if (storageOptions.length > 0) {
            var storage = storageOptions[0];
            if (this.creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(storage);
            }
            return true;
        } else {
            if (constants.canHarvestForRecharging) {
                return this.harvest();
            } else {
                return false;
            }
        }
    },
    harvest: function() {
        var sources = this.creep.room.find(FIND_SOURCES);
        if(this.creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
            this.creep.moveTo(sources[0]);
        }
    },
    buildSomething: function() {
        var targets = this.creep.room.find(FIND_CONSTRUCTION_SITES);
        // console.log(targets.length);
        if(targets.length) {
            var buildCode = this.creep.build(targets[0]);
            // console.log(buildCode);
            if(buildCode == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(targets[0]);
            }
            return true;
        }
        return false;
    },
    structHasAvailCap: function(struct) {
        if (struct.structureType == STRUCTURE_SPAWN
            || struct.structureType == STRUCTURE_EXTENSION) {
            return struct.energy < struct.energyCapacity;
        } else if (struct.structureType == STRUCTURE_CONTAINER
            || struct.structureType == STRUCTURE_STORAGE) {
            return struct.store[RESOURCE_ENERGY] < struct.storeCapacity;
        }
    },
    getStructureEnergyLevel: function(struct) {
        if (struct.structureType == STRUCTURE_SPAWN
            || struct.structureType == STRUCTURE_EXTENSION) {
            return struct.energy;
        } else if (struct.structureType == STRUCTURE_CONTAINER
            || struct.structureType == STRUCTURE_STORAGE) {
            return struct.store[RESOURCE_ENERGY];
        }
    },
    storeEnergy: function() {
        var targets = this.creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return _.includes([
                        STRUCTURE_EXTENSION,
                        // STRUCTURE_CONTAINER,
                        STRUCTURE_SPAWN,
                    ], structure.structureType) && this.structHasAvailCap(structure);
                }
        });
        var priorities = {
            STRUCTURE_EXTENSION: 0,
            STRUCTURE_SPAWN: 1,
            STRUCTURE_CONTAINER: 2,
        };
        var markedTargets = _.map(targets, t => {
            t.caskLevel = priorities[t.structureType];
            return t;
        });
        targets = markedTargets.sort((a, b) => {
            if (a.structureType == b.structureType) {
                return this.getStructureEnergyLevel(a) - this.getStructureEnergyLevel(b);
            } else {
                return a.caskLevel - b.caskLevel;
            }
        });
        // console.log(targets.length);
        if(targets.length > 0) {
            if(this.creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(targets[0]);
            }
            return true;
        } else {
            return false;
        }
    },
    repairSomething: function() {
        var targets = this.creep.room.find(FIND_STRUCTURES, {
            filter: struct => {
                return _.includes([
                    STRUCTURE_ROAD,
                    STRUCTURE_CONTAINER,
                ], struct.structureType) && struct.ticksToDecay < 100;
            }
        });
        // console.log(targets.length);
        if (targets.length > 0) {
            var target = targets[0];
            var repairCode = this.creep.repair(target);
            // console.log(repairCode);
            if (repairCode == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(target);
            }
            return true;
        }
        return false;
    },
    upgradeSomething: function() {
        if(this.creep.upgradeController(this.creep.room.controller) == ERR_NOT_IN_RANGE) {
            this.creep.moveTo(this.creep.room.controller);
        }
        return true;
    },
    idle: function() {
        var idleLoc = constants.idleLocation;
        this.creep.moveTo(idleLoc[0],idleLoc[1]);
    },
    sayIntermittently: function(msg) {
        if (Game.time % 10 == 0) this.creep.say(msg);
    },
};


module.exports = GenericRole;