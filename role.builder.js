var utils = require('utils');
var GenericRole = require('role.generic');

var BuilderRole = {

    /** @param {Creep} creep **/
    doStuff: function() {

        if(this.creep.memory.building && this.creep.carry.energy == 0) {
            this.creep.memory.building = false;
            this.creep.say('recharging');
        }
        if(!this.creep.memory.building && this.creep.carry.energy == this.creep.carryCapacity) {
            this.creep.memory.building = true;
            this.creep.say('building');
        }
        
        if (this.creep.memory.building) {
            this.buildSomething();
        } else {
            this.recharge();
        }
    }
};


module.exports = utils.extendClass(GenericRole, BuilderRole);