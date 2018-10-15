import { VisualiveSession } from '@visualive/collab';

const setupCollab = $collabWrapper => {
  const collabMarkup = `
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

    <div class="hidden" id="mediaWrapper"></div>
  `;

  $collabWrapper.innerHTML = collabMarkup;

  const urlParams = new URLSearchParams(window.location.search);
  const projectIdFromUrl = urlParams.get('project-id');
  const fileIdFromUrl = urlParams.get('file-id');
  const roomIdFromUrl = urlParams.get('room-id');
  const tokenFromUrl = urlParams.get('token');

  const $receivedMessages = document.getElementById('receivedMessages');
  const $mediaWrapper = document.getElementById('mediaWrapper');

  const visualiveSession = new VisualiveSession(tokenFromUrl);

  visualiveSession.joinRoom({
    projectId: projectIdFromUrl,
    fileId: fileIdFromUrl,
    roomId: roomIdFromUrl,
  });

  document.formCreateRoom.addEventListener('submit', e => {
    const $form = e.target;
    const roomId = visualiveSession.createRoom();
    $form.roomId.value = roomId;

    e.preventDefault();
  });

  document.formSendMessage.addEventListener('submit', e => {
    const $form = e.target;
    visualiveSession.sendTextMessage($form.messageToSend.value);

    e.preventDefault();
    $form.reset();
  });

  visualiveSession.on(VisualiveSession.actions.TEXT_MESSAGE, message => {
    const p = document.createElement('p');
    p.innerHTML = `<strong>${message.userId}:</strong> ${message.payload.text}`;
    $receivedMessages.appendChild(p);
  });

  visualiveSession.on(VisualiveSession.actions.USER_JOINED, message => {
    const p = document.createElement('p');
    p.innerHTML = `<strong>(User Joined: ${message.userId})</strong>`;
    $receivedMessages.appendChild(p);
  });

  return visualiveSession;
};

export default setupCollab;
