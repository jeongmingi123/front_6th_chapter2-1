import { ManualToggle } from './ManualToggle.js';
import { ManualBackgroundOverlay } from './ManualOverlay.js';
import { ManualColumn } from './ManualColumn.js';

export class ManualManager {
  constructor() {
    this.manualToggle = null;
    this.manualOverlay = null;
    this.manualColumn = null;
    this.isVisible = false;
  }

  create() {
    const root = document.getElementById('app');

    // 각 컴포넌트 생성
    this.manualToggle = new ManualToggle(() => this.toggleManual());
    this.manualOverlay = new ManualBackgroundOverlay(() => this.hideManual());
    this.manualColumn = new ManualColumn(() => this.hideManual());

    // 컴포넌트 생성 및 마운트
    this.manualToggle.create();
    this.manualOverlay.create();
    this.manualColumn.create();

    // 오버레이에 컬럼 추가
    this.manualOverlay.element.appendChild(this.manualColumn.element);

    // DOM에 마운트
    this.manualToggle.mount(root);
    this.manualOverlay.mount(root);
  }

  toggleManual() {
    if (this.isVisible) {
      this.hideManual();
    } else {
      this.showManual();
    }
  }

  showManual() {
    this.updateManualVisibility(true);
  }

  hideManual() {
    this.updateManualVisibility(false);
  }

  updateManualVisibility(visible) {
    const action = visible ? 'show' : 'hide';
    this.manualOverlay[action]();
    this.manualColumn[action]();
    this.isVisible = visible;
  }

  destroy() {
    // 관리하는 모든 컴포넌트들을 배열로 관리
    const components = [this.manualToggle, this.manualOverlay, this.manualColumn];

    // 각 컴포넌트가 존재하면 destroy 메서드 호출
    components.filter((component) => component !== null).forEach((component) => component.destroy());

    // 참조 정리
    this.manualToggle = null;
    this.manualOverlay = null;
    this.manualColumn = null;
    this.isVisible = false;
  }
}
