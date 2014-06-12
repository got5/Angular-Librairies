TrainingAngularJS
=================

This repo  contains the Lab project for the AngularJS Training.
for more details, have a look at [http://got5.github.io/Angular-Librairies/](http://got5.github.io/Angular-Librairies/)

## To install this application

Install a follow components

Use "**sudo**" to build with Mac and Linux

**install Node.js**

[http://nodejs.org/](http://nodejs.org/)

_Configure NPM proxy_
```bash
npm config set proxy http://[proxy]:[PORT]
npm config set https-proxy http://[proxy]:[PORT]
```

**install Bower**
```bash
npm install -g bower
```

**install bower lib**
```bash
bower install
```

**Install Karma**
```bash
npm install -g karma-cli
npm install -g karma
npm install -g karma-chrome-launcher
npm install -g karma-jasmine
```

## To execute test

**Execute Unit Tests**

launch tests
 ```bash
cd test
karma start karma.conf.js
 ```

## Can also be launched with a grunt task
grunt test:unit

## To execute application

Launch server
```bash
 node server
```

Application is now running in :

[localhost:3000](localhost:3000)


See also [got5/Angular-Libraries/angular-training](https://github.com/got5/Angular-Librairies/tree/master/angular-training)