### Overview

This is a simple application aimed at showing the concepts behind NATS streaming. The project consists of two files in
the src directory - publisher.ts and listener.ts. They connect to the NATS streaming server running in our k8s cluster
and emit / consume events.

#### Accessing the nats-streaming server

The NATS streaming server running in the k8s cluster can be accessed in one of three ways.
* Using a Cluster IP service that is accessed via Ingress-Nginx.
* Using a NodePort service that exposes the NATS pod.
* Port forwarding.

Given we want to demonstrate what happens when our clients lose connection to the NATS server, port forwarding is the
easiest way to break the connection. We shall thus use that.

#### Running the project

To get the project running, we need to do the following.
* `cd ticketing && skaffold dev`: This starts the k8s cluster.
* `kubectl get pods` gets the running pods. Example output.
    ```
    $ kubectl get pods
    NAME                                  READY   STATUS    RESTARTS   AGE
    auth-depl-54d999bb7f-fzzws            1/1     Running   0          17s
    auth-mongo-depl-7f67df794c-ls9wr      1/1     Running   0          17s
    client-depl-896bc855-c94m9            1/1     Running   0          17s
    nats-depl-6fbfdd77c9-7ldng            1/1     Running   0          17s
    tickets-depl-5b5544ffcd-f754l         1/1     Running   0          17s
    tickets-mongo-depl-74f854c549-nb87z   1/1     Running   0          17s
    ```
* `kubectl port-forward <pod-name> host-port:guest-port`. Given the output above we would the command 
`kubectl port-forward nats-depl-6fbfdd77c9-7ldng 4222:4222` to forward requests made to port 4222 on our host to port
4222 running on the guest (k8s pod). Here is an example of the output we expect.
    ```
    $ kubectl port-forward nats-depl-6fbfdd77c9-7ldng 4222:4222
    Forwarding from 127.0.0.1:4222 -> 4222
    Forwarding from [::1]:4222 -> 4222
    ```
* Open a new terminal window and run the command `npm run publish` to run the `publisher.ts` script. See the scripts
section in `package.json`.
* Open a new terminal window and run the command `npm run listen` to run the `listener.ts` script. See the scripts
section in `package.json`.