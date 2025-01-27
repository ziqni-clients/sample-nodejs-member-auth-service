# Requirements for a Node.js Service to Check Active Competitions and Return a Member-API JWT

## Functional Requirements

### Input Handling
- Accept `memberRefId` (string) and `space` (string) as input via an HTTP POST or GET request.
- Validate that both parameters are present and in the correct format.
- Ensure that the provided `space` is in the accepted list.

### Competition Lookup
- Check if the given `memberRefId` has any active competitions in the specified `space`.
- Use the Admin API to retrieve competition data based on `memberRefId` and `space`.
- Cache the retrieved results.

### Caching
- Cache the results for each unique combination of `memberRefId` and `space` for 30 minutes.
- Invalidate the local cache after 30 minutes or when a new request is made for the same combination after expiration.

### Session Token Generation
- Generate a session token (e.g., JWT) for each valid request using the Member API's token generation service.
- Include the session token in the response alongside competition and contest data.

### Response
- Respond with a JSON object containing:
  - Member API session token.
  - Active competition and contest information (e.g., competition name, start/end dates, status, etc.).
- If no active competitions are found:
  - Respond with an empty competition list.
  - Do not generate or include a session token, as there is no reason to connect to the Member API if no activity is scheduled.

### Error Handling
- Handle missing or invalid parameters with an appropriate error message (e.g., 400 Bad Request).
- Gracefully handle internal server errors, database/API failures, and other exceptions.

---

## Non-Functional Requirements

### Performance
- Ensure the service can handle concurrent requests efficiently.
- Optimize the caching mechanism to reduce API load.

### Scalability
- Design the service to scale horizontally to handle increased traffic.
- (Note: Deployment on Elastic Beanstalk will support horizontal scaling.)

### Security
- Validate and sanitize inputs to prevent injection attacks.
- Use HTTPS to secure data transmission.

### Maintainability
- Write clean, modular code with proper comments.
- Implement logging to aid in debugging and monitoring the service.

### Testing
- Write unit tests for individual modules.
- Implement integration tests to verify the entire service.

---

## Implementation Suggestions

- **Framework**: Use `Express.js` for building the API.
- **Caching**: Use `node-cache` for caching results.
- **Database/API**: Use an external Admin API or a database (e.g., PostgreSQL, MongoDB) to retrieve competition data.
- **Session Token**: Leverage the Member API for token generation.
- **Environment Management**: Use `dotenv` for managing environment-specific configuration.

---

## Example API Contract

### Request Body
- **Endpoint**: `POST /check-competitions`
```json
{
  "memberRefId": "12345",
  "space": "production"
  "sessionToken": "your session token or something"
}
