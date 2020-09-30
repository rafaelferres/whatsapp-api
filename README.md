# Whatsapp Unofficial API

API for automation of your whatsapp

## Installation

To install Whatsapp Unofficial API. WAPI.js

```bash
git clone https://github.com/rafaelferres/whatsapp-api.git
```

## Usage

Create a file called .env
```.env
#Bot config
TOKEN=616ac9b5-3dda-4911-83bb-b718fed48330 #bearer token to consume api
PORT=3001 #Port of Socket.IO and Express
```

Install modules : 

```
yarn
```
or
```
npm install
```

Run: 
```
yarn dev
```
or
```
npm run-script dev
```

Access the ./src/index.ts file to adapt the functions as needed.

```typescript
import { Service } from "./services";

var service = new Service();

service.run();

service.event.on("receive", (data) => { //webHook - Event receiving messages
    console.log(data);
});

service.event.on("send", (data) => { // Event that returns the sending of messages
    console.log(data);
});
```

## Endpoint
Post to /api/v1/message by passing the token configured in the .env in the Bearer Token and sending a json in the following structure:

``` JSON
{
	"id": 1,
	"type": "text",
	"to": "5511912345678",
	"body": "Opa"
}
```

| Key  | Description |  Type |
| ------------- | ------------- | ------------- |
| id | You need to pass an ID to your messages. This ID can be generated in any way  | String |
| type | Fixed "text"  | String |
| to | Telephone with country code without spaces and special characters| String|
| body | Message to be sent | String|

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)