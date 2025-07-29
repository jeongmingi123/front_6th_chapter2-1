export class ManualBackgroundOverlay {
  constructor(onClose) {
    this.element = null;
    this.onClose = onClose;
  }

  create() {
    this.element = document.createElement('div');
    this.element.className = 'manual-overlay fixed inset-0 bg-black/50 z-40 hidden transition-opacity duration-300';
    this.element.onclick = (e) => {
      if (e.target === this.element) {
        this.onClose();
      }
    };

    return this.element;
  }

  mount(parent) {
    if (this.element) {
      parent.appendChild(this.element);
    }
  }

  show() {
    this.element.classList.remove('hidden');
  }

  hide() {
    this.element.classList.add('hidden');
  }

  destroy() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}
