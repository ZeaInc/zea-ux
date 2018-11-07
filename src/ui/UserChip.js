export class UserChip {
  constructor(domElement, userData) {
    this.domElement = domElement;
    this.clean();
    this.userDiv = document.createElement('div');
    this.userDiv.className = 'user-chip';
    this.domElement.appendChild(this.userDiv);

    this.userNameSpan = document.createElement('span');
    this.userNameSpan.className = 'user-name';
    this.userDiv.appendChild(this.userNameSpan);

    this.userImage = document.createElement('img');
    this.userImage.className = 'user-image br-100 ba b--black-10';
    this.userImage.alt = 'Avatar';
    this.userImage.src = userData.picture;
    this.userImage.style.borderColor = userData.metadata.avatarColor;

    this.userImageDiv = document.createElement('div');
    this.userImageDiv.appendChild(this.userImage);
    this.userDiv.appendChild(this.userImageDiv);

    if (userData) {
      this.setUserData(userData);
    }
  }

  setUserData(userData) {
    this.userNameSpan.innerHTML = userData.name;
  }

  clean() {
    while (this.domElement.firstChild) {
      this.domElement.removeChild(this.domElement.firstChild);
    }
  }

  unmount() {
    this.clean();
  }
}
