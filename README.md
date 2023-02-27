## Summary

This is an application created by following along this course.
https://www.udemy.com/course/microservices-with-node-js-and-react.

## Required Tools

The following should be installed in the local development environment.

* Docker Engine: https://docs.docker.com/engine/install/
* Kubectl: https://kubernetes.io/docs/setup/ and https://kubernetes.io/docs/tasks/tools/#kubectl
* Minikube: https://kubernetes.io/docs/tasks/tools/#minikube
* Google Cloud CLI: https://cloud.google.com/sdk/docs/install
* Skaffold: https://skaffold.dev/

## Kubernetes contexts

The app can be deployed in either the local minikube context or in the Google Cloud Kubernetes cluster.

### Minikube context

* To use the minikube context, run the following commands.
  * `minikube start`
  * `kubectl config get-contexts`
  * `kubectl config use-context <minikube-context-name>`
* Install ingress-nginx on Minikube: https://kubernetes.github.io/ingress-nginx/deploy/#minikube
* Edit the `/etc/hosts` file to direct traffic to ticketing.dev to minikube.
  * `minikube ip`
  * Add the following to `/etc/hosts`: `<IP> ticketing.dev`
* Update `skaffold.yaml` to use the local build config.
  * Use the local build config and comment out the googleCloudBuild config.
  * Update all image names to use the naming convention 'nmbiyu/<serviceName>', e.g 'nmbiyu/auth'.
    This should be done in the deployment files as well.

### Google cloud context

To use the Google Cloud context:
* Initialise the Google Cloud CLI if this has not been done.
  * `gcloud init`.
* Log into Google Cloud:
  * `gcloud auth application-default login`.
* Set the GCloud context:
  * `kubectl config get-contexts`
  * `kubectl config use-context <gcloud-context-name>`
* Install ingress-nginx on Google Cloud: https://kubernetes.github.io/ingress-nginx/deploy/.
* Edit the `/etc/hosts` file to direct traffic to ticketing.dev to Google Cloud.
  * The Load balancer IP address can be found as follows:
    * Open the Google Cloud project.
    * Navigate to Networking services / Load balancing.
    * Click on the load balancer for more details. There should be an IP address there.
    * Add the following to `/etc/hosts`: `<IP> ticketing.dev`
* Update `skaffold.yaml` to use the gCloud build config.
  * Use the local build config and comment out the googleCloudBuild config.
  * Update all image names to use the naming convention 'us.gcr.io/ticketing-dev-379109/<serviceName>', e.g 'nmbiyu/auth'.
    This should be done in the deployment files as well. ticketing-dev-379109 is the cluster ID in Google Cloud.
    It may change if we destroy the cluster and create it afresh.

## Running the application

* Navigate to the root of the project and run `skaffold dev`.
* A test API can be accessed at http://ticketing.dev/api/users/currentuser.
