"use strict";

require('dotenv').config();
const mqtt = require('mqtt');
let interval;

if (!process.env.THINGSBOARD_HOST) {
    console.log("ERROR: THINGSBOARD_HOST no está configurado en .env");
    process.exit(1)
}
if (!process.env.ACCESS_TOKEN) {
    console.log("ERROR: ACCESS_TOKEN no está configurado en .env");
    process.exit(1)
}

console.log('Connecting to: %s using access token: %s', process.env.THINGSBOARD_HOST, process.env.ACCESS_TOKEN);

var client  = mqtt.connect('mqtt://'+ process.env.THINGSBOARD_HOST,{
   username: process.env.ACCESS_TOKEN
});

client.on('connect', () => {
    console.log('Client connected!');

    // publicar atributos
    const attr = { periodo: 5 }
    client.publish('v1/devices/me/attributes', JSON.stringify(attr));
    console.log('Attributes published!');

    if (interval === undefined) {
        interval = setInterval(() => {
            // publicar telemetría
            const telemetry = {
                temperatura: Math.floor(Math.random() * 30) + 20
            };
            client.publish('v1/devices/me/telemetry', JSON.stringify(telemetry));
            console.log('Telemetry published!');
        }, 5000);
    }
});

client.on('message', (topic, message) => {
    console.log('mensaje recibid!', topic,message);
});

client.on('end', () => {
    console.log('Client end!');
});
