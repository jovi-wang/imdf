
## steup
### install pm2 globally

`npm install pm2 -g
cd imdf/iot-client
pm2 --name "imdf" start npm -- start`

setup system startup hook using 

`pm2 startup`

follow instruction prompt and save config
`sudo su -c "env PATH=$PATH:/home/unitech/.nvm/versions/node/v4.3/bin pm2 startup <distribution> -u <user> --hp <home-path>`

`pm2 save`

install python library to light led