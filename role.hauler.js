var utils = require('utils');
var GenericRole = require('role.generic');

var HaulerRole = {

    /** @param {Creep} creep **/
    doStuff: function() {
        if (!this.creep.memory.jobId) {
            this.sayIntermittently('unassigned');
            return;
        }
        
        if (this.creep.memory.hauling && this.atEmptyEnergy()) {
            this.creep.memory.hauling = false;
        } else if (!this.creep.memory.hauling && this.atFullEnergy()) {
            this.creep.memory.hauling = true;
        }
        
        var job = utils.getJob(this.creep.memory.jobId);
        if (this.creep.memory.hauling) {
            var dest = null;
            // this.debug(job.destIds.length);
            _.each(job.destIds, id => {
                var struct = null;
                if (id == STRUCTURE_SPAWN) {
                    struct = this.getSpawnStorageTarget();
                    // this.debug("spawn");
                } else {
                    struct = Game.getObjectById(id);
                    // this.debug("struct");
                }
                // this.debug(struct);
                this.debug(struct.structureType);
                if (this.structIsFull(struct)) {
                    return true;
                } else {
                    dest = struct;
                    return false;
                }
            });
            // this.debug(dest);
            if (this.creep.transfer(dest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(dest);
            }
        } else {
            var origin = utils.getGameObj(job.originId);
            var threshold = job.withDrawThreshold;
            if (origin.store[RESOURCE_ENERGY] > threshold + this.creep.carryCapacity && this.creep.withdraw(origin, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(origin);
            }
        }
    }
};

module.exports = utils.extendClass(GenericRole, HaulerRole);