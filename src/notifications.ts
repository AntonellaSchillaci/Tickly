
import PushNotification from 'react-native-push-notification';

PushNotification.configure({
  onNotification: function (notification) {
    console.log("NOTIFICATION:", notification);
  },
  requestPermissions: true,
});

PushNotification.createChannel(
  {
    channelId: "tickly-channel",
    channelName: "Tickly Reminders",
    channelDescription: "Promemoria per le tue task",
    importance: 4,
    vibrate: true,
  },
  (created) => console.log(`createChannel returned '${created}'`) 
);

export const scheduleTaskNotification = (id: string, text: string, date: Date) => {
  console.log("Scheduling notification:", id, text, date);

  PushNotification.localNotificationSchedule({
    channelId: "tickly-channel",
    id: id,
    title: "Promemoria Task",
    message: text,
    date,
    allowWhileIdle: true,
    playSound: true,
    soundName: "default",
  });
};

export const cancelTaskNotification = (id: string) => {
  console.log("Cancelling notification:", id);

  PushNotification.cancelLocalNotification(id);

};

console.log("✅ Notifications.ts caricato");

