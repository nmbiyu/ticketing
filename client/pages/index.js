const Landing = ({ currentUser }) => {
    return currentUser
        ? <h1>You are signed in</h1>
        : <h1>You are not signed in</h1>;
}

Landing.getInitialProps = async (context) => {
    return {};
};
export default Landing;