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

The app can be deployed in either the local minikube context or in the Google Cloud Kubernetes cluster. Here are some
valuable context related commands.
* `kubectl config get-contexts`

### Minikube context

* To use the minikube context, run the following commands.
  * `minikube start`
  * `kubectl config get-contexts`
  * `kubectl config use-context <minikube-context-name>`
* Install ingress-nginx on Minikube: https://kubernetes.github.io/ingress-nginx/deploy/#minikube
  * Verify that the controller pod is running. `kubectl get pods --namespace=ingress-nginx`. Here is example output.
    ```
     $ kubectl get pods --namespace=ingress-nginx
       NAME                                       READY   STATUS      RESTARTS       AGE
       ingress-nginx-admission-create-xt5cs       0/1     Completed   0              5d22h
       ingress-nginx-admission-patch-gp9cv        0/1     Completed   0              5d22h
       ingress-nginx-controller-77669ff58-89575   1/1     Running     11 (63m ago)   5d22h
    ```
* Edit the `/etc/hosts` file to direct traffic to ticketing.dev to minikube.
  * `minikube ip`
  * Add the following to `/etc/hosts`: `<IP> ticketing.dev`
* Update `skaffold.yaml` to use the local build config.
  * Use the local build config and comment out the googleCloudBuild config.
  * Update all image names to use the naming convention 'nmbiyu/<serviceName>', e.g 'nmbiyu/auth'.
    This should be done in the deployment files as well. Run the following command to update the deployment files.
    * `./configure-deployment-context minikube`

### Google cloud context

To use the Google Cloud context:
* Create the cluster if that has not already been done.
  * Visit https://console.cloud.google.com
  * On the hamburger menu, visit Kubernetes Engine / Clusters.
  * Click on the Create Cluster button.
  * Select the Standard cluster mode.
  * Fill in the following cluster details.
    * Name: ticketing-dev
    * Location type: Zonal
    * Zone: Use https://googlecloudplatform.github.io/region-picker/ to select the best zone.
    * Specify default node locations: Leave this unchecked.
    * Control plane version: Release channel.
    * Release channel and version: Use defaults.
  * In the menu on the left, click on NODE POOLS / default-pool. Use default values.
  * Visit NODE POOLS / default-pool / Nodes
    * Machine configuration
      * Series: N1
      * Machine type: g1-small
* Install the gcloud CLI. https://cloud.google.com/sdk/docs/install
* Log into Google Cloud:
  * `gcloud auth login`.
* Initialise the Google Cloud CLI if this has not been done.
  * `gcloud init`.
* Get credentials for the container:
  * `gcloud container clusters get-credentials ticketing-dev`
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
  * Update all image names to use the naming convention 'us.gcr.io/ticketing-dev-379109/<serviceName>', e.g 'us.gcr.io/ticketing-dev-379109/auth'.
    This should be done in the deployment files as well. ticketing-dev-379109 is the cluster ID in Google Cloud.
    It may change if we destroy the cluster and create it afresh. Run the following command to update the deployment
    files.
    * `./configure-deployment-context gcp`

## Secrets

A Secret is an object that contains a small amount of sensitive data such as a password, a token, or a key. Such 
information might otherwise be put in a Pod specification or in a container image. Using a Secret means that you don't
need to include confidential data in your application code. See https://kubernetes.io/docs/concepts/configuration/secret/.


### Creating Secrets

For each new cluster, we need to create the secret(s) using the command(s) below. We do not want to store this in config
files since it would expose the secrets.

* `kubectl create secret generic jwt-secret --from-literal JWT_KEY=asdf`
* `kubectl create secret generic stripe-secret --from-literal STRIPE_KEY=<stripe_secret_key>`

The command above creates a secret key whose reference name is `"jwt-secret"` and with a key-value pair of 
`"JWT_KEY=asdf"`.

To list secrets, run `kubectl get secrets`.

### Using Secrets

The deployment files have configuration that gets the secrets from the cluster and include them as environment variables
in the container. The containers then reference the variables in the code.

Deployment configuration below creates an environment variable named `"JWT_KEY"` whose value shall come from secret by
whose reference name is `"jwt-secret"` and whose key is `"JWT_KEY"`.
```yaml
    spec:
      containers:
        - name: auth
          image: us.gcr.io/ticketing-dev-379109/auth
          env:
            - name: JWT_KEY
              valueFrom:
                secretKeyRef:
                  name: jwt-secret
                  key: JWT_KEY
```

Microservice source code:
```javascript
process.env.JWT_KEY
```

## Running the application

* Navigate to the root of the project and run `skaffold dev`.
* A test API can be accessed at http://ticketing.dev/api/users/currentuser.

## Accessing mongo database

It may be necessary to access the mongo database. To do so, run the `mongo` command on the pod running the mongo
deployment to be accessed.

* `kubectl get pods` to list all pods.
* `kubectl exec -it <mongo-deployment-pod> mongo` opens a mongo shell.

Here are a few useful commands.

* show dbs;
* use <db-name>;
