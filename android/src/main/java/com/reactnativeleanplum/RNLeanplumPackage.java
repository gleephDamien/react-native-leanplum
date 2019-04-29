package com.reactnativeleanplum;

import android.app.Application;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import android.os.Build;
import android.app.NotificationManager;
import android.app.NotificationChannel;

public class RNLeanplumPackage implements ReactPackage {
    private Application application;

    public RNLeanplumPackage(Application app) {
        application = app;

    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }

    private void initialiseChannels(ReactApplicationContext c){
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            CharSequence name = "default";
            String description = "default channel to send message";
            String CHANNEL_ID="0";
            int importance = NotificationManager.IMPORTANCE_DEFAULT;
            NotificationChannel channel = new NotificationChannel(CHANNEL_ID, name, importance);
            channel.setDescription(description);
            NotificationManager notificationManager = c.getSystemService(NotificationManager.class);
            notificationManager.createNotificationChannel(channel);
        }
    }

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        initialiseChannels(reactContext);

        modules.add(new RNLeanplum(reactContext, application));
        modules.add(new RNLPInbox(reactContext, application));
        modules.add(new RNLPInboxMessage(reactContext, application));

        return modules;
    }

}
