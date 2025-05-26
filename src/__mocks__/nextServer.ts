module.exports = {
  NextRequest: class {},
  NextResponse: {
    next: jest.fn(),
    json: jest.fn(),
  },
};