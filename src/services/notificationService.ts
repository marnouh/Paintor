/**
 * Real Local Notification Scheduler Service
 * - Completely local, zero server dependency
 * - Persists configuration in localStorage
 * - Schedules timer based on user-selected time of day (e.g. 09:00)
 * - Dispatches authentic Web Notifications via Service Worker or Web Notification API
 * - Provides verifiable scheduling proof (next trigger timestamp, remaining countdown)
 */
import { Artwork } from '../data/artworks.ts';

export interface NotificationScheduleInfo {
  isEnabled: boolean;
  targetHourStr: string;
  nextScheduledDate: Date | null;
  timeRemainingMs: number;
  timeRemainingFormatted: string;
  lastTriggeredFormatted: string | null;
  permissionStatus: NotificationPermission;
}

class NotificationSchedulerService {
  private timerId: any = null;
  private onTriggerCallback: ((artwork: Artwork) => void) | null = null;

  public getSettings(): { isEnabled: boolean; hourStr: string; lastTriggered: string | null } {
    try {
      const isEnabled = localStorage.getItem('regard_notifications_enabled') === 'true';
      const hourStr = localStorage.getItem('regard_notifications_time') || '09:00';
      const lastTriggered = localStorage.getItem('regard_notifications_last_triggered');
      return { isEnabled, hourStr, lastTriggered };
    } catch {
      return { isEnabled: false, hourStr: '09:00', lastTriggered: null };
    }
  }

  public saveSettings(enabled: boolean, hourStr: string): void {
    try {
      localStorage.setItem('regard_notifications_enabled', String(enabled));
      localStorage.setItem('regard_notifications_time', hourStr);
    } catch (e) {
      console.warn('Failed to save notification settings:', e);
    }
  }

