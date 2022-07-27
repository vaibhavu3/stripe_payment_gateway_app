import Register from './Register';

import Amplify from 'aws-amplify';
import config from './aws-exports';
Amplify.configure(config);

function App() {
  return (
    <main className="App">
        <Register />
    </main>
  );
}

export default App;
