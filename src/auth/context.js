// Auth/context.js
import React from 'react';

const authContext = React.createContext({
  user: null,
  setUser: () => {},
});

export default authContext;