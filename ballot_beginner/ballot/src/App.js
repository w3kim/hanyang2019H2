import React from 'react';
import BallotController from './components/BallotController'

function App() {
  return (
    <div className="App">
      <section class="hero is-info is-bold">
        <div class="hero-body">
          <div class="container">
            <figure class="image is-128x128">
              <img src="election.png" alt="election" />
            </figure>
            <h1 class="title">Ballot BApp</h1>
            <h2 class="subtitle">Vote Vote Vote</h2>
          </div>
        </div>
      </section>
      <BallotController />
    </div>
  );
}

export default App;
