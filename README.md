## Summary

This is an application created by following along this course. https://www.udemy.com/course/microservices-with-node-js-and-reac.

## Required Tools

The following should be installed in the local development environment.

* Docker Engine: https://docs.docker.com/engine/install/
* Kubectl: https://kubernetes.io/docs/setup/ and https://kubernetes.io/docs/tasks/tools/#kubectl
* Minikube: https://kubernetes.io/docs/tasks/tools/#minikube
* Skaffold: https://skaffold.dev/

## Set up and running the application

* To run the application, run the following commands.
  ```minikube start```
* Once complete, get minikube's IP using `minikube ip`.
* Add the following configuration to `/etc/hosts`. `<IP> posts.com`. This will direct all requests to posts.com to minikube.
* Navigate to the root of the project and run `skaffold dev`.
* A test API can be accessed at http://ticketing.dev/api/users/currentuser.
