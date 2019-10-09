import React from 'react';
import ReactDOM from 'react-dom';

class Count extends React.Component {
    render() {
        return (
            <div>Hello, Count BApp</div>
        );
    }
}

ReactDOM.render(
    <Count />,
    document.getElementById('root')
);
