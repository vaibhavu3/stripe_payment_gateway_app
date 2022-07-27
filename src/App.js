import Register from './Register';

import { Amplify } from 'aws-amplify';
import awsmobile from './aws-exports';
Amplify.configure(awsmobile);


function App() {
  return (
    <main className="App">
        <Register />
    </main>
  );
}

export default App;
