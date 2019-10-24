import React from 'react';
import ReactDOM from 'react-dom';
import BlockNumber from './BlockNumber.js'

class Greeting extends React.Component {
    render() {
        return <div>
            <h1>Hello, world</h1>
        </div>;
    }
}

class App extends React.Component {
    render() {
        return <div>
            <Greeting />
            <BlockNumber />
        </div>;
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);
