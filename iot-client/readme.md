## create iot type, group and policy
in aws iot-core create thing type, thing groups and secure policy

* thing types : `imdf`
* thing groups: `imdf`
* secure policies: `imdf-policy`

```JSON
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "iot:Subscribe",
        "iot:Receive",
        "iot:Connect"
      ],
      "Resource": "*"
    }
  ]
}
```

## create iot things with certificates

* create a single thig, name is user name (e.g. `haris`)
* add `imdf` as type
* add thing into `imdf` group
* create one-click certificate
* activate the certificate
* attach `imdf-policy` to the certificate

## transfer certificate from different accounts

### original account

* deactivate certificate
* detach policy
* detach thing
* click `action` -> `start transfer`, enter accountId (12 digit number)

### destination account

* in aws iot certificate list, you will see pending certificate
* click individual certificate and click `accept transfer`
* re-attach thing, policy and re-activate certificate
