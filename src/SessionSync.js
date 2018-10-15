

import UndoRedoManager from './undoredo/UndoRedoManager.js';

export default class SessionSync {
  constructor(collab, appData) {

    const usersData = {};

    collab.userJoined(userdata => {
      usersData[userdata.id] = {
        undoRedoManager: new UndoRedoManager()
      }
    })

    collab.userLeft(userdata => {
      usersData[userdata.id] = {
        undoRedoManager: new UndoRedoManager(),
        avatar: new Avatar()
      }
    })

    /////////////////////////////////////////////
    // Pose Changes

    appData.scene.poseChanged.connect((data)=>{
      collab.pub("POSE_CHANGED", data)
    })

    collab.sub("POSE_CHANGED", data =>{
      const avatar = usersData[data.userId].avatar;
      avatar.updatePose(data.pose);
    })


    /////////////////////////////////////////////
    // Scene Changes

    appData.undoRedoManager.changeAdded.connect((data)=>{
      collab.pub("CHANGE_ADDED", data)
    })

    appData.undoRedoManager.changeUpdated.connect((data)=>{
      collab.pub("CHANGE_UPDATED", data)
    })

    collab.sub("CHANGE_ADDED", data =>{
      const undoRedoManager = usersData[data.userId].undoRedoManager;
      const change = undoRedoManager.constructChange(data.changeClass);
      change.fromJSON(data.changeData, appData.scene)
      undoRedoManager.addChange(change);
    })

    collab.sub("CHANGE_UPDATED", data =>{
      const undoRedoManager = usersData[data.userId].undoRedoManager;
      undoRedoManager.updateChange(data.changeData);
    })


  }

}


