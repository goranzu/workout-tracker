class BaseException extends Error {
  constructor(public statusCode: number) {
    super();
  }
}

class UserInputException extends BaseException {
  constructor(message = "Invalid Input") {
    super(400);
    this.message = message;
  }
}

class UnauthorizedException extends BaseException {
  constructor(message = "Unauthorized") {
    super(401);
    this.message = message;
  }
}

export { UserInputException, UnauthorizedException, BaseException };
