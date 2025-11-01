import React from 'react';
import { Navigate } from 'react-router-dom';

const IndexPage: React.FC = () => {
  return <Navigate to="/login" replace />;
};

export default IndexPage;