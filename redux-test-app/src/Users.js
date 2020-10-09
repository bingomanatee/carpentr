import React, { useEffect, useState } from 'react';
import carpentr from './carpentr-redux';

const { status } = carpentr;

export default ({ state, actions }) => {
  const [users, setUsers] = useState([]);
  const [view, setView] = useState(null);
  const [init, setInit] = useState(false);
  useEffect(() => {
    actions.collections.collectionSet({
      identity: 100,
      collection: 'users',
      data: { id: 100, name: 'Bob' },
    });

    actions.views.viewNew({
      name: 'users',
    });
  }, []);

  useEffect(() => {
    console.log('users: state = ', state);
    if (!init) {
      // flag all previous iterations of open user views as update;
      // rely on garbage collection (TODO)
      // to close all requests for those views.
      actions.views.viewUpdate(
        {
          filter: (v) => v.name === 'users' && v.status !== status.DONE,
          update: (v) => v.status = status.DONE,
        },
      );
      actions.views.viewNew({ name: 'users' });
      setInit(true);
    } else if (!view) {
      const newView = Array.from(state.views.values())
        .find((view) => (view.name === 'users') && (view.status === status.NEW));
      if (!newView) {
        console.log('cannot find a new user view');
      } else {
        setView(newView);
      }
    }
  }, [state.views, view, init]);

  useEffect(() => {
    const currentUsers = state.collections.get('users');
    if (currentUsers) {
      const users = Array.from(currentUsers.values());
      setUsers(users);
    }
  }, [state.collections]);
  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>
        {Array.from(users.values()).map((user) => (
          <tr>
            <td>{user.id}</td>
            <td>{user.name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
