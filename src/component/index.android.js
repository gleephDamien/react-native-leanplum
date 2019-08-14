'use strict';

var {
  NativeModules,
  DeviceEventEmitter,
} = require('react-native');

var LPPushNotif = NativeModules.LPPushNotif;
var _notifHandlers = new Map();

var DEVICE_NOTIF_EVENT = 'remoteNotificationReceived';
var NOTIF_REGISTER_EVENT = 'remoteNotificationsRegistered';
var REMOTE_FETCH_EVENT = 'remoteFetch';

var NotificationsComponent = function() {

};

NotificationsComponent.prototype.getInitialNotification = function () {
    return LPPushNotif.getInitialNotification()
        .then(function (notification) {
            if (notification && notification.dataJSON) {
                return JSON.parse(notification.dataJSON);
            }
            return null;
        });
};

NotificationsComponent.prototype.requestPermissions = function(senderID: string) {
	LPPushNotif.requestPermissions(senderID);
};

NotificationsComponent.prototype.subscribeToTopic = function(topic: string) {
	LPPushNotif.subscribeToTopic(topic);
};

NotificationsComponent.prototype.cancelLocalNotifications = function(details: Object) {
	LPPushNotif.cancelLocalNotifications(details);
};

NotificationsComponent.prototype.clearLocalNotification = function(details: Object) {
	LPPushNotif.clearLocalNotification(details);
};

NotificationsComponent.prototype.cancelAllLocalNotifications = function() {
	LPPushNotif.cancelAllLocalNotifications();
};

NotificationsComponent.prototype.presentLocalNotification = function(details: Object) {
	LPPushNotif.presentLocalNotification(details);
};

NotificationsComponent.prototype.scheduleLocalNotification = function(details: Object) {
	LPPushNotif.scheduleLocalNotification(details);
};

NotificationsComponent.prototype.setApplicationIconBadgeNumber = function(number: number) {
       if (!LPPushNotif.setApplicationIconBadgeNumber) {
               return;
       }
       LPPushNotif.setApplicationIconBadgeNumber(number);
};

NotificationsComponent.prototype.abandonPermissions = function() {
	/* Void */
};

NotificationsComponent.prototype.checkPermissions = function(callback: Function) {
	LPPushNotif.checkPermissions().then(alert => callback({ alert }));
};

NotificationsComponent.prototype.addEventListener = function(type: string, handler: Function) {
	var listener;
	if (type === 'notification') {
		listener =  DeviceEventEmitter.addListener(
			DEVICE_NOTIF_EVENT,
			function(notifData) {
				var data = JSON.parse(notifData.dataJSON);
				handler(data);
			}
		);
	} else if (type === 'register') {
		listener = DeviceEventEmitter.addListener(
			NOTIF_REGISTER_EVENT,
			function(registrationInfo) {
				handler(registrationInfo.deviceToken);
			}
		);
	} else if (type === 'remoteFetch') {
		listener = DeviceEventEmitter.addListener(
			REMOTE_FETCH_EVENT,
			function(notifData) {
				var notificationData = JSON.parse(notifData.dataJSON)
				handler(notificationData);
			}
		);
	}

	_notifHandlers.set(type, listener);
};

NotificationsComponent.prototype.removeEventListener = function(type: string, handler: Function) {
	var listener = _notifHandlers.get(type);
	if (!listener) {
		return;
	}
	listener.remove();
	_notifHandlers.delete(type);
}

NotificationsComponent.prototype.registerNotificationActions = function(details: Object) {
	LPPushNotif.registerNotificationActions(details);
}

NotificationsComponent.prototype.clearAllNotifications = function() {
	LPPushNotif.clearAllNotifications()
}

module.exports = {
	state: false,
	component: new NotificationsComponent()
};
