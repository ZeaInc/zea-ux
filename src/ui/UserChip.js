import { Signal } from '../Signal';

export class UserChip {
  constructor(domElement, userData) {
    this.userSelected = new Signal();

    this.domElement = domElement;
    this.clean();
    this.userDiv = document.createElement('div');
    this.userDiv.className = 'user-chip pa1 br2';
    this.userDiv.addEventListener(
      'click',
      () => {
        const isCurrentlySelected = this.userDiv.classList.contains(
          'user-chip--selected'
        );
        Array.from(document.getElementsByClassName('user-chip')).forEach(el => {
          el.classList.remove('user-chip--selected');
        });

        if (isCurrentlySelected) {
          this.userSelected.emit(null);
          return;
        }
        this.userSelected.emit(this.userData);
        this.userDiv.classList.add('user-chip--selected');
      },
      true
    );
    this.domElement.appendChild(this.userDiv);

    this.userNameSpan = document.createElement('span');
    this.userNameSpan.className = 'user-name mr2 nowrap flex-grow-1';
    this.userDiv.appendChild(this.userNameSpan);

    this.userImage = document.createElement('img');
    this.userImage.className = 'user-image br-100 ba b--black-10';
    this.userImage.alt = 'Avatar';
    this.userImage.src = userData.picture;

    this.userDiv.appendChild(this.userImage);

    if (userData) {
      this.setUserData(userData);
    }
  }

  setUserData(userData) {
    this.userData = userData;
    this.userNameSpan.innerHTML = userData.name;
    if (userData.metadata && userData.metadata.avatarColor)
      this.userImage.style.borderColor = userData.metadata.avatarColor;
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
