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
        // storageOptions = _.sortBy(storageOptions, s => s.store[RESOURCE_ENERGY]);
        
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
        
        if(targets.length) {
            var buildCode = this.creep.build(targets[0]);
            
            if(buildCode == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(targets[0]);
            }
            return true;
        }
        return false;
    },
    getStructEnergy: function(struct) {
        if (struct.structureType == STRUCTURE_CONTAINER
            || struct.structureType == STRUCTURE_STORAGE) {
            return struct.store[RESOURCE_ENERGY];
        } else {
            return struct.energy;
        }
    },
    getStructEnergyCapacity: function(struct) { // DOESN'T COUNT FOR MINERALS -- BUG ALERT
        if (struct.structureType == STRUCTURE_CONTAINER
            || struct.structureType == STRUCTURE_STORAGE) {
            return struct.storeCapacity;
        } else {
            return struct.energyCapacity;
        }
    },
    structHasAvailCap: function(struct) {
        return this.getStructEnergy(struct) < this.getStructEnergyCapacity(struct);
    },
    structIsFull: function(struct) {
        return this.getStructEnergy(struct) == this.getStructEnergyCapacity(struct);
    },
    getStructureEnergyLevel: function(struct) {
        return getStructEnergy(struct);
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
        targets = _.sortBy(targets, t => this.creep.pos.getRangeTo(t));

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
                ], struct.structureType) && (struct.hits / struct.hitsMax) < .75;
            }
        });
        targets = _.sortBy(targets, [s => struct.hits / struct.hitsMax]);
        
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
    findRepairTarget: function() {
        var targets = this.creep.room.find(FIND_STRUCTURES, {
            filter: struct => {
                return _.includes([
                    STRUCTURE_ROAD,
                    STRUCTURE_CONTAINER,
                    // STRUCTURE_WALL,
                ], struct.structureType) && (struct.hits / struct.hitsMax) < .75;
            }
        });
        targets = _.sortBy(targets, [s => struct.hits / struct.hitsMax]);
        return targets[0];
    },
    upgradeSomething: function() {
        if(this.creep.upgradeController(this.creep.room.controller) == ERR_NOT_IN_RANGE) {
            this.creep.moveTo(this.creep.room.controller);
        }
        return true;
    },
    getSpawnStorageTarget: function() {
        var targets = this.creep.room.find(FIND_STRUCTURES, {
            filter: s => {
                return _.includes([
                    STRUCTURE_EXTENSION,
                    STRUCTURE_SPAWN,
                ], s.structureType) && s.energy < s.energyCapacity;
            }
        });
        targets = _.sortBy(targets, s => this.creep.pos.getRangeTo(s));
        return targets[0];
    },
    buildWalls: function() {
        var targets = this.creep.room.find(FIND_STRUCTURES, {
            filter: s => s.structureType == STRUCTURE_WALL && s.hits < 500,
        });
        targets = _.sortBy(targets, w => w.hits);
        // console.log(targets.length);
        var target = targets[0];
        if (target) {
            if (this.creep.repair(target) == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(target);
            }
            return true;
        } else {
            return false;
        }
    },
    idle: function() {
        var idleLoc = constants.idleLocation;
        var x = idleLoc[0];
        var y = idleLoc[1];
        this.creep.moveTo(x, y);
    },
    sayIntermittently: function(msg) {
        if (Game.time % 10 == 0 && constants.sayIntermittentlyYN) this.creep.say(msg);
    },
    say: function(msg) {
        if (constants.sayYN) {
            this.creep.say(msg);
        }
    },
    debug: function(obj) {
        this.creep.memory.debug = obj;
    },
};


module.exports = GenericRole;