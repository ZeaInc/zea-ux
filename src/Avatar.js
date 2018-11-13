// import * as Visualive from '@visualive/engine';

const up = new Visualive.Vec3(0, 0, 1);
export default class Avatar {

  constructor(appData, userData, currentUserAvatar=false) {
    this.__appData = appData;
    this.__userData = userData;
    this.__currentUserAvatar = currentUserAvatar;

    this.__treeItem = new Visualive.TreeItem(userData.id);
    this.__treeItem.addRef(this);
    this.__appData.renderer.getCollector().addTreeItem(this.__treeItem);

    this.__avatarColor = new Visualive.Color(this.__userData.metadata.avatarColor);
    this.__hilightPointerColor = new Visualive.Color(1.2, 0, 0);

    this.__material = new Visualive.Material('user' + userData.id + 'Material', 'SimpleSurfaceShader');
    this.__material.getParameter('BaseColor').setValue(this.__avatarColor);
    this.__material.addRef(this);
    this.__plane = new Visualive.Plane(1, 1)

    if(!this.__currentUserAvatar) {
      this.__camera = new Visualive.Camera();
      this.__camera.addRef(this);
      this.__cameraBound = false;

      this.__avatarImage = new Visualive.LDRImage('user' + userData.id + 'AvatarImage');
      this.__avatarImage.setImageURL(userData.picture)
      this.__avatarImageMaterial = new Visualive.Material('user' + userData.id + 'AvatarImageMaterial', 'FlatSurfaceShader');
      this.__avatarImageMaterial.getParameter('BaseColor').setValue(this.__avatarColor);
      this.__avatarImageMaterial.getParameter('BaseColor').setImage(this.__avatarImage);
      this.__avatarImageGeomItem = new Visualive.GeomItem('avatarImage', new Visualive.Disc(0.5, 64), this.__avatarImageMaterial);

      this.__avatarImageXfo = new Visualive.Xfo();
      this.__avatarImageXfo.sc.set(0.2, 0.2, 1);
      this.__avatarImageGeomItem.setLocalXfo(this.__avatarImageXfo);

      this.__avatarImageGeomItem.addRef(this);
    }

    this.setCameraAndPointerRepresentation()
  }

  setRTCStream(rtcData) {
    if(rtcData.video && !this.__videoItem) {
      this.__videoItem = new Visualive.VideoStreamImage2D('webcamStream');
      this.__videoItem.setVideoStream(rtcData.video);

      this.__avatarCamMaterial = new Visualive.Material('user' + userData.id + 'AvatarImageMaterial', 'FlatSurfaceShader');
      this.__avatarCamMaterial.getParameter('BaseColor').setValue(this.__avatarColor);
      this.__avatarCamMaterial.getParameter('BaseColor').setImage(this.__videoItem);
      this.__avatarCamGeomItem = new Visualive.GeomItem('avatarImage', this.__plane, this.__avatarCamMaterial);
      this.__avatarCamGeomItem.addRef(this);

      const sc = 0.02;
      this.__avatarCamXfo = new Visualive.Xfo();
      this.__avatarCamXfo.sc.set(16*sc, 9*sc, 1);
      this.__avatarCamXfo.tr.set(0, 0, -0.1*sc);
      this.__avatarCamGeomItem.setLocalXfo(this.__avatarCamXfo);

      if(this.__currentViewMode == 'CameraAndPointer') {
        if(this.__avatarImageGeomItem) {
          this.__treeItem.getChild(0).removeChildByHandle(this.__avatarImageGeomItem);
          geomItem.addChild(this.__avatarImageGeomItem, false);
        }
        this.__treeItem.getChild(0).addChild(this.__avatarCamGeomItem, false);
      }

      rtcData.video.addEventListener("loadedmetadata", (e) => {
          const aspect = rtcData.video.videoWidth / rtcData.video.videoHeight;
          this.__avatarCamXfo.sc.x = this.__avatarCamXfo.sc.y * aspect;
          this.__avatarImageGeomItem.setLocalXfo(this.__avatarCamXfo);
        });
    }

    if(rtcData.audio) {
      if(this.__audioItem) {
        return;
      }
      this.__audioItem = new Visualive.AudioItem('audio');
      this.__audioItem.setAudioStream(rtcData.audio)
      const head = this.__treeItem.getChild(0);
      if (head) {
        head.addChild(this.__audioItem, false);
      }
    }
  }

