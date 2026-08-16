export interface RateUpdateEvent {
  farmId: string;
  farmName?: string;
  chickenType: string;
  rate: number;
  updatedAt: string;
}

type RateCallback = (event: RateUpdateEvent) => void;

class RateWebSocketService {
  private listeners: Set<RateCallback> = new Set();
  private timerId: number | null = null;
  private isConnected: boolean = false;

  connect() {
    if (this.isConnected) return;
    this.isConnected = true;
    console.log('[WebSocket] Simulated WebSocket connection opened to /ws/live-rates');

    // Simulate occasional live market ticks every 45s if active
    this.timerId = window.setInterval(() => {
      this.simulateIncomingTick();
    }, 45000);
  }

  disconnect() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    this.isConnected = false;
    console.log('[WebSocket] Simulated WebSocket disconnected');
  }

  subscribe(callback: RateCallback): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  emitManualTick(event: RateUpdateEvent) {
    this.listeners.forEach((cb) => cb(event));
  }

  private simulateIncomingTick() {
    const farms = ['farm-01', 'farm-02', 'farm-03', 'farm-04'];
    const randomFarm = farms[Math.floor(Math.random() * farms.length)];
    const randomRate = Math.floor(98 + Math.random() * 8); // 98 to 105

    const event: RateUpdateEvent = {
      farmId: randomFarm,
      chickenType: 'LIVE_CHICKEN',
      rate: randomRate,
      updatedAt: new Date().toISOString(),
    };

    this.emitManualTick(event);
  }
}

export const rateWebSocketService = new RateWebSocketService();
