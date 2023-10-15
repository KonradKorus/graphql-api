import React from 'react';

const RestRequestDisplay = ({ query }) => {
  return (
    <>
      {query.length > 0 && (
        <div className="mb-3">
          Liczba zapytań do serwera:
          <span className="fw-bold"> {query.length}</span>
        </div>
      )}
      {query.map((query, index) => {
        return (
          <div key={index}>
            <div className="mb-1">
              Endpoint: <span className="fw-bold"> {query.endpoint}</span>
            </div>
            <div className="mb-1">
              Method:
              <span className="fw-bold"> {query.method}</span>
            </div>
            {query.method != 'GET' && (
              <div>
                Body:
                <pre className="fw-bold">{query.body}</pre>
              </div>
            )}
            <p>Response:</p>
            <pre className="fw-bold">
              {JSON.stringify(query.response, null, 2)}
            </pre>
          </div>
        );
      })}
    </>
  );
};

export default RestRequestDisplay;
