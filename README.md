# Instructions

## Pre-Requisites

You should have the latest Node and NPM installed, and they should be on your path.

> Windows

~~~
C:\src\ko-starter-kit-ts> node --version  
v0.10.32  
C:\src\ko-starter-kit-ts> npm --version  
2.1.4  
~~~

> Mac

~~~ bash
$ node --version
$ v0.10.32
$ npm --version
$ 2.1.4
~~~

### Install required global NPM modules
  1. Start a shell (on Windows, this should be run as Administrator)
  2. Install Typescript, Karma-CLI, Bower, Gulp, and Http-Server

    ~~~
    C:\src\ko-starter-kit-ts> npm install -g typescript karma-cli bower gulp
    ~~~

    ~~~ bash
    $ npm install -g typescript karma-cli bower gulp
    ~~~

### Install NPM and Bower dependencies
  1. Start a shell
  2. Install NPM and Bower deps

    ~~~
    C:\src\ko-starter-kit-ts> npm install  
    ... wait ...  
    C:\src\ko-starter-kit-ts> bower install  
    ... wait ...
    C:\src\ko-starter-kit-ts> cd test
    C:\src\ko-starter-kit-ts\test> bower install
    ... wait ...
    C:\src\ko-starter-kit-ts\test> cd ..
    C:\src\ko-starter-kit-ts>
    ~~~

## Running the site

  1. We use Gulp to compile and build the project.
    + Run gulp by opening a command prompt in the front directory and run the gulp command.

    ~~~
    C:\src\ko-starter-kit-ts> gulp
    ~~~

  2. This will start browser-sync (a self-reloading server), and open a browser to your site.

  3. If you wish to work with the optimized files, you can change the `gulpfile.js` to run browser-sync from your `dist` folder instead:

    ~~~ javascript
    // Config
var browserSyncConfig = {
    server: {
        baseDir: './dist'
    },
    ~~~
