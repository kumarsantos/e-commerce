import React from 'react';
import Helmet from 'react-helmet';
//used for search engin optimization helmet is library which helps in SEO
const MetaData = ({ title }) => {
  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
    </>
  );
};

export default MetaData;