  getCamera() {
    return this.__camera;
  }

  bindCamera() {
    this.__cameraBound = true;

    const cameraOwner = this.__camera.getOwner();
    if(cameraOwner) {
      cameraOwner.traverse(subTreeItem => {
        if(subTreeItem != this.__camera)
          subTreeItem.setVisible(false)
      })
    }
  }

  unbindCamera() {
    this.__cameraBound = false;

    const cameraOwner = this.__camera.getOwner();
    if(cameraOwner) {
      cameraOwner.traverse(subTreeItem => {
        if(subTreeItem != this.__camera)
          subTreeItem.setVisible(true)
      })
    }
  }

  setCameraAndPointerRepresentation() {
    this.__treeItem.removeAllChildren();
    if(this.__currentUserAvatar)
      return;
    const sc = 0.02;
    const shape = new Visualive.Cuboid(16*sc, 9*sc, 3*sc, true);// 16:9
    const pinch = new Visualive.Vec3(0.1, 0.1, 1);
    shape.getVertex(0).multiplyInPlace(pinch);
    shape.getVertex(1).multiplyInPlace(pinch);
    shape.getVertex(2).multiplyInPlace(pinch);
    shape.getVertex(3).multiplyInPlace(pinch);
    // const shape = new Visualive.Cone(0.2, 0.6, 4, true);
    shape.computeVertexNormals();
    const geomItem = new Visualive.GeomItem('camera', shape, this.__material);
    const geomXfo = new Visualive.Xfo();
    geomItem.setGeomOffsetXfo(geomXfo);


    const line = new Visualive.Lines();
    line.setNumVertices(2);
    line.setNumSegments(1);
    line.setSegment(0, 0, 1);
    line.getVertex(0).set(0.0, 0.0, 0.0);
    line.getVertex(1).set(0.0, 0.0, 1.0);
    line.setBoundingBoxDirty();
    this.pointerXfo = new Visualive.Xfo();
    this.pointerXfo.sc.set(1, 1, 0);

    this.__pointermat = new Visualive.Material('pointermat', 'LinesShader');
    this.__pointermat.getParameter('Color').setValue(this.__avatarColor);

    this.__pointerItem = new Visualive.GeomItem('Pointer', line, this.__pointermat);
    this.__pointerItem.addRef(this)
    this.__pointerItem.setLocalXfo(this.pointerXfo);

    // If the webcam stream is available, attach it
    // else attach the avatar image. (which should always be available)
    if(this.__avatarCamGeomItem) {
      geomItem.addChild(this.__avatarCamGeomItem, false);
    }
    else if(this.__avatarImageGeomItem) {
      this.__avatarImageXfo.sc.set(9*sc, 9*sc, 1);
      this.__avatarImageXfo.tr.set(0, 0, -0.1*sc);
      this.__avatarImageGeomItem.setLocalXfo(this.__avatarImageXfo);
      geomItem.addChild(this.__avatarImageGeomItem, false);
    }

    if (this.__audioItem) {
      geomItem.addChild(this.__audioItem, false);
    }

    this.__treeItem.addChild(geomItem, false);
    this.__treeItem.addChild(this.__pointerItem, false);

    this.__treeItem.addChild(this.__camera, false);
    if(this.__cameraBound) {
      geomItem.setVisible(false)
    }

    this.__currentViewMode = 'CameraAndPointer';
  }

