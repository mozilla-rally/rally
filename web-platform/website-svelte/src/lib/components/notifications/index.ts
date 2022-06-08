/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import type { SvelteComponent } from "svelte";
import { writable, derived } from "svelte/store";
import type { Readable } from "svelte/store";

const NOTIFICATION_TIMEOUT = 2000;

export interface NotificationStore extends Readable<object> {
  timeoutID: ReturnType<typeof setTimeout>;
  send: Function;
  clear: Function;
}

interface NotificationMessage {
  id: string;
  type: string;
  message: string;
  code: SvelteComponent;
}

export function createNotificationStore(): NotificationStore {
  const _notification = writable({ id: undefined });
  let timeout: ReturnType<typeof setTimeout>;

  function send({ message, type = "default", code }): void {
    const notificationMessage: NotificationMessage = {
      id: id(),
      type,
      message,
      code,
    };
    _notification.set(notificationMessage);
  }

  function clear(): void {
    _notification.set({ id: undefined });
  }

  const notifications: Readable<object> = derived(
    _notification,
    ($notification, set) => {
      // if there already was a notification, let's clear the timer
      // and reset it here.
      clearTimeout(timeout);
      set($notification);
      // if this is not the reset message, set the timer.
      if ($notification.id) {
        timeout = setTimeout(clear, NOTIFICATION_TIMEOUT);
      }
    }
  );
  const { subscribe } = notifications;

  return {
    timeoutID: timeout,
    subscribe,
    send,
    clear: () => {
      clearTimeout(timeout);
      clear();
    },
  };
}

function id(): string {
  return "_" + Math.random().toString(36).substr(2, 9);
}

export default createNotificationStore();
