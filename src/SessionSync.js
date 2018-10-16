
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

export default class SessionSync {
  constructor(visualiveSession, appData) {

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

    // appData.scene.poseChanged.connect((data)=>{
    //   visualiveSession.pub("POSE_CHANGED", data)
    // })

    // visualiveSession.sub("POSE_CHANGED", data =>{
    //   const avatar = usersData[data.userId].avatar;
    //   avatar.updatePose(data.pose);
    // })


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


