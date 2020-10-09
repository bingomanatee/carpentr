import React, { useEffect } from 'react';
import stores from './store';
import './App.css';
import Users from './Users';
import { connect } from 'react-redux';

const {
  store, actions, mapStore, mapActions,
} = stores;

const CUsers = connect(mapStore, mapActions)(Users);
export default function App() {
  return (
    <div className="App">
      <header>
        Carpentr Demo: users and groups
      </header>

      <section>
        <CUsers />
      </section>
    </div>
  );
}
