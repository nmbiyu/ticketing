import axios from "axios";

const Landing = ({ currentUser }) => {
    console.log(currentUser);
    return <h1>Landing Page</h1>
}

Landing.getInitialProps = async ({ req }) => {
    if (typeof window === 'undefined') {
        // We are on the server. Request should be made to Ingress nginx.
        // Base name for the URL shall be of the form:
        //  http:${SERVICE_NAME}.${NAMESPACE}.sv.cluster.local
        // To get the values, run the following.
        // - kubectl get namespaces to get the namespaces. There should be one by the name ingress-nginx.
        // - kubectl get services -n ingress-nginx. For minikube, there should be a NodePort by the name "ingress-nginx-controller"
        const { data } = await axios.get('http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser', {
            headers: req.headers
        });
        return data;
    } else {
        // We are on the browser. Request should be made with a base url of ""
        const { data } = await axios.get('/api/users/currentuser');
        return data;
    }
};
export default Landing;