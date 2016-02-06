# course-manager-complete

### Getting started

Install **node.js**, then install **gulp**, and **bower** using **npm** with the following command.

    $ npm -g install gulp bower

Next clone the course manager seed project, which will serve as our application's skeleton:

    $ git clone https://github.com/backand/course-manager-complete.git
    $ cd course-manager-complete
    $ cd skeleton
    
Install the bower and npm dependencies, then run the application in development mode with gulp.

    $ npm install
    $ bower install
    $ gulp serve

Your application is now available at **http://127.0.0.1:3000**.

**Every file you add, edit or delete into the `/client` folder will be automatically detected by the build system**.

Now, let's tie the app together with backand. Create a new App in Backand from your account dashboard. Use the following model for your app:

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
Next, set your app to allow Anonymous access. This will allow you to use the app without having to build a set of users that have the appropriate permissions. This is accomplished from the application dashboard as follows:

* Open section `Security & Auth`
* Select `Configuration`
* Click the toggle on the right side of the screen next to `Anonymous Access`
* Assign a role to Anonymous users (use `Admin` for now)
* Copy the value from the field under `Anonymous Token`

After your app has reached a good state, you can re-enable user authentication if you wish. Simply disable anonymous access, then configure users and registration for your application by following our [documentation](http://docs.backand.com/en/latest/index.html)

Once this has been finished, you next need to connect your app's code to your new Backand application. Update the following lines in `/client/src/app.js` with the following information:

```JavaScript
    BackandProvider.setAppName('-Your App Name-');
    BackandProvider.setAnonymousToken('-Your Anonymous Token-');
```

## Building the Courses page

#### Build course service
* Copy the contents of file `dataService.js` (in /client/src/common/services) into a new file - `coursesService.js`,  and change the class name to CourseService.
* Update the Backand URLs with the correct object name: `/1/objects/courses`. The final code for getUrl and getUrlForId will resemble the following:

```JavaScript
    //return Backand url for object
    function getUrl() {
      return Backand.getApiUrl() + '/1/objects/courses';
    }

    //return Backand url with object's id
    function getUrlForId(objectId) {
      return Backand.getApiUrl() + '/1/objects/courses/' + objectId;
    }
```
* Next, add the `coursesService.js` file reference into `index.html`

```HTML
    <script type="text/javascript" src="src/common/services/coursesService.js"></script>
```

#### Build Courses controller and template (ModelView)
* Create a new folder `courses` in /src/app
* Copy the file `home.controller.js`  from `/src/app/home`into the new `courses` folder, and rename the file as `courses.controller.js`. The new full file name will be `/src/app/courses/courses.controller.js`
* Edit the file, changing all instances of `HomeCtrl` to `CoursesCtrl`
* Add `CoursesService` to the controller, replacing all instances of `DataService` 
* Add a new method to load all of the courses from the coursesService. Put this in the `resolve` handler, replacing the commented code from the original `HomeCtrl`. The call will be to `CoursesService.list();`
* Change the `dataService` parameter name to `coursesList`
* Modify the main copntroller body to have the following code:

```JavaScript
    var vm = this;
    vm.courses = null;

    //get the courses from the resolve
    vm.courses = coursesList.data.data;
```
* Add the controller to `input.html`:

```HTML
  <script type="text/javascript" src="src/app/courses/courses.controller.js"></script>
```

* Create a new HTML template `courses.tpl.html`, and add simple code (using `ng-repeat`) to display all courses:

```HTML
Courses:
<div class="container">
    <div ng-repeat="course in vm.courses">
        <h5>course name: {{course.name}}</h5>
    </div>
</div>
```

* Now Update `$stateProvider` in the controller to tie it all together:

```JavaScript
    $stateProvider
      .state('root.courses', {
        url: '/courses',
        views: {
          '@': {
            templateUrl: 'src/app/courses/courses.tpl.html',
            controller: 'CoursesCtrl',
            controllerAs: 'vm',
            resolve: {
              coursesList: function (CoursesService) {
                return CoursesService.list();
              }
            }
          }
        }
      })
```

At this point if we navigate to /courses we should see the list of courses available in your Backand app. This list may be empty if you haven't added any records to the Backand cloud service, but will update when you do!

#### Taking stock

It's important to note that at this point, you have a fully-functional web application. You have a server (your Backand App) and a client configured to connect with it. Your app will load the course list, fetching all of the data contained within your server, and will reflect any updates made on the server. From this point forward, it's all additional features!
 
#### Complete the CRUD for Courses
An app that simply lists courses is not particularly useful - we need to build out CRUD support for the Courses object.To do this, we need to add Create, Update, and Delete methods that call the Backand service, and update the template HTML to incorporate the new functionality.
 
* First, add the CRUD methods. Paste the following code into `courses.controller.js`:

```JavaScript
    var vm = this;
    vm.courses = null;
    vm.loading = [];

    //get the courses from the resolve
    vm.courses = coursesList.data.data;

    function readCourses(){
      CoursesService.list().then(
        function(coursesList){
          vm.courses = coursesList.data.data;
        }
      )
    }

    vm.createCourse = function(course, isValid) {
      if (isValid) {
        CoursesService.create(course)
          .then(function (result) {
            //add the new course locally
            vm.courses.push(result.data);
          })
          .catch(function (reason) {
            // alert
            console.log(reason);
          });
      }
    };

    vm.updateCourse = function(course, index){
      vm.loading[index] = true;

      CoursesService.update(course).
        then(function (result) {
          //do something good
          vm.loading[index] = false;
        })
        .catch(function (reason) {
          // alert
          console.log(reason);
        });
    };

    vm.deleteCourse = function(id){
      CoursesService.destroy(id).
        then(function (result) {
          //refresh the course list
          readCourses();
        })
        .catch(function (reason) {
          // alert
          console.log(reason);
        });
    }
  }
```
* Update the template with a section that allows you to adds new courses, as well as display the existing courses. Replace the HTML in `courses.tpl.html` with the following markup (*Note:* the seed project uses [Bootstrap](http://getbootstrap.com/2.3.2/) to enhance the appearance of the HTML):

```HTML

<div class="container">
    <div class="row">
        <div class="col-sm-4">
            <!-- NEW COURSE -->
            <div class="create board">
                <div class="caption">
                    <form
                        name="vm.createForm"
                        class="create-form"
                        role="form"
                        ng-submit="vm.createCourse(vm.newCourse, vm.createForm.$valid)"
                        novalidate>
                        <fieldset>
                            <div>
                                <input
                                    type="text"
                                    class="medium"
                                    ng-model="vm.newCourse.name"
                                    placeholder="Course Name"
                                    required>
                            </div>
                            <br/>
                            <div>
                                <input
                                    type="text"
                                    ng-model="vm.newCourse.description"
                                    placeholder="what's it about?"
                                    required>
                            </div>
                        </fieldset>
                        <button
                                type="submit"
                                class="btn btn-default btn-board">
                            <span class="glyphicon glyphicon-plus"></span>
                        </button>
                    </form>
                </div>
            </div>
        </div>

        <div class="col-sm-4" ng-repeat="course in vm.courses">
            <div class="edit board">
                <div class="pull-right">
                    <a href="" ng-click="vm.deleteCourse(course.id)"><span class="glyphicon glyphicon-trash"></span></a>
                </div>
                <div>
                    <input
                        type="text"
                        class="medium"
                        ng-model="course.name"
                        ng-blur="vm.updateCourse(course, $index)"
                        placeholder="Course Name">
                </div>
                <br/>
                <div>
                    <textarea
                       style="height:60px;"
                       ng-model="course.description"
                       ng-blur="vm.updateCourse(course, $index)"
                       placeholder="Course description."></textarea>
                </div>
                <!--<button
                      type="submit"
                      class="btn btn-default btn-board"
                      ui-sref="root.tasks({courseId: course.id})">Tasks >>
                </button>-->
                <br>
                <div>Tasks:</div>
                <div>{{course.task1}}</div>
                <div>{{course.task2}}</div>
                <span ng-show="vm.loading[$index]" class="glyphicon glyphicon-refresh"></span>
            </div>
        </div>
    </div>
</div>

```

#### Build Tasks module
In order to load the tasks for each course, we need to expand the courses service. For the CRUD functionality we will add a new a new 
service and new view.

* Add this method in coursesService.js to load tasks for a course:

```JavaScript
//return all tasks for specific course
function getTasks(courseId){
  return $http.get(getUrl() + '/' + courseId + '/tasks');
}
```

* Copy `dataService` from `/client/src/common/services` into a new file - `tasksService` - and change the class name in the code to `TasksService`.
* Update the Backand URL with the correct object name: '/1/objects/tasks'

```JavaScript

    //return Backand url for object
    function getUrl() {
      return Backand.getApiUrl() + '/1/objects/tasks';
    }

    //return Backand url with object's id
    function getUrlForId(objectId) {
      return Backand.getApiUrl() + '/1/objects/tasks/' + objectId;
    }
```

* Add the controller to input.html:

```HTML
  <script type="text/javascript" src="src/app/courses/tasks.controller.js"></script>
```

At this point, your app should be configured to pull in tasks for the currently selected course. Play around with the functionality, and see how it ties your app's display to the data stored in Backand's database.


