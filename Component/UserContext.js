import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [photo, setPhoto] = useState(null);
  const [login, setLogin] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <UserContext.Provider value={{ photo, setPhoto, login, setLogin, email, setEmail, password, setPassword }}>
      {children}
    </UserContext.Provider>
  );
};
