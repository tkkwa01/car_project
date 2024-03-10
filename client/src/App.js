// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import {CreateTransaction} from './components/CreateTransaction';
import {ApproveTransaction} from './components/ApproveTransaction';
import {AccountFetcher} from './components/AccountFetcher';

function App() {
  return (
      <Router>
        <div>
          <nav>
            <ul>
              <li><Link to="/">トランザクション作成</Link></li>
              <li><Link to="/approve">トランザクション承認</Link></li>
              <li><Link to="/fetch">アカウント情報取得</Link></li>
            </ul>
          </nav>

          <Routes>
            <Route path="/" element={<CreateTransaction />} />
            <Route path="/approve" element={<ApproveTransaction />} />
            <Route path="/fetch" element={<AccountFetcher />} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;
