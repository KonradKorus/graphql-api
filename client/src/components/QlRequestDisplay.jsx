import React from 'react';

const QlRequestDisplay = ({ query }) => {
  return (
    <>
      <div className="mb-3">
        Liczba zapytań do serwera: <span className="fw-bold"> 1</span>
      </div>
      <div className="mb-1">
        Endpoint: <span className="fw-bold"> {query.endpoint}</span>
      </div>
      <div className="mb-1">
        Method:
        <span className="fw-bold"> {query.method}</span>
      </div>
      <div>
        Query:
        <pre className="fw-bold negativ-margin">{query.body}</pre>
      </div>
      <p>Response:</p>
      <pre className="fw-bold">{JSON.stringify(query.response, null, 2)}</pre>
    </>
  );
};

export default QlRequestDisplay;
