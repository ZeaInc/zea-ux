import {
  VisualiveSession
} from '@visualive/collab';
import UndoRedoManager from './undoredo/UndoRedoManager.js';
import Avatar from './Avatar.js';

const convertValuesToJSON = (value) => {
  if (value == undefined) {
    return undefined;
  } else if (value.toJSON) {
    const result = value.toJSON();
    result.typeName = Visualive.typeRegistry.getTypeName(value);
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
  } else if (value.typeName) {
    const newval = Visualive.typeRegistry.getType(value.typeName).create();
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

    const userDatas = {};

    const setupUser = (userData) => {
      if (!(userData.id in userDatas)) {
        userDatas[userData.id] = {
          undoRedoManager: new UndoRedoManager(),
          avatar: new Avatar(appData.scene, appData.scene.getRoot(), userData)
        }
      }
    }

    visualiveSession.sub(VisualiveSession.actions.USER_JOINED, setupUser)
    visualiveSession.sub(VisualiveSession.actions.USER_LEFT, userData => {
      if (!userDatas[userId]) {
        console.warn("User id not in session:", userId);
        return;
      }
      userDatas[userData.id].avatar.destroy();
      delete userDatas[userData.id];
    })

    /////////////////////////////////////////////
    // Pose Changes

    // const myAvatar = new Avatar(appData.scene, appData.scene.getRoot(), { userId });

    appData.renderer.viewChanged.connect((data) => {

      const controllers = data.controllers;
      if(controllers)
        delete data.controllers;

      const j = convertValuesToJSON(data);

      if(controllers){
        const controllerXfos = [];
        for (let controller of data.controllers) {
          controllerXfos.push({
              xfo: controller.getTreeItem().getGlobalXfo().toJSON()
          });
        }
        j.controllers = controllerXfos;
      }

      visualiveSession.pub(VisualiveSession.actions.POSE_CHANGED, j);

      // const data2 = convertValuesFromJSON(j);
      // myAvatar.updatePose(data2);
    });

    visualiveSession.sub(VisualiveSession.actions.POSE_CHANGED, (j, userId) => {
      if (!userDatas[userId]) {
        console.warn("User id not in session:", userId);
        return;
      }
      const data = convertValuesFromJSON(j);
      const avatar = userDatas[userId].avatar;
      avatar.updatePose(data);
    })


    /////////////////////////////////////////////
    // Scene Changes

    appData.undoRedoManager.changeAdded.connect((change) => {
      visualiveSession.pub(VisualiveSession.actions.COMMAND_ADDED, {
        changeData: change.toJSON(),
        changeClass: change.constructor.name
      })
    })

    appData.undoRedoManager.changeUpdated.connect((data) => {
      visualiveSession.pub(VisualiveSession.actions.COMMAND_UPDATED, convertValuesToJSON(data))
    })

    visualiveSession.sub(VisualiveSession.actions.COMMAND_ADDED, (data, userId) => {
      if (!userDatas[userId]) {
        console.warn("User id not in session:", userId);
        return;
      }
      const undoRedoManager = userDatas[userId].undoRedoManager;
      const change = undoRedoManager.constructChange(data.changeClass);
      change.fromJSON(data.changeData, appData.scene.getRoot())
      undoRedoManager.addChange(change);
    })

    visualiveSession.sub(VisualiveSession.actions.COMMAND_UPDATED, (data, userId) => {
      if (!userDatas[userId]) {
        console.warn("User id not in session:", userId);
        return;
      }
      const undoRedoManager = userDatas[userId].undoRedoManager;
      const changeData = convertValuesFromJSON(data);
      undoRedoManager.updateChange(changeData);
    })

  }
}