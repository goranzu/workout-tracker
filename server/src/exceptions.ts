class UserInputException extends Error {
  statusCode: number;
  constructor(message = "Invalid Input") {
    super();
    this.message = message;
    this.statusCode = 400;
  }
}

export { UserInputException };
