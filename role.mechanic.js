var utils = require('utils');
var GenericRole = require('role.generic');

var MechanicRole = {

    /** @param {Creep} creep **/
    doStuff: function() {
        
        if (this.creep.memory.repairing && this.atEmptyEnergy()) {
            this.creep.memory.repairing = false;
            this.creep.say('Recharging');
            // this.repairSomething(creep);
        } else if (!this.creep.memory.repairing && this.atFullEnergy()) {
            this.creep.memory.repairing = true;
            this.creep.say('Repairing');
        }
        
        if (this.creep.memory.repairing) {
            if (!this.repairSomething()) {
                this.idle();
                this.sayIntermittently('idle');
            } else {
                this.sayIntermittently('repairing');
            }
        } else {
            this.recharge();
            this.sayIntermittently('recharge');
        }
    }
};


module.exports = utils.extendClass(GenericRole, MechanicRole);