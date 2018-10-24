// import * as Visualive from '@visualive/engine';

export default class Avatar {

  constructor(appData, userData) {
    this.__appData = appData;
    this.__userData = userData;
    this.__userData.color = new Visualive.Color(1, 0, 1, 1)

    this.__controllers = [];

    this.__treeItem = new Visualive.TreeItem(userData.id);

    this.__appData.renderer.getCollector().addTreeItem(this.__treeItem);

    // this.__parentTreeItem.addChild(this.__treeItem);
    this.__treeItem.setSelectable(false);

    this.__material = new Visualive.Material('user' + userData.id + 'Material', 'SimpleSurfaceShader');
    this.__material.getParameter('BaseColor').setValue(this.__userData.color);
  }

  setAudioStream(stream) {
    if(this.__audioIem) {
      return;
    }
    this.__audioIem = new AudioItem('audio', stream);
    const head = this.__treeItem.getChild(0);
    if (head) {
      head.addChild(this.__audioIem);
    }
  }

  setAvatarVisibility(visible) {
    this.__treeItem.setVisible(visible);
  }

  onPointerMoved(data) {
    // TODO: show a pointer beam.
  }

  setCameraAndPointer() {
    this.__treeItem.removeAllChildren();

    const shape = new Visualive.Cone(0.2, 0.6, 4, true);
    shape.computeVertexNormals();
    const geomItem = new Visualive.GeomItem('camera', shape, this.__material);
    const geomXfo = new Visualive.Xfo();
    geomItem.setGeomOffsetXfo(geomXfo);

    if (this.__audioIem) {
      geomItem.addChild(this.__audioIem);
    }

    this.__treeItem.addChild(geomItem);

    this.__currentViewMode = 'CameraAndPointer';
  }

  setViveRepresentation() {
    this.__treeItem.removeAllChildren();
    const hmdHolder = new Visualive.TreeItem("hmdHolder");
    if (this.__audioIem) {
      hmdHolder.addChild(this.__audioIem);
    }
    this.__treeItem.addChild(hmdHolder);

    const resourceLoader = this.__appData.scene.getResourceLoader();
    if (!Visualive.SystemDesc.isMobileDevice && !this.__viveAsset && resourceLoader.resourceAvailable("VisualiveEngine/Vive.vla")) {
      this.__viveAsset = this.__appData.scene.loadCommonAssetResource("VisualiveEngine/Vive.vla");
      this.__viveAsset.loaded.connect(()=>{
        const materialLibrary = this.__viveAsset.getMaterialLibrary();
        const materialNames = materialLibrary.getMaterialNames();
        for(let name of materialNames) {
          const material = materialLibrary.getMaterial(name, false);
          if(material)
            material.setShaderName('SimpleSurfaceShader');
        }

        const hmdTree = this.__viveAsset.getChildByName('HTC_Vive_HMD').clone();
        const xfo = hmdTree.getLocalXfo();
        xfo.ori.setFromAxisAndAngle(new Visualive.Vec3(0, 1, 0), Math.PI);
        hmdTree.setLocalXfo(xfo);

        hmdHolder.addChild(hmdTree, false);
      });
    }
    this.__currentViewMode = 'Vive';
  }

  updateViveControllers(data) {
    for (let i = 0; i < data.controllers.length; i++) {
      if (data.controllers[i] && !this.__controllers[i]) {

        const treeItem = new Visualive.TreeItem("handleHolder" + i);

        this.__viveAsset.loaded.connect(() => {
          const controllerTree = this.__viveAsset.getChildByName('HTC_Vive_Controller').clone();
          const xfo = new Visualive.Xfo(
            new Visualive.Vec3(0, -0.035, 0.01), 
            new Visualive.Quat({ 
              setFromAxisAndAngle: [
                new Visualive.Vec3(0, 1, 0), 
                Math.PI
              ] 
            }));
          controllerTree.setLocalXfo(xfo);
          treeItem.addChild(controllerTree);
        });

        this.__treeItem.addChild(treeItem);
        this.__controllers[i] = treeItem;
      }
      this.__controllers[i].setLocalXfo(data.controllers[i].xfo);
    }
    // Hide any controllers that have turned off
    // if (this.__controllers.length > data.controllers.length) {
    //   for (let i = data.controllers.length; i < this.__controllers.length; i++) {
    //     this.__controllers[i].setVisible(false);
    //   }
    // }
  }

  updatePose(data) {
    switch (data.interfaceType) {
      case 'CameraAndPointer':
        if (this.__currentViewMode !== 'CameraAndPointer') {
          this.setCameraAndPointer(data);
        }
        this.__treeItem.getChild(0).setLocalXfo(data.viewXfo);
        break;
        // case 'TabletAndFinger':
        //     if (this.__currentViewMode !== 'CameraAndPointer') {

        //     }
        break;
      case 'Vive':
        if (this.__currentViewMode !== 'Vive') {
          this.setViveRepresentation(data);
        }

        this.__treeItem.getChild(0).setLocalXfo(data.viewXfo);
        if (data.controllers)
          this.updateViveControllers(data);
        break;
      case 'Daydream':
        break;
      case 'Occulus':
        break;
    }

    //this.__treeItem.requestRedraw();
  };

  destroy() {
    this.__parentTreeItem.removeChildByHandle(this.__treeItem);
    // Notr: the marker pen tool stays, as we don't want lines
    // dissappearing after a user quits.
  }
};
