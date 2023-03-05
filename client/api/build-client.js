import axios from "axios";

export default ({ req }) => {
    if (typeof window === 'undefined') {
        // We are on the server. Request should be made to Ingress nginx.
        // Base name for the URL shall be of the form:
        //  http:${SERVICE_NAME}.${NAMESPACE}.sv.cluster.local
        // To get the values, run the following.
        // - kubectl get namespaces to get the namespaces. There should be one by the name ingress-nginx.
        // - kubectl get services -n ingress-nginx. For minikube, there should be a NodePort by the name "ingress-nginx-controller"
        return axios.create({
            baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
            headers: req.headers
        });
    } else {
        // We are on the browser.
        return axios.create({
            baseURL: '/'
        });
    }
}