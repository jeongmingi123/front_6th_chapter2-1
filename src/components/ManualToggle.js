export class ManualToggle {
  constructor(onToggle) {
    this.element = null;
    this.onToggle = onToggle;
  }

  create() {
    this.element = document.createElement('button');
    this.element.onclick = () => this.onToggle();
    this.element.className =
      'fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50';
    this.element.innerHTML = /* HTML */ `
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
    `;

    return this.element;
  }

  mount(parent) {
    if (this.element) {
      parent.appendChild(this.element);
    }
  }

  destroy() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}
