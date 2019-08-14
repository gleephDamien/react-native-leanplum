/**
 * @providesModule Notifications
 */
import {PushNotificationIOS} from "@react-native-community/push-notification-ios";

var RNNotificationsComponent = require( './component' );

var AppState = RNNotificationsComponent.state;
var RNNotifications = RNNotificationsComponent.component;

var Platform = require('react-native').Platform;

export const LPPushNotif = {
	handler: RNNotifications,
	onRegister: false,
	onError: false,
	onNotification: false,
  	onRemoteFetch: false,
	isLoaded: false,
	hasPoppedInitialNotification: false,

	isPermissionsRequestPending: false,

	permissions: {
		alert: true,
		badge: true,
		sound: true
	},
	callNative: function(name, params) {
		if ( typeof this.handler[name] === 'function' ) {
			if ( !(params instanceof Array) &&
				!(params instanceof Object) ) {
				params = [];
			}

			return this.handler[name](...params);
		} else {
			return null;
		}
	},

	/**
	 * Configure local and remote notifications
	 * @param {Object}		options
	 * @param {function}	options.onRegister - Fired when the user registers for remote notifications.
	 * @param {function}	options.onNotification - Fired when a remote notification is received.
	 * @param {function} 	options.onError - None
	 * @param {Object}		options.permissions - Permissions list
	 * @param {Boolean}		options.requestPermissions - Check permissions when register
	 */
	configure : function(options: {
		onRegister?: (any)=>void,
		onNotification?: (any)=>void,
		requestPermissions?: boolean,
		onError?: (any)=>void,
		popInitialNotification?:boolean,
		permissions?: {
			alert?: boolean,
			badge?: boolean,
			sound?: boolean
		},
		senderID?: string,
		onRemoteFetch?: (any)=>void,
	}) {
		if ( typeof options.onRegister !== 'undefined' ) {
			this.onRegister = options.onRegister;
		}

		if ( typeof options.onError !== 'undefined' ) {
			this.onError = options.onError;
		}

		if ( typeof options.onNotification !== 'undefined' ) {
			this.onNotification = options.onNotification;
		}

		if ( typeof options.permissions !== 'undefined' ) {
			this.permissions = options.permissions;
		}

		if ( typeof options.senderID !== 'undefined' ) {
			this.senderID = options.senderID;
		}

		if ( typeof options.onRemoteFetch !== 'undefined' ) {
			this.onRemoteFetch = options.onRemoteFetch;
		}

		if ( this.isLoaded === false ) {
			this._onRegister = this._onRegister.bind(this);
			this._onNotification = this._onNotification.bind(this);
			this._onRemoteFetch = this._onRemoteFetch.bind(this);
			this.callNative( 'addEventListener', [ 'register', this._onRegister ] );
			this.callNative( 'addEventListener', [ 'notification', this._onNotification ] );
			this.callNative( 'addEventListener', [ 'localNotification', this._onNotification ] );
			Platform.OS === 'android' ? this.callNative( 'addEventListener', [ 'remoteFetch', this._onRemoteFetch ] ) : null

			this.isLoaded = true;
		}

		if ( this.hasPoppedInitialNotification === false &&
				( options.popInitialNotification === undefined || options.popInitialNotification === true ) ) {
			this.popInitialNotification(function(firstNotification) {
				if ( firstNotification !== null ) {
					this._onNotification(firstNotification, true);
				}
			}.bind(this));
			this.hasPoppedInitialNotification = true;
		}

		if ( options.requestPermissions !== false ) {
			this._requestPermissions();
		}

	},

	/* Unregister */
	unregister: function() {
		this.callNative( 'removeEventListener', [ 'register', this._onRegister ] )
		this.callNative( 'removeEventListener', [ 'notification', this._onNotification ] )
		this.callNative( 'removeEventListener', [ 'localNotification', this._onNotification ] )
		Platform.OS === 'android' ? this.callNative( 'removeEventListener', [ 'remoteFetch', this._onRemoteFetch ] ) : null
		this.isLoaded = false;
	},

	/**
	 * Local Notifications
	 * @param {Object}		details
	 * @param {String}		details.title  -  The title displayed in the notification alert.
	 * @param {String}		details.message - The message displayed in the notification alert.
	 * @param {String}		details.ticker -  ANDROID ONLY: The ticker displayed in the status bar.
	 * @param {Object}		details.userInfo -  iOS ONLY: The userInfo used in the notification alert.
	 */
	localNotification: function(details: any) {
		if ( Platform.OS === 'ios' ) {
			// https://developer.apple.com/reference/uikit/uilocalnotification

			let soundName = details.soundName ? details.soundName : 'default'; // play sound (and vibrate) as default behaviour

			if (details.hasOwnProperty('playSound') && !details.playSound) {
				soundName = ''; // empty string results in no sound (and no vibration)
			}

			// for valid fields see: https://developer.apple.com/library/ios/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/Chapters/IPhoneOSClientImp.html
			// alertTitle only valid for apple watch: https://developer.apple.com/library/ios/documentation/iPhone/Reference/UILocalNotification_Class/#//apple_ref/occ/instp/UILocalNotification/alertTitle

			this.handler.presentLocalNotification({
				alertTitle: details.title,
				alertBody: details.message,
				alertAction: details.alertAction,
				category: details.category,
				soundName: soundName,
				applicationIconBadgeNumber: details.number,
				userInfo: details.userInfo
			});
		} else {
			this.handler.presentLocalNotification(details);
		}
	},

	/**
	 * Local Notifications Schedule
	 * @param {Object}		details (same as localNotification)
	 * @param {Date}		details.date - The date and time when the system should deliver the notification
	 */
	localNotificationSchedule : function(details: any) {
		if ( Platform.OS === 'ios' ) {
			let soundName = details.soundName ? details.soundName : 'default'; // play sound (and vibrate) as default behaviour

			if (details.hasOwnProperty('playSound') && !details.playSound) {
				soundName = ''; // empty string results in no sound (and no vibration)
			}

			var iosDetails :any = {
				fireDate: details.date.toISOString(),
				alertTitle: details.title,
				alertBody: details.message,
				category: details.category,
				soundName: soundName,
				userInfo: details.userInfo,
				repeatInterval: details.repeatType
			};

			if(details.number) {
				iosDetails.applicationIconBadgeNumber = parseInt(details.number, 10);
			}

			// ignore Android only repeatType
			if (!details.repeatType || details.repeatType === 'time') {
				delete iosDetails.repeatInterval;
			}
			this.handler.scheduleLocalNotification(iosDetails);
		} else {
			details.fireDate = details.date.getTime();
			delete details.date;
			// ignore iOS only repeatType
			if (['year', 'month'].includes(details.repeatType)) {
				delete details.repeatType;
			}
			this.handler.scheduleLocalNotification(details);
		}
	},

	/* Internal Functions */
	_onRegister : function(token: String) {
		if ( this.onRegister !== false ) {
			this.onRegister({
				token: token,
				os: Platform.OS
			});
		}
	},

	_onRemoteFetch : function(notificationData: any) {
		if ( this.onRemoteFetch !== false ) {
			this.onRemoteFetch(notificationData)
		}
	},

	_onNotification : function(data, isFromBackground = null) {
		if ( isFromBackground === null ) {
			isFromBackground = (
				data.foreground === false ||
				AppState.currentState === 'background'
			);
		}

		if ( this.onNotification !== false ) {
			if ( Platform.OS === 'ios' ) {
				this.onNotification({
					foreground: ! isFromBackground,
					userInteraction: isFromBackground,
					message: data.getMessage(),
					data: data.getData(),
					badge: data.getBadgeCount(),
					alert: data.getAlert(),
					sound: data.getSound(),
				finish: (res) => data.finish(PushNotificationIOS.FetchResult.NoData)
				});
			} else {
				var notificationData = {
					foreground: ! isFromBackground,
				finish: () => {},
					...data
				};

				if ( typeof notificationData.data === 'string' ) {
					try {
						notificationData.data = JSON.parse(notificationData.data);
					} catch(e) {
						/* void */
					}
				}

				this.onNotification(notificationData);
			}
		}
	},

	/* onResultPermissionResult */
	_onPermissionResult : function() {
		this.isPermissionsRequestPending = false;
	},

	// Prevent requestPermissions called twice if ios result is pending
	_requestPermissions : function() {
		if ( Platform.OS === 'ios' ) {
			if ( this.isPermissionsRequestPending === false ) {
				this.isPermissionsRequestPending = true;
				return this.callNative( 'requestPermissions', [ this.permissions ])
								.then(this._onPermissionResult.bind(this))
								.catch(this._onPermissionResult.bind(this));
			}
		} else if ( typeof this.senderID !== 'undefined' ) {
			return this.callNative( 'requestPermissions', [ this.senderID ]);
		}
	},

	// Stock requestPermissions function
	requestPermissions : function() {
		if ( Platform.OS === 'ios' ) {
			return this.callNative( 'requestPermissions', [ this.permissions ]);
		} else if ( typeof this.senderID !== 'undefined' ) {
			return this.callNative( 'requestPermissions', [ this.senderID ]);
		}
	},

	/* Fallback functions */
	subscribeToTopic : function() {
		return this.callNative('subscribeToTopic', arguments);
	},

	presentLocalNotification : function() {
		return this.callNative('presentLocalNotification', arguments);
	},

	scheduleLocalNotification : function() {
		return this.callNative('scheduleLocalNotification', arguments);
	},

	cancelLocalNotifications : function() {
		return this.callNative('cancelLocalNotifications', arguments);
	},

	clearLocalNotification : function() {
		return this.callNative('clearLocalNotification', arguments);
	},

	cancelAllLocalNotifications : function() {
		return this.callNative('cancelAllLocalNotifications', arguments);
	},

	setApplicationIconBadgeNumber : function() {
		return this.callNative('setApplicationIconBadgeNumber', arguments);
	},

	getApplicationIconBadgeNumber : function() {
		return this.callNative('getApplicationIconBadgeNumber', arguments);
	},

	popInitialNotification : function(handler) {
		this.callNative('getInitialNotification').then(function(result){
			handler(result);
		});
	},

	abandonPermissions : function() {
		return this.callNative('abandonPermissions', arguments);
	},

	checkPermissions : function() {
		return this.callNative('checkPermissions', arguments);
	},

	registerNotificationActions : function() {
		return this.callNative('registerNotificationActions', arguments)
	},

	clearAllNotifications : function() {
		// Only available for Android
		return this.callNative('clearAllNotifications', arguments)
	}
}