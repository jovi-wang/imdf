const deviceId = 'jovi';
const certificatePrefix = 'a27a9d8d5d';

module.exports = {
    awsKeyPath: `./certificates/${certificatePrefix}-private.pem.key`,
    awsCertPath: `./certificates/${certificatePrefix}-certificate.pem.crt`,
    awsCaPath1: './certificates/AmazonRootCA1.pem',
    awsCaPath2: './certificates/AmazonRootCA2.pem',
    awsCaPath3: './certificates/AmazonRootCA3.pem',
    awsCaPath4: './certificates/AmazonRootCA4.pem',
    clientId: deviceId,
    host: 'auj2585okxix9-ats.iot.ap-southeast-2.amazonaws.com'
}