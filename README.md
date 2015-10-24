# course-manager-complete

### Getting started

Install **node.js**. Then **gulp** and **bower** if you haven't yet.

    $ npm -g install gulp bower

After that, let's clone the course manager seed project, which will serve as our application's skeleton:

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
    BackandProvider.setAnonymousToken('Your Anonymous Token');
```

* The AnonymousToken will let you use the app without the need for username and password. Later you can add turn it 
off and require users to login first.


## Building the Courses page

#### Build course service
* Copy dataService under /client/src/common/services into coursesService and change the name to CourseService.
* Update the Backand URL with the correct object name: '/1/objects/courses'

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
* Add the new file into index.html

```HTML
    <script type="text/javascript" src="src/common/services/coursesService.js"></script>
```

#### Build Courses controller and template (mv)
* Create new folder `courses` under /src/app
* Copy home controller to be courses.controller.js into the `/src/app/courses`
* Change the name to CoursesCtrl in all places
* Add CoursesService to the controller and a new method to load all the service (Replace DataService in all places)
* In the resolve method call `CoursesService.list();`
* Change the data input parameter to `coursesList`
* The main controller code should be:

```JavaScript

    var vm = this;
    vm.courses = null;

    //get the courses from the resolve
    vm.courses = coursesList.data.data;
```
* Add the controller to input.html:

```HTML
  <script type="text/javascript" src="src/app/courses/courses.controller.js"></script>
```

* Create a new HTML template `courses.tpl.html" and add a simple code to use ng-repeater to show all courses

```HTML
Courses:
<div class="container">
    <div ng-repeat="course in vm.courses">
        <h5>course name: {{course.name}}</h5>
    </div>
</div>
```

* Now Update $stateProvider in the controller to be like this:

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

At this point if we navigate to /courses we should see the list (or empty list if we haven't add any from the Backand
 cloud service).
 
#### Complete the CRUD for Courses
To complete the CRUD we would need to add the Create, Update and Delete methods that call the service and the 
template HTML.
 
* Add CRUD methods:

```JavaScript
    var vm = this;
    vm.courses = null;
    vm.loading = [];

    //get the courses from the resolve
    vm.courses = coursesList.data.data;

    function readCourses(){
      CoursesService.list().then(
        function(couses){
          vm.courses = couses.data.data;
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
* Update the template with section that adds new courses and display the courses. Replace the existing template with 
the following HTML (to make it look better we use Bootstrap classes):

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
In order to load the tasks we need to expand the courses service. For the CRUD functionality we will add a new a new 
service and new view.

* Load a tasks for specific course, add this method in coursesService.js:

```JavaScript
//return all tasks for specific course
function getTasks(courseId){
  return $http.get(getUrl() + '/' + courseId + '/tasks');
}
```

* Copy dataService under /client/src/common/services into tasksService and change the name to TasksService.
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




