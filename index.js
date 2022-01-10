"use strict";

require('dotenv').config();
const mqtt = require('mqtt');
let interval;

console.log('Connecting to: %s using access token: %s', process.env.THINGSBOARD_HOST, process.env.ACCESS_TOKEN);

var client  = mqtt.connect('mqtt://'+ process.env.THINGSBOARD_HOST,{
   username: process.env.ACCESS_TOKEN
});

client.on('connect', () => {
    console.log('Client connected!');

    // publicar atributos
    const attr = { atributo1: "Atributo 1" }
    client.publish('v1/devices/me/attributes', JSON.stringify(attr));
    console.log('Attributes published!');

    if (interval === undefined) {
        insterval = setInterval(() => {
            // publicar telemetría
            const telemetry = {
                temperatura: Math.floor(Math.random() * 30) + 20
            };
            client.publish('v1/devices/me/telemetry', JSON.stringify(telemetry));
            console.log('Telemetry published!');
        }, 5000);
    }
});

client.on('end', () => {
    console.log('Client end!');
});




// https://stackoverflow.com/questions/14031763/doing-a-cleanup-action-just-before-node-js-exits
//do something when app is closing
const cleanExit = () => {
    clearInterval(interval);
    client.end();
}

const exitHandler = (options, exitCode) => {
    if (options.cleanup) console.log('clean');
    if (exitCode || exitCode === 0) console.log(exitCode);
    if (options.exit) process.exit();
}

// capturamos ctrl-C
process.on('SIGINT', exitHandler.bind(() => cleanExit(), { cleanup: true } ));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(() => cleanExit(), {exit:true}));