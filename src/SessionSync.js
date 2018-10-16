
import { VisualiveSession } from '@visualive/collab';
import UndoRedoManager from './undoredo/UndoRedoManager.js';
import Avatar from './Avatar.js';

const convertValuesToJSON = (value) => {
    if (value == undefined) {
        return undefined;
    } else if (value.toJSON) {
        const result = value.toJSON();
        result.className = value.constructor.name;
        return result;
    } else if (Array.isArray(value)) {
        const arr = [];
        for (const element of value)
            arr.push(convertValuesToJSON(element));
        return arr;
    } else if (typeof value === "object") {
        const dict = {};
        for (let key in value)
            dict[key] = convertValuesToJSON(value[key]);
        return dict;
    } else {
        return value;
    }
}

const convertValuesFromJSON = (value) => {
    if (value == undefined) {
        return undefined;
    } else if (value.className) {
        const newval = Visualive.typeRegistry.getType(value.className).create();
        newval.fromJSON(value);
        return newval;
    } else if (Array.isArray(value)) {
        const arr = [];
        for (const element of value)
            arr.push(convertValuesFromJSON(element));
        return arr;
    } else if (typeof value === "object") {
        const dict = {};
        for (let key in value)
            dict[key] = convertValuesFromJSON(value[key]);
        return dict;
    } else {
        return value;
    }
}
export default class SessionSync {
  constructor(visualiveSession, appData, userId) {

    const usersData = {};

    visualiveSession.sub(VisualiveSession.actions.USER_JOINED, message => {
      usersData[message.userId] = {
        undoRedoManager: new UndoRedoManager(),
        avatar: new Avatar(userdata)
      }
    })

    visualiveSession.sub(VisualiveSession.actions.USER_LEFT, message => {
      usersData[message.userId].avatar.destroy();
      delete usersData[message.userId];
    })

    /////////////////////////////////////////////
    // Pose Changes

    // const myAvatar = new Avatar(appData.scene.getResourceLoader(), appData.scene.getRoot(), { userId });

    appData.renderer.viewChanged.connect((data) => {
      const j = convertValuesToJSON(data);
      visualiveSession.pub(VisualiveSession.actions.POSE_CHANGED, j);

      // const data2 = convertValuesFromJSON(j);
      // myAvatar.updatePose(data2);
    });

    visualiveSession.sub(VisualiveSession.actions.POSE_CHANGED, (j, userId) =>{
      const data = convertValuesFromJSON(j);
      const avatar = usersData[userId].avatar;
      avatar.updatePose(data);
    })


    /////////////////////////////////////////////
    // Scene Changes

    appData.undoRedoManager.changeAdded.connect((change)=>{
      visualiveSession.pub(VisualiveSession.actions.CHANGE_ADDED, {
        changeData: change.toJSON(),
        changeClass: change.constructor.name
      })
    })

    appData.undoRedoManager.changeUpdated.connect((data)=>{
      visualiveSession.pub(VisualiveSession.actions.CHANGE_UPDATED, convertValuesToJSON(data))
    })

    visualiveSession.sub(VisualiveSession.actions.CHANGE_ADDED, data =>{
      const undoRedoManager = usersData[data.userId].undoRedoManager;
      const change = undoRedoManager.constructChange(data.changeClass);
      change.fromJSON(data.changeData, appData.scene)
      undoRedoManager.addChange(change);
    })

    visualiveSession.sub("CHANGE_UPDATED", data =>{
      const undoRedoManager = usersData[data.userId].undoRedoManager;
      undoRedoManager.changeFromJSON(data.changeData);
    })

  }
}


