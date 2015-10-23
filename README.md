# course-manager-complete

### Getting started

Install **node.js**. Then **gulp** and **bower** if you haven't yet.

    $ npm -g install gulp bower

After that, install angular-kickstart downloading the [master release](https://github.com/backand/angular-kickstart/archive/master.zip) (or clone the master branch if you want to run the development version). 

    $ git clone https://github.com/backand/course-manager-complete.git
    $ cd course-manager-complete
    $ cd skeleton
    
Install bower and npm dependencies, and run the application in development mode.

    $ npm install
    $ bower install
    $ gulp serve

You are now ready to go, your application is available at **http://127.0.0.1:3000**.

**Every file you add, edit or delete into the `/client` folder will be handled by the build system**.

Create new App in Backand with the following model:

```JSON
[
  {
    "name": "courses",
    "fields": {
      "name": {
        "type": "string"
      },
      "description": {
        "type": "text"
      },
      "user": {
        "object": "users"
      },
      "tasks": {
        "collection": "tasks",
        "via": "course"
      },
      "task1": {
        "type": "string"
      },
      "task2": {
        "type": "string"
      }
    }
  },
  {
    "name": "tasks",
    "fields": {
      "description": {
        "type": "text"
      },
      "dueDate": {
        "type": "datetime"
      },
      "completed": {
        "type": "boolean"
      },
      "course": {
        "object": "courses"
      }
    }
  },
  {
    "name": "users",
    "fields": {
      "email": {
        "type": "string"
      },
      "firstName": {
        "type": "string"
      },
      "lastName": {
        "type": "string"
      },
      "courses": {
        "collection": "courses",
        "via": "user"
      }
    }
  }
]

```

Update App to work with Backand, update the following lines with your new app's info

```JavaScript
    BackandProvider.setAppName('-Your App Name --');
    //BackandProvider.setAnonymousToken('Your Anonymous Token');
```

* The AnonymousToken will let you use the app without the need for username and password. Later you can add turn it 
off and require users to login first.


## Building the Courses page

#### Build course service
Copy dataService under /client/src/common/services into coursesService and change the name to CourseService.




