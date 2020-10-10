import React, { useEffect, useState } from 'react';
import { Box, Heading, DataTable, Button } from 'grommet';
import carpentr from './carpentr-redux';
import Panel from './Panel';

const { status } = carpentr;

const USER_COLUMNS = [
  { property: 'id', header: 'ID', primary: true },
  { property: 'name', header: 'Name' },
];

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

  function loadMockUsers () {
    actions.changes.requestNew({
      view: view.uuid,
      collection: 'users',
      form: 'all',
    });
  }

  useEffect(() => {
    console.log('users: state = ', state);
    if (!view && !init) {
      // flag all previous iterations of open user views as update;
      // rely on garbage collection (TODO)
      // to close all requests for those views.
      actions.views.viewClose(
        {
          filter: (v) => v.name === 'users',
        },
      );
      actions.views.viewNew({
        view: { name: 'users' },
        callback: setView,
      });
      setInit(true);
    }
  }, [view, init]);

  useEffect(() => {
    const currentUsers = state.collections.get('users');
    if (currentUsers) {
      const users = Array.from(currentUsers.values());
      console.log('-------- users: ', users);
      setUsers(users);
    }
  }, [state.collections]);

  console.log('rendering data with ', users)
  return (
    <Panel title="Users"
    >
      <DataTable columns={USER_COLUMNS} data={users} />
      <Box direction="row" justify="center">
        <Button primary plain={false} fill={false} onClick={loadMockUsers}>Load Data from Mock Backend</Button>
      </Box>
    </Panel>
  );
};