  updateCameraAndPointerPose(data) {
    if(this.__currentUserAvatar)
      return;

    if(data.viewXfo){
      this.__treeItem.getChild(0).setLocalXfo(data.viewXfo);
      this.pointerXfo.sc.z = 0;
      this.__treeItem.getChild(1).setLocalXfo(this.pointerXfo);
    }
    else if(data.movePointer){
      this.pointerXfo.tr = data.movePointer.start;
      this.pointerXfo.ori.setFromDirectionAndUpvector(data.movePointer.dir, up);
      this.pointerXfo.sc.z = data.movePointer.length;
      this.__treeItem.getChild(1).setLocalXfo(this.pointerXfo);
    }
    else if(data.hilightPointer){
      this.__pointermat.getParameter('Color').setValue(this.__hilightPointerColor);
    }
    else if(data.unhilightPointer){
      this.__pointermat.getParameter('Color').setValue(this.__avatarColor);
    }
    else if(data.pointerOff){
      this.pointerXfo.sc.z = 0;
      this.__treeItem.getChild(1).setLocalXfo(this.pointerXfo);
    }
  }

  setViveRepresentation() {
    this.__treeItem.removeAllChildren();
    const hmdHolder = new Visualive.TreeItem("hmdHolder");
    if (this.__audioItem) {
      hmdHolder.addChild(this.__audioItem);
    }

    if(this.__avatarImageGeomItem) {
      this.__avatarImageXfo.sc.set(0.12, 0.12, 1);
      this.__avatarImageXfo.tr.set(0, -0.04, -0.1);
      this.__avatarImageGeomItem.setLocalXfo(this.__avatarImageXfo);
      hmdHolder.addChild(this.__avatarImageGeomItem, false);
    }

    this.__treeItem.addChild(hmdHolder);

    if(this.__camera)
      hmdHolder.addChild(this.__camera, false);

    if(this.__hmdGeomItem) {
      if(!this.__currentUserAvatar)
        hmdHolder.addChild(this.__hmdGeomItem, false);
      if(this.__cameraBound) {
        this.__hmdGeomItem.setVisible(false)
      }
    }
    else {
      const resourceLoader = this.__appData.scene.getResourceLoader();
      if (!Visualive.SystemDesc.isMobileDevice && !this.__viveAsset && resourceLoader.resourceAvailable("VisualiveEngine/Vive.vla")) {
        this.__viveAsset = this.__appData.scene.loadCommonAssetResource("VisualiveEngine/Vive.vla");
        this.__viveAsset.geomsLoaded.connect(()=>{
          const materialLibrary = this.__viveAsset.getMaterialLibrary();
          const materialNames = materialLibrary.getMaterialNames();
          for(let name of materialNames) {
            const material = materialLibrary.getMaterial(name, false);
            if(material)
              material.setShaderName('SimpleSurfaceShader');
          }

          if(!this.__currentUserAvatar) {
            const hmdGeomItem = this.__viveAsset.getChildByName('HTC_Vive_HMD').clone();
            const xfo = hmdGeomItem.getLocalXfo();
            xfo.tr.set(0, -0.03, -0.03);
            xfo.ori.setFromAxisAndAngle(new Visualive.Vec3(0, 1, 0), Math.PI);
            hmdGeomItem.setLocalXfo(xfo);
            hmdGeomItem.setMaterial(this.__material);

            this.__hmdGeomItem = hmdGeomItem;
            this.__hmdGeomItem.addRef(this);

            if(this.__cameraBound) {
              this.__hmdGeomItem.setVisible(false)
            }
            hmdHolder.addChild(this.__hmdGeomItem, false);
          }
        });
      }
    }

    this.__currentViewMode = 'Vive';
    this.__controllerTrees = [];
  }

