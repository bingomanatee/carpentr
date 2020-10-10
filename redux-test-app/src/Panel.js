import { Box, Heading } from 'grommet';
import React from 'react';

export default ({ children, title }) => (
  <Box
    border={{
      size: '1px',
      color: 'accent-4',
    }}
    margin="medium"
    pad="large"
    round="medium"
    direction="column"
    gap="medium"
    background="white"
  >
    <Heading level={3}>{title}</Heading>
    {children}
  </Box>
);
