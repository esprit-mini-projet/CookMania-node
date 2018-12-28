var admin = require('firebase-admin');

var serviceAccount = require('../cookmaniaServiceAccountKey.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

module.exports = {
    notify: function(notificationType, notificationId, notificationUserId, deviceToken, title, message){
        var message = {
            notification: {
                title: title,
                body: message,
            },
            data: {
                notif_id: notificationId,
                notif_type: notificationType,
                notif_user_id: notificationUserId
            },
            token: deviceToken
        };
        admin.messaging().send(message)
            .then((response) => {
                console.log('Successfully sent message:', response);
            })
            .catch((error) => {
                console.log('Error sending message:', error);
        });
    }
}