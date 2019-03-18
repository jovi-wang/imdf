const AWS = require('aws-sdk');
const crypto = require('crypto');

const iotdata = new AWS.IotData({
  endpoint: process.env.MQTT_ENDPOINT,
  apiVersion: '2015-05-28',
  region: process.env.AWS_REGION // pull region from lambda's env variable, not defined in serverless.yml
});

exports.webhook = async (event) => {
  const temp = validateSlackRequest(event);
  if (!temp) { 
    return {
      statusCode: 200,
      body: 'Opps, it seems you do not have a device on your desk, we can not change the availability of your desk'
    }; 
}
  const { device, state } = temp;

  console.log('device:', device);
  console.log('state:', state);


  const params = {
    topic: process.env.TOPIC,
    payload: JSON.stringify({
      device,
      state
    }),
    qos: 0
  };
  await iotdata.publish(params).promise();
  const body = {
    response_type: 'in_channel',
    text: ` ${state === 'wfo' ? ':red_circle:' : ':green_circle:'} \`${device}\`'s desk is ${state === 'wfo' ? 'not ' : ''}available now.`,
  };
  return {
    statusCode: 200,
    body: JSON.stringify(body)
  };
};

exports.reserveAll = async () => {
  console.log(new Date().toISOString());
  const deviceList = process.env.DEVICE_LIST.split(',');
  for (const device of deviceList) {
    const params = {
      topic: process.env.TOPIC,
      payload: JSON.stringify({
        device,
        state: 'wfo'
      }),
      qos: 0
    };
    await iotdata.publish(params).promise();
  }
};


// https://api.slack.com/docs/verifying-requests-from-slack
const validateSlackRequest = (event) => {
  const { SLACK_SIGNING_SECRET, USER_LIST, COMMAND_LIST } = process.env;
  // get token from event.body
  // sample value is 
  // token=m2GM275b7205B9WPUZQRDLR8&
  // team_id=T51SR7JVB&
  // team_domain=vmrcompanion&
  // channel_id=CGTBCAYC9&
  // channel_name=test&
  // user_id=U6AGRT5QS&
  // user_name=jovi&
  // command=%2Fwfh&
  // text=&
  // response_url=https%3A%2F%2Fhooks.slack.com%2Fcommands%2FT51SR7JVB%2F573528422358%2FSFgQwmQst9BcNFtfK7E3dnWM&trigger_id=573163749463.171909256997.d9bf41f4274c02b65aec0e0e3553db1d
  const requestBody = event.body;
  const bodyArray = requestBody.split('&');
  // token has been deprecated by slack
  //const token = bodyArray.find(i => i.includes('token=')).split('=')[1];
  const workspace = bodyArray.find(i => i.includes('team_domain=')).split('=')[1];
  const channel = bodyArray.find(i => i.includes('channel_name=')).split('=')[1];
  const command = bodyArray.find(i => i.includes('command=')).split('=')[1];
  const user = bodyArray.find(i => i.includes('user_name=')).split('=')[1];
  // extract the following 2 params
  //'X-Slack-Request-Timestamp': '1552215791'
  //'X-Slack-Signature': 'v0=429af94cf227df882bb48c4113fd4e5918919739ce02e67550ce25513bd6efa2'

  const timestamp = event.headers['X-Slack-Request-Timestamp'];
  const signature = event.headers['X-Slack-Signature'];
  // The request timestamp is more than five minutes from local time. 
  // It could be a replay attack, so let's ignore it.
  if (Math.floor(Date.now() / 1000) - Number(timestamp) > 5 * 60) return false;

  // verify slack signature
  const signatureBaseString = `v0:${timestamp}:${requestBody}`;
  const hmac = crypto.createHmac('sha256', SLACK_SIGNING_SECRET);
  const hash = `v0=${hmac.update(signatureBaseString).digest('hex')}`;
  if (hash !== signature) return false;

  // check if command is valid
  if (!COMMAND_LIST.split(',').includes(command)) return false;

  // check if team, channel and member are valid
  if (!USER_LIST.split(',').includes(`${workspace}/${channel}/${user}`)) return false;

  return {
    device: user,
    state: command.substring(3)
  };
};

