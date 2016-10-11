var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleMechanic = require('role.mechanic');
var roleWorker = require('role.worker');
var roleMiner = require('role.miner');
var roleHauler = require('role.hauler');
var utils = require('utils');
var constants = require('constants');


module.exports.loop = function () {

    var mainSpawn = Game.spawns[constants.mainSpawnName];
    
    if (Game.time % 101 == 0) utils.cleanCreepMemory();
    
    var specs = utils.specs;
    
    // make sure haulers and miners are assigned
    if (Game.time % 11 == 0) {
        var jobCreeps = _.filter(Game.creeps, c => _.includes(['hauler', 'miner', 'upgrader'], c.memory.role));
        var jobs = utils.jobs;
        _.each(jobs, (j, id) => {
            j.id = id;
            j.creeps = [];
        });
        _.each(jobCreeps, c => {
            if (c.memory.jobId) {
                jobs[c.memory.jobId].creeps.push(c);
            }
        });
        var unassignedJobs = _.filter(jobs, j => j.creeps.length < j.spots);
        var unassignedCreeps = _.filter(jobCreeps, c => !c.memory.jobId);
        _.each(unassignedJobs, job => {
            var creep = _.find(unassignedCreeps, c => c.memory.role == job.role);
            if (creep) {
                creep.memory.jobId = job.id;
                _.pull(unassignedCreeps, creep);
            }
        })
    }
    
    // verifies that pop counts are not too high
    if (Game.time % 93 == 0) {
        // console.log('upgrading')
        var creepCounts = utils.getCreepCounts();
        _.each(creepCounts, (creepGroup, roleName) => {
            var spec = _.find(specs, c => c.role == roleName);
            var correctVersionNum = spec.version;
            // console.log(correctVersionNum);
            var obseleteCreep = _.find(creepGroup, c => c.memory.version === undefined || c.memory.version < correctVersionNum);
            if (!!obseleteCreep) {
                obseleteCreep.memory.onDeathRow = true;
                return false;
            }
        });
    }
    
    // maintains pop counts
    var creepCounts = utils.getCreepCounts();
    _.each(specs, spec => {
        if (!(spec.role in creepCounts) || creepCounts[spec.role].length < spec.count) {
            var parts = spec.parts;
            var mem = {role: spec.role, version: spec.version};
            var isSpawning = !!mainSpawn.spawning;
            var canPerformSpawn = mainSpawn.canCreateCreep(parts, mem) == OK;
            if (!isSpawning && canPerformSpawn) {
                mainSpawn.createCreep(parts, mem);
                return false;
            }
        }
    });
    
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'mechanic') {
            roleMechanic.run(creep);
        }
        if(creep.memory.role == 'worker') {
            roleWorker.run(creep);
        }
        if(creep.memory.role == 'miner') {
            roleMiner.run(creep);
        }
        if(creep.memory.role == 'hauler') {
            roleHauler.run(creep);
        }
    }
    
    // tower ai
    var towers = _.filter(Game.structures, s => s.structureType == STRUCTURE_TOWER);
    var hostileCreeps = Game.rooms['E63S52'].find(FIND_HOSTILE_CREEPS);
    _.each(towers, t => {
        if (hostileCreeps.length > 0) {
            var hostileCreep = hostileCreeps[0];
            t.attack(hostileCreep);
        }
    });
    
    // link ai - transfers when main is full and target is empty
    if (constants.mainLink && constants.upgradeLink) {
        var mainLink = Game.getObjectById(constants.mainLink);
        var upgradeLink = Game.getObjectById(constants.upgradeLink);
        // console.log(Game.getObjectById(constants.mainStorage));
        if (mainLink.cooldown == 0
                && mainLink.energy == mainLink.energyCapacity
                && upgradeLink.energy == 0
                && Game.getObjectById(constants.mainStorage).store[RESOURCE_ENERGY] > constants.linkTransferMainStorageThreshold) {
            mainLink.transferEnergy(upgradeLink);
        }
    }
    
    if (Game.time % 59 == 0) {
        console.log("************Creep Count************");
        var creepVersionCounts = _.groupBy(Game.creeps, c => c.memory.role + '-' + c.memory.version);
        _.each(creepVersionCounts, (creeps, modelId) => {
            console.log(modelId+": "+creeps.length);
        });
    }
    
}