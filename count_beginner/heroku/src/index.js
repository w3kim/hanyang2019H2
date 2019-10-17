import React from 'react';
import ReactDOM from 'react-dom';
import BlockNumber from './components/BlockNumber'
import Count from './components/Count'
import KeyAndAddress from './components/KeyAndAddress'

// Step 2: simple component
// simple component
class Greeting extends React.Component {
    render() {
        return (
            <div><h1>Hello, Count BApp</h1></div>
        );
    }
}

// Step 1: App component rendering
// root component
class App extends React.Component {
    constructor(props) {
        super(props);
        // Step 7
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
                <Greeting />        {/* first component     */}
                <BlockNumber />     {/* caver-js component  */}
                <KeyAndAddress      
                    propagateKey={this.propagateKey} 
                />                  {/* user private key    */}
                <Count              
                    ref={this.countRef} 
                />                  {/* main logic          */}
            </div>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);
