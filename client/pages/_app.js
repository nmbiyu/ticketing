import 'bootstrap/dist/css/bootstrap.css';

import buildClient from '../api/build-client';
import Header from '../components/header';

// See https://nextjs.org/docs/messages/css-global on importing Global CSS.
const App = ({ Component, pageProps, currentUser }) => {
    return (
        <div>
            <Header currentUser={currentUser} />
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