  updateVivePose(data) {

    const setupController = (i)=>{
      if(this.__controllerTrees[i]) {
        this.__treeItem.addChild(this.__controllerTrees[i], false);
      }
      else {
        const treeItem = new Visualive.TreeItem("handleHolder" + i);
        treeItem.addRef(this)
        this.__controllerTrees[i] = treeItem;
        this.__treeItem.addChild(this.__controllerTrees[i], false);

        const setupControllerGeom = ()=>{
          const controllerTree = this.__viveAsset.getChildByName('HTC_Vive_Controller').clone();

          const filter = ['TriggerMaterial', 'Touchpad Material', 'Metal']
          controllerTree.traverse((subTreeItem)=>{
            if(subTreeItem instanceof Visualive.GeomItem){
              if(filter.indexOf(subTreeItem.getMaterial().getName()) == -1)
                subTreeItem.setMaterial(this.__material)
            }
          })
          const xfo = new Visualive.Xfo(
            new Visualive.Vec3(0, -0.035, -0.02), 
            new Visualive.Quat({ 
              setFromAxisAndAngle: [
                new Visualive.Vec3(0, 1, 0), 
                Math.PI
              ] 
            }));
          controllerTree.setLocalXfo(xfo);
          treeItem.addChild(controllerTree, false);
        }
        this.__viveAsset.geomsLoaded.connect(() => {
          setupControllerGeom();
        });
      }
    }

    if(data.viewXfo)
      this.__treeItem.getChild(0).setGlobalXfo(data.viewXfo);

    if (data.controllers) {
      for (let i = 0; i < data.controllers.length; i++) {
        if (data.controllers[i] && !this.__controllerTrees[i]) {
          setupController(i)
        }
        this.__controllerTrees[i].setGlobalXfo(data.controllers[i].xfo);
      }
    }
    if (data.showUIPanel) {
      if(!this.__uiGeomItem) {
        const uimat = new Visualive.Material('uimat', 'FlatSurfaceShader');
        uimat.getParameter('BaseColor').setValue(new Visualive.Color(0.3, 0.3, 0.3));

        this.__uiGeomOffsetXfo = new Visualive.Xfo();
        this.__uiGeomOffsetXfo.sc.set(data.showUIPanel.size.x, data.showUIPanel.size.y, 1);
        // Flip it over so we see the front.
        this.__uiGeomOffsetXfo.ori.setFromAxisAndAngle(new Visualive.Vec3(0, 1, 0), Math.PI);

        this.__uiGeomItem = new Visualive.GeomItem('VRControllerUI', this.__plane, uimat);
        this.__uiGeomItem.addRef(this)
        this.__uiGeomItem.setGeomOffsetXfo(this.__uiGeomOffsetXfo);

        const localXfo = new Visualive.Xfo();
        localXfo.fromJSON(data.showUIPanel.localXfo)
        uiGeomItem.setLocalXfo(localXfo);
      }
      this.__controllerTrees[data.showUIPanel.controllerId].addChild(uiGeomItem, false);
    }
    if (data.updateUIPanel) {
      if(this.__uiGeomItem) {
        this.__uiGeomOffsetXfo.sc.set(data.updateUIPanel.size.x, data.updateUIPanel.size.y, 1);
        this.__uiGeomItem.setGeomOffsetXfo(this.__uiGeomOffsetXfo);
      }
    }
    if (data.hideUIPanel) {
      if(this.__controllerTrees[data.showUIPanel.controllerId].numChildren() == 2)
        this.__controllerTrees[data.hideUIPanel.controllerId].removeChild(1);
    }
  }

  updatePose(data) {
    switch (data.interfaceType) {
      case 'CameraAndPointer':
        if (this.__currentViewMode !== 'CameraAndPointer') {
          this.setCameraAndPointerRepresentation();
        }
        this.updateCameraAndPointerPose(data)
        break;
        // case 'TabletAndFinger':
        //     if (this.__currentViewMode !== 'CameraAndPointer') {

        //     }
        break;
      case 'Vive':
        if (this.__currentViewMode !== 'Vive') {
          this.setViveRepresentation();
        }
        this.updateVivePose(data);
        break;
      case 'Daydream':
        break;
      case 'Occulus':
        break;
    }

    //this.__treeItem.requestRedraw();
  };

  destroy() {
    this.__appData.renderer.getCollector().removeTreeItem(this.__treeItem);
    this.__treeItem.removeRef(this);
    if(!this.__camera) {
      this.__camera.removeRef(this);
    }
    this.__material.removeRef(this);
  }
};
