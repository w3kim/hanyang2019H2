import React from 'react';
import BallotController from './components/BallotController'

function App() {
  return (
    <div className="App">
      <section class="hero is-info is-bold">
        <div class="hero-body">
          <div class="container">
            <h1 class="title">Ballot</h1>
            <h2 class="subtitle">Vote Vote Vote</h2>
          </div>
        </div>
      </section>
      <BallotController />
    </div>
  );
}

export default App;
