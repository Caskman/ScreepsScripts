var utils = require('utils');
var GenericRole = require('role.generic');

var MinerRole = {

    /** @param {Creep} creep **/
    doStuff: function() {
        if (!this.creep.memory.jobId) {
            this.sayIntermittently('unassigned');
            return;
        }
        
        if (this.creep.memory.mining && this.atFullEnergy()) {
            this.creep.memory.mining = false;
            this.creep.say('dumping');
        } else if (!this.creep.memory.mining && this.atEmptyEnergy()) {
            this.creep.memory.mining = true;
            this.creep.say('mining');
        }
        
        var job = utils.getJob(this.creep.memory.jobId);
        if (this.creep.memory.mining) {
            var source = utils.getGameObj(job.sourceId);
            if (this.creep.harvest(source) == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(source);
            }
            this.sayIntermittently('mining');
        } else {
            var depot = utils.getGameObj(job.depotId);
            var transferCode
            if (this.creep.transfer(depot, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(depot);
            }
            this.sayIntermittently('dumping');
        }
    }
};

module.exports = utils.extendClass(GenericRole, MinerRole);