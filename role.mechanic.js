var utils = require('utils');
var GenericRole = require('role.generic');

var MechanicRole = {

    /** @param {Creep} creep **/
    doStuff: function() {
        
        if (this.creep.memory.repairing && this.atEmptyEnergy()) {
            this.creep.memory.repairing = false;
            this.say('Recharging');
            // this.repairSomething(creep);
        } else if (!this.creep.memory.repairing && this.atFullEnergy()) {
            this.creep.memory.repairing = true;
            this.say('Repairing');
        }
        
        if (this.creep.memory.repairing) {
            var target = null;
            if (this.creep.memory.targetId) {
                target = Game.getObjectById(this.creep.memory.targetId);
            }
            if (!target || target.hits / target.hitsMax >= .9) {
                target = this.findRepairTarget();
                if (target) {
                    this.creep.memory.targetId = target.id;
                }
            }
            if (target) {
                if (this.creep.repair(target) == ERR_NOT_IN_RANGE)  {
                    this.creep.moveTo(target);
                }
                this.sayIntermittently('repairing');
            }
        } else {
            this.recharge();
            this.sayIntermittently('recharge');
        }
    }
};


module.exports = utils.extendClass(GenericRole, MechanicRole);