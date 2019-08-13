import { VisualiveSession } from '@visualive/collab';
import { UserChip } from './user-chip.js';

class CollabPanel {
  constructor(visualiveSession) {
    this.userSelected = new Visualive.Signal();
    this.visualiveSession = visualiveSession;
  }

  mount(parentElement) {
    const collabMarkup = `
      <div class="ba b--light-blue br2 pa2 h4 overflow-y-auto mb2">
        <ul id="userChips" class="list pa0 ma0"></ul>
      </div>
      <div class="ba b--light-blue br2 pa2 h5 overflow-y-auto mb2" id="receivedMessages"></div>

      <form autocomplete="off" name="formSendMessage">
        <div class="mb2 flex">
          <input class="w-100 mr1" name="messageToSend" required type="text">
          <button class="pure-button">
            <i class="material-icons f4">send</i>
          </button>
        </div>
      </form>

      <div class="btn-group">
        <button class="pure-button AudioButton" disabled id="toggleMic">
          <i class="material-icons">mic</i>
        </button>

        <button class="pure-button CameraButton" disabled id="toggleCam">
          <i class="material-icons">videocam</i>
        </button>
      </div>
      <!--
      <form class="pure-form pure-form-aligned" name="formCreateRoom">
        <legend>Create Room</legend>
        <fieldset>
          <div class="pure-control-group">
            <label for="roomId">Room ID</label>
            <input name="roomId" disabled type="text">
            <button class="pure-button" disabled type="button">
              <i class="material-icons f4">file_copy</i>
            </button>
          </div>
        </fieldset>
      </form>

      <form class="pure-form pure-form-aligned" name="formJoinRoom">
        <legend>Join Room</legend>
        <fieldset>
          <div class="pure-control-group">
            <label for="roomId">Room ID</label>
            <input name="roomId" type="text">
          </div>
        </fieldset>
        <div class="flex justify-center">
          <button class="pure-button pure-button-primary">
            Join Room
          </button>
        </div>
      </form>
      --!>
      <div class="btn-group tc">
        <button class="pure-button pure-button-primary ma2" disabled>
          Create Room
        </button>
        <button class="pure-button pure-button-primary ma0" disabled>
          Join Room
        </button>
      </div>
    `;

    parentElement.innerHTML = collabMarkup;

    const $userChips = document.getElementById('userChips');
    const $receivedMessages = document.getElementById('receivedMessages');
    // const $mediaWrapper = document.getElementById('mediaWrapper');

    const $toggleMic = document.getElementById('toggleMic');
    let micStarted = false;
    $toggleMic.addEventListener('click', e => {
      if (micStarted) {
        this.visualiveSession.muteAudio();
        $toggleMic.classList.remove('AudioButton--on');
        micStarted = false;
      } else {
        this.visualiveSession.unmuteAudio();
        $toggleMic.classList.add('AudioButton--on');
        micStarted = true;
      }
    });

    const $toggleCam = document.getElementById('toggleCam');
    let cameraStarted = false;
    $toggleCam.addEventListener('click', e => {
      if (cameraStarted) {
        this.visualiveSession.stopCamera();
        $toggleCam.classList.remove('CameraButton--on');
        cameraStarted = false;
      } else {
        this.visualiveSession.startCamera();
        $toggleCam.classList.add('CameraButton--on');
        cameraStarted = true;
      }
    });

    // document.formCreateRoom.addEventListener('submit', e => {
    //   const $form = e.target;
    //   const roomId = this.visualiveSession.createRoom();
    //   $form.roomId.value = roomId;
    //   e.preventDefault();
    // });

    const addMessage = (user, msg) => {
      const p = document.createElement('p');
      p.innerHTML = `<strong>${user}:</strong> ${msg}`;
      $receivedMessages.appendChild(p);
      $receivedMessages.scrollTop = $receivedMessages.scrollHeight;
    };

    document.formSendMessage.addEventListener('submit', e => {
      const $form = e.target;
      addMessage('Me', $form.messageToSend.value);
      this.visualiveSession.pub(VisualiveSession.actions.TEXT_MESSAGE, {
        text: $form.messageToSend.value,
      });
      e.preventDefault();
      $form.reset();
    });

    this.visualiveSession.sub(
      VisualiveSession.actions.TEXT_MESSAGE,
      (message, userId) => {
        const userData = this.visualiveSession.getUser(userId);
        addMessage(userData.given_name, message.text);
      }
    );

    const userChipsElements = {};
    const addUserChip = userData => {
      const p = document.createElement('p');
      p.innerHTML = `<strong>(${userData.name} has joined)</strong>`;
      $receivedMessages.appendChild(p);
      $receivedMessages.scrollTop = $receivedMessages.scrollHeight;

      const li = document.createElement('li');
      $userChips.appendChild(li);
      const userChip = new UserChip(li, userData);
      userChip.userSelected.connect(userData => {
        this.userSelected.emit(userData);
      });

      userChipsElements[userData.id] = li;
    };

    const removeUserChip = userData => {
      const p = document.createElement('p');
      p.innerHTML = `<strong>(${userData.name} has left)</strong>`;
      $receivedMessages.appendChild(p);
      $receivedMessages.scrollTop = $receivedMessages.scrollHeight;

      $userChips.removeChild(userChipsElements[userData.id]);
    };

    this.visualiveSession.sub(
      VisualiveSession.actions.USER_JOINED,
      (userData, userId) => {
        addUserChip(userData);
      }
    );

    this.visualiveSession.sub(
      VisualiveSession.actions.USER_LEFT,
      (userData, userId) => {
        removeUserChip(userData);
      }
    );

    this.visualiveSession.sub(VisualiveSession.actions.LEFT_ROOM, () => {
      const users = this.visualiveSession.getUsers();
      for (let id in users) removeUserChip(users[id]);
      $receivedMessages.innerHTML = '';
    });

    const users = this.visualiveSession.getUsers();
    for (let id in users) {
      addUserChip(users[id]);
    }
  }

  unMount(parentElement) {}
}

export { CollabPanel };
