import React, { useState, useEffect } from 'react';
import { DataTable, Box, Heading } from 'grommet';
import Panel from './Panel';

const REQUEST_COLUMNS = [
  {
    property: 'uuid', primary: true, header: 'ID', size: 'medium',
  },  {
    property: 'view', header: 'View', size: 'medium',
  },
  { property: 'collection', header: 'Collection', size: 'large' },
  { property: 'form', header: 'Form', size: 'large' },
  {
    property: 'status',
    header: 'Status',
    size: 'small',
    render: ({ status }) => status.toString().replace(/Symbol/i, ''),
  },
];
const VIEW_COLUMNS = [
  {
    property: 'uuid', primary: true, header: 'ID', size: 'medium',
  },
  { property: 'name', header: 'Name', size: 'large' },
  {
    property: 'status',
    header: 'Status',
    size: 'small',
    render: ({ status }) => status.toString().replace(/Symbol/i, ''),
  },
];

export default ({ actions, state }) => {
  const [requests, setReq] = useState([]);
  const [views, setViews] = useState([]);

  useEffect(() => {
    if (state.changes.requests) {
      const req = Array.from(state.changes.requests.values());
      setReq(req);
    }
  },
  [state.changes.requests]);

  useEffect(() => {
    if (state.views) {
      const views = Array.from(state.views.values());
      setViews(views);
    }
  },
  [state.views]);

  console.log('rendering ', requests);
  return (
    <Box margin="medium">
      <Heading level={2}>Carpentr Store</Heading>
      <Panel title="Views">
        <DataTable data={views} columns={VIEW_COLUMNS} />
      </Panel>
      <Panel title="Requests">
        <DataTable data={requests} columns={REQUEST_COLUMNS} />
      </Panel>
    </Box>
  );
};
