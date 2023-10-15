import React from 'react';
import { GET_ALL_USERS } from '../queries/userQueries';
import QlRequestDisplay from './QlRequestDisplay';
import RestRequestDisplay from './RestRequestDisplay';

const NetworkInfo = ({ qlQuery, restQuery }) => {
  return (
    <div className="d-flex">
      <div className="w-50 border-right border-primary px-2">
        <h5 className="my-3">GraphQL request</h5>
        {qlQuery.body && <QlRequestDisplay query={qlQuery}></QlRequestDisplay>}
      </div>
      <div className="border"></div>
      <div className="w-50 pl-2 px-2">
        <h5 className="my-3">RestApi requests</h5>
        <RestRequestDisplay query={restQuery}></RestRequestDisplay>
      </div>
    </div>
  );
};

export default NetworkInfo;
