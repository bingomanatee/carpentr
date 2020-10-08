import React, { useEffect } from 'react';
import './App.css';
import Users from './Users';

export default function App(props) {
  const { actions, state } = props;
  console.log('actions', actions, 'state', state, '------ props', props);

  useEffect(() => {
    actions.collections.collectionSet({
      collection: 'users', identity: 100, data: { id: 100, name: 'Bob' },
    });
    console.log('added bob');
  }, []);

  return (
    <div className="App">
      <header>
        Carpentr Demo: users and groups
      </header>

      <section>
        <Users users={state.collections.get('users') || new Map()} />
      </section>
    </div>
  );
}
