var utils = require('utils');
var GenericRole = require('role.generic');

var HaulerRole = {

    /** @param {Creep} creep **/
    doStuff: function() {
        if (!this.creep.memory.jobId) {
            this.sayIntermittently('unassigned');
            return;
        }
        
        if (this.creep.memory.hauling && this.atFullEnergy()) {
            this.creep.memory.hauling = false;
        } else if (!this.creep.memory.hauling && this.atEmptyEnergy()) {
            this.creep.memory.hauling = true;
        }
        
        var job = utils.getJob(this.creep.memory.jobId);
        if (this.creep.memory.hauling) {
            var origin = utils.getGameObj(job.originId);
            if (this.creep.withdraw(origin, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(origin);
            }
        } else {
            var dest = utils.getGameObj(job.destId);
            if (this.creep.transfer(dest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(dest);
            }
        }
    }
};

module.exports = utils.extendClass(GenericRole, HaulerRole);