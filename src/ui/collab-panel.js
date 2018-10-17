import { VisualiveSession } from '@visualive/collab';
import { UserChip } from './UserChip.js';

export default class CollabPanel {
  constructor($collabWrapper, visualiveSession) {
    const collabMarkup = `
      <div class="ba b--light-blue br2 pa2 h4 overflow-y-auto mb2">
        <ul id="userChips" class="list pa0"></ul>
      </div>
      <div class="ba b--light-blue br2 pa2 h5 overflow-y-auto mb2" id="receivedMessages"></div>

      <form autocomplete="off" name="formSendMessage">
        <div class="mb5 flex">
          <input class="flex-grow-1 mr1" name="messageToSend" required type="text">
          <button class="pure-button">
            <i class="material-icons f4">send</i>
          </button>
        </div>
      </form>

      <form class="pure-form pure-form-aligned" name="formCreateRoom">
        <legend>Create Room</legend>
        <fieldset>
          <div class="pure-control-group">
            <label for="roomId">Room ID</label>
            <input name="roomId" disabled type="text">
            <button class="pure-button" type="button">
              <i class="material-icons f4">file_copy</i>
            </button>
          </div>
        </fieldset>
        <div class="flex justify-center">
          <button class="pure-button pure-button-primary">
            Create Room
          </button>
        </div>
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

    `;

    $collabWrapper.innerHTML = collabMarkup;

    const $userChips = document.getElementById('userChips');
    const $receivedMessages = document.getElementById('receivedMessages');
    const $mediaWrapper = document.getElementById('mediaWrapper');

    document.formCreateRoom.addEventListener('submit', e => {
      const $form = e.target;
      const roomId = visualiveSession.createRoom();
      $form.roomId.value = roomId;

      e.preventDefault();
    });

    document.formSendMessage.addEventListener('submit', e => {
      const $form = e.target;
      visualiveSession.pub(VisualiveSession.actions.TEXT_MESSAGE, {
        text: $form.messageToSend.value,
      });

      e.preventDefault();
      $form.reset();
    });

    visualiveSession.sub(
      VisualiveSession.actions.TEXT_MESSAGE,
      (message, userId) => {
        const p = document.createElement('p');
        p.innerHTML = `<strong>${userId}:</strong> ${message.text}`;
        $receivedMessages.appendChild(p);
        $receivedMessages.scrollTop = $receivedMessages.scrollHeight;
      }
    );

    const userChipsElements = {};
    const addUser = userData => {
      const p = document.createElement('p');
      p.innerHTML = `<strong>(${userData.name} has joined)</strong>`;
      $receivedMessages.appendChild(p);
      $receivedMessages.scrollTop = $receivedMessages.scrollHeight;

      const li = document.createElement('li');
      $userChips.appendChild(li);
      const userChip = new UserChip(li, userData);

      userChipsElements[userData.id] = li;
    };
    const removeUser = userData => {
      const p = document.createElement('p');
      p.innerHTML = `<strong>(${userData.name} has left)</strong>`;
      $receivedMessages.appendChild(p);
      $receivedMessages.scrollTop = $receivedMessages.scrollHeight;

      $userChips.removeChild(userChipsElements[userData.id]);
    };
    visualiveSession.sub(VisualiveSession.actions.USER_JOINED, userData => {
      addUser(userData);
    });

    visualiveSession.sub(
      VisualiveSession.actions.USER_LEFT,
      (userData, userId) => {
        removeUser(userData);
      }
    );

    const users = visualiveSession.getUsers();
    for (let id in users) {
      addUser(users[id]);
    }
  }

  mount() {}

  unMount() {}
}
