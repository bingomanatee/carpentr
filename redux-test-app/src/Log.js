import React, { useState, useEffect } from 'react';
import { DataTable, Box, Heading } from 'grommet';
import Panel from './Panel';

const renderStatus = ({ status }) => (status ? status.toString().replace(/Symbol/i, '') : '?');
const renderForm = ({ form }) => {
  if (!form) return '';
  if (typeof form === 'object') {
    try {
      return (
        <pre>
          {
                JSON.stringify(form, true, 2)
              }
        </pre>
      );
    } catch (err) {
      return ('-- unrenderable --');
    }
  }
  return `${form}`;
};

const REQUEST_COLUMNS = [
  {
    property: 'uuid', primary: true, header: 'ID', size: 'medium',
  }, {
    property: 'view', header: 'View', size: 'medium',
  },
  { property: 'collection', header: 'Collection', size: 'large' },
  {
    property: 'form',
    header: 'Form',
    size: 'large',

    render: renderForm,
  },
  {
    property: 'status',
    header: 'Status',
    size: 'small',
    render: renderStatus,
  },
];
const QUESTION_COLUMNS = [
  {
    property: 'uuid', primary: true, header: 'ID', size: 'medium',
  }, {
    property: 'request', header: 'Request', size: 'medium',
  },
  { property: 'collection', header: 'Collection', size: 'large' },
  {
    property: 'form', header: 'Form', size: 'large', render: renderForm,
  },
  {
    property: 'status',
    header: 'Status',
    size: 'small',
    render: renderStatus,
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
    render: renderStatus,
  },
];

export default ({ actions, state }) => {
  const [requests, setReq] = useState([]);
  const [views, setViews] = useState([]);
  const [questions, setQ] = useState([]);

  useEffect(() => {
    if (state.changes.requests) {
      const req = Array.from(state.changes.requests.values());
      setReq(req);
    }
  },
  [state.changes.requests]);

  useEffect(() => {
    if (state.changes.questions) {
      const req = Array.from(state.changes.questions.values());
      setQ(req);
    }
  },
  [state.changes.questions]);

  useEffect(() => {
    if (state.views) {
      const views = Array.from(state.views.values());
      setViews(views);
    }
  },
  [state.views]);

  console.log('0----- questions: ', questions);
  return (
    <Box margin="medium">
      <Heading level={2}>Carpentr Store</Heading>
      <Panel title="Views">
        <DataTable data={views} columns={VIEW_COLUMNS} />
      </Panel>
      <Panel title="Requests">
        <DataTable data={requests} columns={REQUEST_COLUMNS} />
      </Panel>
      <Panel title="Questions">
        <DataTable data={questions} columns={QUESTION_COLUMNS} />
      </Panel>
    </Box>
  );
};
