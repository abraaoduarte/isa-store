// Interface to handle with response
export interface ResponseRequestProp {
    // Status response
    status?: number;
    // Headers response
    headers?: object;
    // Response result to the user
    body: object;
  }
