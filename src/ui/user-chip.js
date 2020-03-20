import { Signal } from '@zeainc/zea-engine';

/** Class representing a user chip. */
class UserChip {
  /**
   * Create a user chip.
   * @param {any} domElement - The domElement value.
   * @param {any} userData - The userData value.
   */
  constructor(domElement, userData) {
    this.userPressed = new Signal();

    this.domElement = domElement;
    this.clean();
    this.userDiv = document.createElement('div');
    this.userDiv.className = 'user-chip pa1 br2';
    // this.userDiv.addEventListener(
    //   'click',
    //   () => {
    //     const isCurrentlySelected = this.userDiv.classList.contains(
    //       'user-chip--selected'
    //     );
    //     Array.from(document.getElementsByClassName('user-chip')).forEach(el => {
    //       el.classList.remove('user-chip--selected');
    //     });

    //     if (isCurrentlySelected) {
    //       this.userPressed.emit(null);
    //       return;
    //     }
    //     this.userPressed.emit(this.userData);
    //     this.userDiv.classList.add('user-chip--selected');
    //   },
    //   true
    // );
    this.domElement.appendChild(this.userDiv);

    // this.userNameSpan = document.createElement('span');
    // this.userNameSpan.className = 'user-name mr2 nowrap flex-grow-1';
    // this.userDiv.appendChild(this.userNameSpan);

    this.userImage = document.createElement('img');
    this.userImage.className = 'user-image br-100 ba b--black-10';
    this.userImage.alt = 'Avatar';
    this.userImage.src = userData.picture;
    this.userImage.addEventListener(
      'mousedown',
      () => {
        this.userPressed.emit(this.userData);
        this.userImage.classList.add('user-image--selected');
      },
      true
    );
    this.userImage.addEventListener(
      'mouseup',
      () => {
        this.userImage.classList.remove('user-image--selected');
      },
      true
    );

    this.userDiv.appendChild(this.userImage);

    this.userToolTip = document.createElement('span');
    this.userToolTip.className = 'tooltiptext';
    this.userDiv.appendChild(this.userToolTip);

    if (userData) {
      this.setUserData(userData);
    }
  }

  /**
   * The setUserData method.
   * @param {any} userData - The userData param.
   */
  setUserData(userData) {
    this.userData = userData;
    if (this.userNameSpan) this.userNameSpan.innerHTML = userData.name;
    this.userToolTip.innerHTML = userData.name;

    // if (userData.metadata && userData.metadata.avatarColor)
    //   this.userImage.style.borderColor = userData.metadata.avatarColor;
  }

  /**
   * The clean method.
   */
  clean() {
    while (this.domElement.firstChild) {
      this.domElement.removeChild(this.domElement.firstChild);
    }
  }

  /**
   * The unmount method.
   */
  unmount() {
    this.clean();
  }
}

export { UserChip };
