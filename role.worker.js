var utils = require('utils');
var GenericRole = require('role.generic');
var constants = require('constants');

var WorkerRole = {

    /** @param {Creep} creep **/
    doStuff: function() {
        
        // console.log(creep.memory.working);
        if (!this.creep.memory.working && this.atFullEnergy()) {
            this.creep.memory.working = true;
            this.creep.say('working');
        } else if (this.creep.memory.working && this.atEmptyEnergy()) {
            this.creep.memory.working = false;
            this.creep.say('recharging');
        }
        // console.log(this.atFullEnergy(creep) + " " + this.atEmptyEnergy(creep) + " " + creep.memory.working);
        if (this.creep.memory.working) {
            if (this.storeEnergy()) {
                this.sayIntermittently('store');
                return;
            } else 
            if (this.buildSomething()) {
                this.sayIntermittently('build');
                return;
            } else if (this.upgradeSomething() && constants.canWorkersUpgrade) {
                this.sayIntermittently('upgrade');
                return;
            } else {
                this.idle();
                this.sayIntermittently('idle');
                return;
            }
        } else {
            this.recharge()
            // if (!this.recharge()) {
            //     this.idle();
            // }
        }
    }
};

module.exports = utils.extendClass(GenericRole, WorkerRole);