class Unauthorized extends Error {
  constructor (message: string) {
    super();
    this.name = 'Unauthorized';
    this.message = message || 'Unable to authenticate.';
  }

  response () {
    return {
      status: 401,
      body: {
        message: this.message
      }
    };
  }
}

export { Unauthorized };
