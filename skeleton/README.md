# [backand-angular-kickstart](https://github.com/backand/angular-kickstart/)

**Speed up your [AngularJS](http://angularjs.org) development with a complete and scalable gulpjs based build system that scaffolds the project for you. Just focus on your app, angular-kickstart will take care of the rest.**
***

### What and Why

There is no doubt that AngularJS has earned its place as one of the most powerful JavaScript frameworks available. The ability to quickly and sanely create production grade web applications with AngularJS has opened up a whole new frontier of possibilities for developers around the world. With Backand, you can take this to an entirely new level by quickly and painlessly adding a powerful backend to your AngularJS application. Come join us as we take an existing RESTful application and convert it to use Backand's cloud-based services in minutes. We will also show how we can easily customize security, send emails or notifications, apply app rules and call other apps via HTTP. There has never been a better time to build better things faster!

### Getting started

Install **node.js**. Then **gulp** and **bower** if you haven't yet.

    $ npm -g install gulp bower

After that, install angular-kickstart downloading the [master release](https://github.com/backand/angular-kickstart/archive/master.zip) (or clone the master branch if you want to run the development version). 

    $ git clone https://github.com/backand/angular-kickstart.git
    $ cd angular-kickstart
    
Install bower and npm dependencies, and run the application in development mode.

    $ npm install
    $ bower install
    $ gulp serve

You are now ready to go, your application is available at **http://127.0.0.1:3000**.

**Every file you add, edit or delete into the `/client` folder will be handled by the build system**.

When you are ready to build a production release there is a task for that:

    $ gulp serve:dist

This task will lint your code, optimize css js and images files, run unit tests. After the task has successfully finished, you can find an optimized version of your project inside the  `/build/dist` folder.

### Features

* Backand SDK included, just sign in to your app and the entire back-end is ready.
* 5 simple task: `gulp serve`,`gulp serve:dist`, `gulp serve:tdd`, `gulp test:unit`, `gulp test:e2e`
* JavaScript file continuous linting with `jshint`.
* SASS continuous compiling.
* `Unit` and `e2e` testing support. (for `e2e` testing you need to have a java runtine installed, take a look at [selenium JavaScript api ](http://selenium.googlecode.com/git/docs/api/javascript/index.html) and [protractor](https://github.com/angular/protractor) for more informations.
* HTML templates converted into strings and attached to a single javascript file (to avoid one http call for each template).
* Livereload provided by [browsersync](http://www.browsersync.io/).
* angular module dependencies automatically injected using [ng-annotate](https://github.com/olov/ng-annotate).
* Static resources minification and optimization for production.
* sourcemaps generated and embedded in JavaScript and css files during the production optimization.

### Directory Structure

* `build/` - Build files and configuration, the most important files to note are `build.config.js`, `protractor.config.js` and `karma.config.js`. These files are the heart of the build system. Take a look.
* `client/` the source code and tests of your application, take a look at the modules in this folder, you should structure your application following those conventions, but you can choose another convention as well.
* `.bowerrc` - the bower configuration file. This tells Bower to install components in the `client/src/vendor` directory.
* `.jshintrc` - JSHint configuration.
* `gulpfile` - see [The Build System](#thebuildsystem) below.
* `bower.json` - Contains the list of bower dependencies.
* `package.json` - node.js dependencies.

### <a name="thebuildsystem"></a>The Build System

There are some `tasks` available in `gulpfile.js`. You can dig into the file to familiarize yourself with gulpjs.

A description of every available task:

* **gulp serve** - When this task runs, the build will take care of watching files. Every time you change a file in the `client/` folder, the build recompiles every file, and your browser will reload automagically showing you the changes.
You just need to add new JavaScript and css files in the `client/index.html` file.
* **gulp serve:dist** - This task will run jshint and unit tests under the `client/test/unit` folder (thanks to `karma runner`), and create a fully-optimized version of your application under the `build/dist/` folder. The optimization consists of concatenate, minify and compress js and css files, optimize images, and put every template into a js file loaded by the application.
A code coverage report will be available inside the `client/test/unit-results`.
* **gulp serve:tdd** - Just like `gulp serve` but in continuous unit testing environment.
* **gulp test:unit** - For running unit tests one time then exit.
* **gulp test:e2e** - Run end-to-end tests inside the `client/test/e2e` folder with `protractor`. If a test fails, you should find a screenshot of the page inside the `client/test/screenshots` folder.
**Note that you need to have the application running in order to run e2e tests. You can launch this task from another terminal instance.**

### Contributing

PR and issues reporting are always welcome :)

### License

See LICENSE file

### Changelog

See CHANGELOG.md file

### Thank you, community!

All this wouldn't have been possible without these great [contributors](https://github.com/vesparny/angular-kickstart/graphs/contributors) and everybody who comes with new ideas and suggestions.
