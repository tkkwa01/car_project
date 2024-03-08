import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';
import { CreateTransaction } from './components/CreateTransaction';
import { ApproveTransaction } from './components/ApproveTransaction';

function App() {
  return (
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">トランザクション作成</Link>
              </li>
              <li>
                <Link to="/approve">トランザクション承認</Link>
              </li>
            </ul>
          </nav>

          <Routes>
            <Route path="/" element={<CreateTransaction />} />
            <Route path="/approve" element={<ApproveTransaction />} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;