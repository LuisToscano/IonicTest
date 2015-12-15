/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function () {
    angular.module('todo', ['ionic'])
            .controller('taskController', function ($scope, $ionicModal, $projects) {
                $scope.current = $projects.current;

                $scope.existsProject = function(){
                  console.log($scope.current.title.trim().length > 0);
                  return $scope.current.title.trim().length > 0;  
                };
                
                $scope.createTask = function (task) {
                    $projects.newTask(task);
                    $scope.taskModal.hide();
                    task.title = "";
                };

                $scope.newTask = function () {
                    $scope.taskModal.show();
                };

                // Close the new task modal
                $scope.closeNewTask = function () {
                    $scope.taskModal.hide();
                };

                $ionicModal.fromTemplateUrl('new-task.html', function (modal) {
                    $scope.taskModal = modal;
                }, {
                    scope: $scope,
                    animation: 'slide-in-up'
                });
            })

            .controller('projectController', function ($scope, $ionicModal, $projects, $ionicSideMenuDelegate) {
                $scope.projects = $projects.list;
                $scope.tempProject = {
                };

                $scope.createProject = function () {
                    $projects.newProject($scope.tempProject);
                    $scope.projectModal.hide();
                    $scope.tempProject = {};
                    $ionicSideMenuDelegate.toggleLeft();
                };

                $scope.changeProject = function (index) {
                    $projects.setActiveIndex(index);
                    $ionicSideMenuDelegate.toggleLeft();
                };

                $scope.newProject = function () {
                    $scope.projectModal.show();
                };

                // Close the new task modal
                $scope.closeNewProject = function () {
                    $scope.projectModal.hide();
                };

                $ionicModal.fromTemplateUrl('new-project.html', function (modal) {
                    $scope.projectModal = modal;
                }, {
                    scope: $scope,
                    animation: 'slide-in-up'
                });
            })

            .service('$projects', function () {
                //window.localStorage.removeItem('lastActiveProject');
                //window.localStorage.removeItem('projects');
                this.activeIndex = isNaN(parseInt(window.localStorage['lastActiveProject'])) ? -1 : parseInt(window.localStorage['lastActiveProject']);
                this.list = window.localStorage['projects'] ? angular.fromJson(window.localStorage['projects']) : [];
                
                this.current = {
                    title: this.activeIndex >= 0 && (this.activeIndex < this.list.length) ? this.list[this.activeIndex].title : "",
                    tasks: this.activeIndex >= 0 && (this.activeIndex < this.list.length) ? this.list[this.activeIndex].tasks : []
                };

                this.newProject = function (newproject) {
                    // Add a new project
                    console.log(newproject);
                    this.list.push({title: newproject.title, tasks: []});
                    this.activeIndex = this.list.length - 1;
                    this.current.title = this.list[this.activeIndex].title;
                    console.log(this.current);
                    window.localStorage['projects'] = angular.toJson(this.list);
                    window.localStorage['lastActiveProject'] = this.activeIndex;
                };

                this.newTask = function (task) {
                    // Add a new project
                    if (this.current.hasOwnProperty("tasks")) { 
                        this.list[this.activeIndex].tasks.push({title: task.title});
                        console.log(this.list[this.activeIndex].tasks);
                        console.log(this.current);
                        window.localStorage['projects'] = angular.toJson(this.list);
                    }
                };

                this.setActiveIndex = function (index) {
                    window.localStorage['lastActiveProject'] = index;
                    this.activeIndex = index;
                    this.current.title = this.list[this.activeIndex].title;
                    this.current.tasks = this.list[this.activeIndex].tasks;
                };

            });
})();

