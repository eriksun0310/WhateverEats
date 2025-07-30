// 震動管理器 - 專注於震動回饋功能
import { Vibration } from 'react-native';

export class VibrationManager {
  private static instance: VibrationManager;
  private isEnabled: boolean = true;

  private constructor() {}

  static getInstance(): VibrationManager {
    if (!VibrationManager.instance) {
      VibrationManager.instance = new VibrationManager();
    }
    return VibrationManager.instance;
  }

  async initialize() {
    // 簡單初始化，不需要複雜邏輯
    console.log('📳 震動系統就緒');
  }

  playSpinStart() {
    if (!this.isEnabled) return;
    // 開始轉盤：短震動
    Vibration.vibrate(100);
  }

  playSpinResult() {
    if (!this.isEnabled) return;
    // 三重震動慶祝模式
    Vibration.vibrate([0, 200, 100, 150]);
  }

  playButtonClick() {
    if (!this.isEnabled) return;
    Vibration.vibrate(50);
  }

  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    if (!enabled) {
      Vibration.cancel();
    }
  }

  isVibrationEnabled(): boolean {
    return this.isEnabled;
  }

  stopAll() {
    Vibration.cancel();
  }
}

export const vibrationManager = VibrationManager.getInstance();