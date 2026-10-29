/**
 * @fileoverview Unified Input Controller
 * Synchronizes Keyboard, Cursor/Mouse, Touch Controls, and Gamepad state.
 */

export class InputController {
  constructor() {
    this.keys = {
      left: false,
      right: false,
      fire: false,
      parry: false,
    };

    this.cursor = {
      x: null,
      y: null,
      active: false,
      isDown: false,
    };

    this.targetElement = null;
    this.gamepadConnected = false;
    this.onParryCallbacks = [];

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handlePointerMove = this.handlePointerMove.bind(this);
    this.handlePointerDown = this.handlePointerDown.bind(this);
    this.handlePointerUp = this.handlePointerUp.bind(this);
    this.handlePointerLeave = this.handlePointerLeave.bind(this);
    this.handleContextMenu = this.handleContextMenu.bind(this);
    this.handleGamepadConnected = this.handleGamepadConnected.bind(this);
    this.handleGamepadDisconnected = this.handleGamepadDisconnected.bind(this);
  }

  /**
   * Attaches input listeners to window and optional canvas element
   * @param {HTMLElement} [targetElement] Canvas or interaction container
   */
  attach(targetElement = null) {
    this.targetElement = targetElement;

    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    window.addEventListener('gamepadconnected', this.handleGamepadConnected);
    window.addEventListener('gamepaddisconnected', this.handleGamepadDisconnected);

    const el = this.targetElement || window;
    el.addEventListener('pointermove', this.handlePointerMove);
    el.addEventListener('pointerdown', this.handlePointerDown);
    el.addEventListener('pointerup', this.handlePointerUp);
    el.addEventListener('pointerleave', this.handlePointerLeave);
    el.addEventListener('contextmenu', this.handleContextMenu);
  }

  detach() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('gamepadconnected', this.handleGamepadConnected);
    window.removeEventListener('gamepaddisconnected', this.handleGamepadDisconnected);

    const el = this.targetElement || window;
    el.removeEventListener('pointermove', this.handlePointerMove);
    el.removeEventListener('pointerdown', this.handlePointerDown);
    el.removeEventListener('pointerup', this.handlePointerUp);
    el.removeEventListener('pointerleave', this.handlePointerLeave);
    el.removeEventListener('contextmenu', this.handleContextMenu);

    this.targetElement = null;
    this.reset();
  }

  reset() {
    this.keys.left = false;
    this.keys.right = false;
    this.keys.fire = false;
    this.keys.parry = false;
    this.cursor.active = false;
    this.cursor.isDown = false;
  }

  onParry(callback) {
    this.onParryCallbacks.push(callback);
  }

  triggerParry() {
    this.keys.parry = true;
    for (const cb of this.onParryCallbacks) {
      cb();
    }
  }

  handleKeyDown(e) {
    if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
      this.keys.left = true;
      this.cursor.active = false;
    }
    if (e.code === 'KeyD' || e.code === 'ArrowRight') {
      this.keys.right = true;
      this.cursor.active = false;
    }
    if (e.code === 'Space') this.keys.fire = true;
    if (e.code === 'KeyE') this.triggerParry();
  }

  handleKeyUp(e) {
    if (e.code === 'KeyA' || e.code === 'ArrowLeft') this.keys.left = false;
    if (e.code === 'KeyD' || e.code === 'ArrowRight') this.keys.right = false;
    if (e.code === 'Space') this.keys.fire = false;
    if (e.code === 'KeyE') this.keys.parry = false;
  }

  handlePointerMove(e) {
    if (this.targetElement) {
      const rect = this.targetElement.getBoundingClientRect();
      this.cursor.x = e.clientX - rect.left;
      this.cursor.y = e.clientY - rect.top;
    } else {
      this.cursor.x = e.clientX;
      this.cursor.y = e.clientY;
    }
    this.cursor.active = true;
  }

  handlePointerDown(e) {
    this.cursor.active = true;
    if (e.button === 0) {
      // Primary click: continuous laser fire
      this.cursor.isDown = true;
      this.keys.fire = true;
    } else if (e.button === 2 || e.button === 1) {
      // Secondary or middle click: trigger parry shield
      e.preventDefault();
      this.triggerParry();
    }
  }

  handlePointerUp(e) {
    if (e.button === 0) {
      this.cursor.isDown = false;
      this.keys.fire = false;
    }
  }

  handlePointerLeave() {
    this.cursor.active = false;
    this.cursor.isDown = false;
    this.keys.fire = false;
  }

  handleContextMenu(e) {
    // Prevent context menu to allow smooth right-click parry in game
    e.preventDefault();
  }

  handleGamepadConnected() {
    this.gamepadConnected = true;
  }

  handleGamepadDisconnected() {
    this.gamepadConnected = false;
  }

  /**
   * Polls connected gamepads for live inputs
   */
  pollGamepad() {
    if (typeof navigator === 'undefined' || !navigator.getGamepads) return;
    const gamepads = navigator.getGamepads();
    if (!gamepads || !gamepads[0]) return;

    const gp = gamepads[0];
    this.gamepadConnected = true;

    // D-Pad or Left Stick horizontal
    const stickX = gp.axes[0] || 0;
    const dpadLeft = gp.buttons[14]?.pressed || false;
    const dpadRight = gp.buttons[15]?.pressed || false;

    if (stickX < -0.3 || dpadLeft) {
      this.keys.left = true;
      this.cursor.active = false;
    } else if (!this.isKeyboardActive('left')) {
      this.keys.left = false;
    }

    if (stickX > 0.3 || dpadRight) {
      this.keys.right = true;
      this.cursor.active = false;
    } else if (!this.isKeyboardActive('right')) {
      this.keys.right = false;
    }

    // Cross button (0) or R2 trigger (7) for fire
    const fireBtn = gp.buttons[0]?.pressed || gp.buttons[7]?.pressed || false;
    if (fireBtn) this.keys.fire = true;
    else if (!this.cursor.isDown) this.keys.fire = false;

    // Circle (1) or L2 trigger (6) for parry
    const parryBtn = gp.buttons[1]?.pressed || gp.buttons[6]?.pressed || false;
    if (parryBtn && !this.keys.parry) {
      this.triggerParry();
    }
  }

  isKeyboardActive(action) {
    return this.keys[action];
  }
}