  public calculateNextTrigger(hourStr: string): { nextDate: Date; timeRemainingMs: number } {
    const [hStr, mStr] = hourStr.split(':');
    const targetHour = parseInt(hStr || '9', 10);
    const targetMinute = parseInt(mStr || '0', 10);

    const now = new Date();
    const candidate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), targetHour, targetMinute, 0, 0);

    if (candidate.getTime() <= now.getTime()) {
      // Past today, schedule for tomorrow
      candidate.setDate(candidate.getDate() + 1);
    }

    const diff = candidate.getTime() - now.getTime();
    return { nextDate: candidate, timeRemainingMs: Math.max(0, diff) };
  }

  public formatRemainingTime(ms: number): string {
    const totalMinutes = Math.floor(ms / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    if (hours === 0 && mins === 0) return 'moins d’une minute';
    if (hours === 0) return `${mins} min`;
    return `${hours}h ${mins}min`;
  }

  public getScheduleInfo(): NotificationScheduleInfo {
    const { isEnabled, hourStr, lastTriggered } = this.getSettings();
    const permission: NotificationPermission =
      typeof window !== 'undefined' && 'Notification' in window
        ? Notification.permission
        : 'default';

    if (!isEnabled) {
      return {
        isEnabled: false,
        targetHourStr: hourStr,
        nextScheduledDate: null,
        timeRemainingMs: 0,
        timeRemainingFormatted: 'Désactivé',
        lastTriggeredFormatted: lastTriggered ? new Date(lastTriggered).toLocaleString('fr-FR') : null,
        permissionStatus: permission,
      };
    }

    const { nextDate, timeRemainingMs } = this.calculateNextTrigger(hourStr);
    return {
      isEnabled: true,
      targetHourStr: hourStr,
      nextScheduledDate: nextDate,
      timeRemainingMs,
      timeRemainingFormatted: this.formatRemainingTime(timeRemainingMs),
      lastTriggeredFormatted: lastTriggered ? new Date(lastTriggered).toLocaleString('fr-FR') : null,
      permissionStatus: permission,
    };
  }

  public async requestPermission(): Promise<NotificationPermission> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'denied';
    }
    try {
      const perm = await Notification.requestPermission();
      return perm;
    } catch {
      return 'denied';
    }
  }

  public startScheduler(artworks: Artwork[], onTrigger?: (artwork: Artwork) => void): void {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    this.onTriggerCallback = onTrigger || null;

    const { isEnabled, hourStr } = this.getSettings();
    if (!isEnabled || typeof window === 'undefined' || !('Notification' in window)) {
      return;
    }

    if (Notification.permission !== 'granted') {
      return;
    }

    const { timeRemainingMs } = this.calculateNextTrigger(hourStr);

    // Set timeout to trigger at the exact moment
    // Max safe setTimeout in browsers is ~24.8 days (2147483647 ms), one day is 86400000 ms so this is fully safe
    this.timerId = setTimeout(async () => {
      await this.triggerArtworkNotification(artworks);
      // Reschedule for the next day
      this.startScheduler(artworks, this.onTriggerCallback || undefined);
    }, timeRemainingMs);
  }

  public stopScheduler(): void {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  public async triggerArtworkNotification(
    artworks: Artwork[],
    forceArtwork?: Artwork
  ): Promise<{ success: boolean; message: string; artwork?: Artwork }> {
    if (artworks.length === 0) {
      return { success: false, message: 'Aucune toile disponible dans le catalogue.' };
    }

    // Pick artwork of the day deterministically or forced
    const daySeed = Math.floor(Date.now() / 86400000);
    const chosenArtwork = forceArtwork || artworks[Math.abs(daySeed) % artworks.length] || artworks[0];

    const title = `Regard • Chef-d'œuvre du Jour`;
    const body = `« ${chosenArtwork.title} » par ${chosenArtwork.artist} (${chosenArtwork.year}). Prenez deux minutes pour contempler cette œuvre.`;

    try {
      localStorage.setItem('regard_notifications_last_triggered', new Date().toISOString());
    } catch (e) {
      console.warn(e);
    }

    if (typeof window === 'undefined' || !('Notification' in window)) {
      return { success: false, message: 'Ce navigateur ne prend pas en charge les notifications système.' };
    }

    let permission = Notification.permission;
    if (permission === 'default') {
      permission = await Notification.requestPermission();
    }

    if (permission !== 'granted') {
      return {
        success: false,
        message: 'Autorisation non accordée par le navigateur. Veuillez autoriser les notifications dans les paramètres.',
      };
    }

    try {
      // 1. Try Service Worker showNotification (supports icons, actions, tags, and background tap)
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration && 'showNotification' in registration) {
          await registration.showNotification(title, {
            body,
            icon: chosenArtwork.imageUrl || '/icons/icon-192.svg',
            badge: '/icons/icon-192.svg',
            tag: 'artwork-of-the-day',
            data: { artworkId: chosenArtwork.id },
          });

          if (this.onTriggerCallback) {
            this.onTriggerCallback(chosenArtwork);
          }

          return {
            success: true,
            message: `Notification système affichée avec succès : « ${chosenArtwork.title} » (${chosenArtwork.artist})`,
            artwork: chosenArtwork,
          };
        }
      }

      // 2. Direct Window Notification fallback
      const notif = new Notification(title, {
        body,
        icon: chosenArtwork.imageUrl || undefined,
        data: { artworkId: chosenArtwork.id },
      });

      notif.onclick = () => {
        window.focus();
        if (this.onTriggerCallback) {
          this.onTriggerCallback(chosenArtwork);
        }
      };

      return {
        success: true,
        message: `Notification système transmise : « ${chosenArtwork.title} »`,
        artwork: chosenArtwork,
      };
    } catch (err: any) {
      console.warn('Notification trigger error:', err);
      return {
        success: false,
        message: `Échec de distribution de la notification : ${err.message || 'Erreur système'}`,
      };
    }
  }
}

export const notificationService = new NotificationSchedulerService();
