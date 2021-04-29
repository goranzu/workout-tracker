class UserInputException extends Error {
  constructor(public message = "Invalid Input", public statusCode = 400) {
    super(message);
  }
}

class UnauthorizedException extends Error {
  constructor(public message = "Unauthorized", public statusCode = 401) {
    super(message);
  }
}

export { UserInputException, UnauthorizedException };
