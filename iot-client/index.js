const awsIot = require('aws-iot-device-sdk');
const { spawn } = require('child_process');
const { 
    awsKeyPath,
    awsCertPath,
    awsCaPath1,
    awsCaPath2,
    awsCaPath3,
    awsCaPath4,
    clientId,
    host 
    }= require('./config');
const SUBSCRIBE_TOPIC = 'imdf';

const device = awsIot.device({
    keyPath: awsKeyPath,
    certPath: awsCertPath,
    caPath: awsCaPath1,
    clientId,
    host
});

device.on('connect', ()=>{
    console.log('connect');
    device.subscribe(SUBSCRIBE_TOPIC);
});

device.on('error', (err)=>{
    console.log(err);
});
device.on('close', ()=>{
    console.log('close');
});
device.on('reconnect', ()=>{
    console.log('reconnect');
});
device.on('offline', ()=>{
    console.log('offline');
});

device.on('message', (topic, payload)=>{
    console.log(topic.toString());
    console.log(payload.toString());

    const { device, state } = JSON.parse(payload.toString());
    console.log('device:', device);
    console.log('state:', state);

    if (device === clientId) {
        if (state === 'wfh')
            spawn('python3', ['./led_wfh.py']);
        if (state === 'wfo')
            spawn('python3', ['./led_wfo.py']);

    }
})

