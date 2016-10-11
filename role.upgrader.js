var utils = require('utils');
var GenericRole = require('role.generic');

var UpgraderRole = {

    /** @param {Creep} creep **/
    doStuff: function() {
        if (!this.creep.memory.jobId) {
            this.sayIntermittently('unassigned');
            return;
        }
        
        if (this.creep.memory.upgrading && this.atEmptyEnergy()) {
            this.creep.memory.upgrading = false;
            this.say('recharging');
        } else if (!this.creep.memory.upgrading && !this.atEmptyEnergy()) {
            this.creep.memory.upgrading = true;
            this.say('upgrading');
        }
        
        var job = utils.getJob(this.creep.memory.jobId);
        if (this.creep.memory.upgrading) {
            var ctrl = utils.getGameObj(job.controllerId);
            if (this.creep.upgradeController(ctrl) == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(ctrl);
            }
            this.sayIntermittently('upgrading');
        } else {
            var depot = utils.getGameObj(job.depotId);
            if (this.creep.withdraw(depot, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(depot);
            }
            this.sayIntermittently('recharging');
        }
    }
};


module.exports = utils.extendClass(GenericRole, UpgraderRole);
