var utils = require('utils');
var GenericRole = require('role.generic');

var UpgraderRole = {

    /** @param {Creep} creep **/
    doStuff: function() {
        
        if (this.creep.memory.upgrading && this.atEmptyEnergy()) {
            this.creep.memory.upgrading = false;
            this.creep.say('recharging');
        } else if (!this.creep.memory.upgrading && this.atFullEnergy()) {
            this.creep.memory.upgrading = true;
            this.creep.say('upgrading');
        }
        
        if (this.creep.memory.upgrading) {
            if(this.creep.upgradeController(this.creep.room.controller) == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(this.creep.room.controller);
            }
        } else {
            this.recharge();
        }
    }
};


module.exports = utils.extendClass(GenericRole, UpgraderRole);
