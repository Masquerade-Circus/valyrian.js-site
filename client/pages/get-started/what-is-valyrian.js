import Layout from './layout';

export default v(() => <Layout>
    <div data-card="full-width">
        <section>
            <h2>What is Valyrian.js?</h2>
                    Valyrian.js is a javascript framework whose sole prupouse is to be lighter (9kb minified 3.4kb gzipped) but powerful enough to build production ready Progressive Web App\s.
            <br/><br/>
            <h2>Core principles</h2>
            <ul>
                <li>Write code once for server and client. (Although browser specific events will not work on node).</li>
                <li>Give the developer tools to generate all that its needed to build a Progressive Web App, icons, splash screens, manifest.json, service workers, etc.</li>
                <li>The average developer must be able to learn the api and start building PWA\'s in less than an hour.</li>
            </ul>
            <br/>
            <h2>Hello world</h2>
            <iframe width="100%" height="300" src="//jsfiddle.net/masqueradecircus/gdj3tyac/29/embedded/js,result/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>
        </section>
    </div>
</Layout>);
