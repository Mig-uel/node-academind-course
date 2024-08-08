// The root provides a resolver function for each API endpoint
exports.root = {
  hello() {
    return {
      text: 'Hello, world!',
      views: 1,
    }
  },
}
