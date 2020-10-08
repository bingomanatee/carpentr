import React, { useEffect } from 'react';

export default ({ users }) => (
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
