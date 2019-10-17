import React from 'react';
import ReactDOM from 'react-dom';
import BlockNumber from './components/BlockNumber'
import Count from './components/Count'
import KeyAndAddress from './components/KeyAndAddress'

// simple component
class Greeting extends React.Component {
    render() {
        return (
            <div><h1>Hello, Count BApp</h1></div>
        );
    }
}

// root component
class App extends React.Component {
    constructor(props) {
        super(props);
        // reference to a child component
        this.countRef = React.createRef();
    }

    // note that the following definition must be declared as a variable
    propagateKey = (key) => {
        this.countRef.current.setPrivateKey(key);
    };

    render() {
        return (
            <div className="App">
                <Greeting />
                <BlockNumber />
                <KeyAndAddress propagateKey={this.propagateKey} />
                <Count ref={this.countRef} />
            </div>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);
