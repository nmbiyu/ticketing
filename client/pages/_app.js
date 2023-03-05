import 'bootstrap/dist/css/bootstrap.css';

import buildClient from '../api/build-client';

// See https://nextjs.org/docs/messages/css-global on importing Global CSS.
const App = ({ Component, pageProps, currentUser }) => {
    return (
        <div>
            <h1>Header! {currentUser.email}</h1>
            <Component {...pageProps} />
        </div>
    );
}

App.getInitialProps = async (appContext) => {
    const client = buildClient(appContext.ctx);
    const { data } = await client.get('/api/users/currentuser');
    const pageProps = appContext.Component.getInitialProps
        ? await appContext.Component.getInitialProps(appContext.ctx)
        : {};
    return {
        pageProps,
        currentUser: data.currentUser
    };
};

export default App;