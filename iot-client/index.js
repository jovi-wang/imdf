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
    host,
    autoResubscribe: true,

});

device.on('connect', ()=>{
    console.log('connect', new Date().toISOString());
    device.subscribe(SUBSCRIBE_TOPIC);
});

device.on('error', (err)=>{
    console.log(err, new Date().toISOString());
});
device.on('close', ()=>{
    console.log('close', new Date().toISOString());
});
device.on('reconnect', ()=>{
    console.log('reconnect', new Date().toISOString());
});
device.on('offline', ()=>{
    console.log('offline', new Date().toISOString());
});

device.on('message', (topic, payload)=>{
    const { device, state } = JSON.parse(payload.toString());
    console.log('device:', device);
    console.log('state:', state);

    if (device === clientId) {
        if (state === 'wfh')
            spawn('python3', ['./led_wfh.py']);
        if (state === 'wfo')
            spawn('python3', ['./led_wfo.py']);
    }
});

//run wfo office in case 
setInterval(()=>{
    const current = new Date();
    console.log('timestamp:', current.toISOString());
    if(current.getHours() === 0) {
        console.log('it is time to reserver all desk now');
        spawn('python3', ['./led_wfo.py']);
    }
}, 60 * 60 * 1000);
