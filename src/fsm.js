class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if (config === undefined) throw new Error("Config is not defined.");
        this.config = config;
        this.clearHistory();
        this.state = config.initial;
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.state;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if (this.config.states[state] === undefined) throw new Error("State '" + state + "' doesnt exist.");
        this.clearUndoHistory();
        this.history.push(this.state);
        this.state = state;
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        let newState = this.config.states[this.state].transitions[event];
        if (newState === undefined) throw new Error("Cannot trigger event '" + event + "' for state '" + this.state + "'.");
        this.clearUndoHistory();
        this.changeState(newState);
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.changeState(this.config.initial);
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        if (event === undefined) {
            return forInToArr(this.config.states);
        } else {
            let result = [];
            for (let state in this.config.states){
                if (this.config.states[state].transitions[event] !== undefined ){
                    result.push(state);
                }
            }
            return result;
        }
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if (this.history.length === 0) return false;
        this.undoHistory.push(this.state);
        this.state = this.history.pop();
        return true;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if (this.undoHistory.length === 0) return false;
        this.history.push(this.state);
        this.state = this.undoHistory.pop();
        return true;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.history = [];
        this.clearUndoHistory();
    }

    clearUndoHistory() {
        this.undoHistory = [];
    }
}

module.exports = FSM;

function forInToArr(object){
    let result = [];
    for (let part in object){
        result.push(part);
    }
    return result;
}

function forOfToArr(object){
    let result = [];
    for (let part of object){
        result.push(part);
    }
    return result;
}

/** @Created by Uladzimir Halushka **/
