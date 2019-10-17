import React from 'react';
import ReactDOM from 'react-dom';

class Greeting extends React.Component {
    render() {
        return (
            <div><h1>Hello, Count BApp</h1></div>
        );
    }
}

class App extends React.Component {
    render() {
        return (
            <div className="App">
                <Greeting />
            </div>
        );
    }
}
// below unchanged
ReactDOM.render(
    <App />,
    document.getElementById('root')
);
