;
import {
    BaseTool
} from './BaseTool.js';

class BaseCreateTool extends BaseTool {
    constructor(undoRedoManager) {
        super();

        this.undoRedoManager = undoRedoManager;
    }

    activateTool(viewport) {}
    deactivateTool(viewport) {}


};

export {
    BaseTool
};