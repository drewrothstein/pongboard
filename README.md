# pongboard

Sources:
* https://github.com/gui81/scorekeeper
* https://github.com/rtfoley/pongboard

Likely will be copied by [Table Tennis Terry](https://github.com/drewrothstein/table-tennis-terrys-tournament-tracker) and [Petey Ping Ponger](https://github.com/drewrothstein/petey-ping-pongers-ptournament-ptracker).


## Quick Start

### Checkout pongboard:
    https://github.com/drewrothstein/pongboard.git

### Get Meteor and Meteorite
Install [meteor.js](https://www.meteor.com/) and install [meteorite](http://oortcloud.github.io/meteorite/).

### Run
    cd pongboard/app
    mrt

### View
    http://localhost:3000

## Hosting

### Modulus
Modulus.io provides simple and scalable Meteor project hosting.

#### Setup
* Install CLI tool: `npm install -g modulus`
* Sign-up: `modulus signup`
* Login: `modulus login`
* Create Project: `modulus project create`
* Create Database: (only able to be completed through WebUI currently)
* Deploy Project: `modulus deploy`
* Set MongoDB URL:
  * `modulus env set MONGO_URL "mongodb://user:pass@proximus.modulusmongo.net:27017/<ID_FROM_CREATE_DATABASE>?autoReconnect=true&connectTimeoutMS=60000"`
* Set Root URL:
  * `modulus env set ROOT_URL http://<ID_FROM_DEPLOY>.onmodulus.net`
* Restart: `modulus project restart`

##### View
    http://<ID_FROM_DEPLOY>.onmodulus.net

#### SSL
Modulus offers SSL for free, just access your `ROOT_URL` from `https`.

#### Custom Domain
Modulus has the ability to support custom domains but if you want to use them with SSL, they don't offer a nice solution (other than handing them your private keys w/o a passphrase).
More details are available [here](https://modulus.io/codex/projects/domains) and [here](https://modulus.io/codex/projects/ssl).
