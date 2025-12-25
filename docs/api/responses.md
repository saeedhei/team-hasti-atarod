# API Response Status Codes

This API uses standard HTTP status codes to indicate the result of a request.

## Success Responses

- **200 OK**  
  Returned when a GET or PUT request succeeds.

- **201 Created**  
  Returned when a resource is successfully created (POST).

## Client Errors

- **400 Bad Request**  
  Returned when request validation fails (e.g. schema validation).

- **404 Not Found**  
  Returned when a requested resource does not exist or does not belong to the given scope.

## Server Errors

- **500 Internal Server Error**  
  Returned when an unexpected server error occurs.
