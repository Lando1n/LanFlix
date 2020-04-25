const {
  createMovieEmailBody,
  createNewShowEmailBody,
  createRequestEmailBody,
  createShowEmailBody,
} = require("./createEmailBody");

test("Show notification snapshot", () => {
  const name = "Atlanta";
  const body = createShowEmailBody(name);
  expect(body).toMatchSnapshot();
});

test("Movie notification snapshot", () => {
  const name = "Die Hard";
  const body = createMovieEmailBody(name);
  expect(body).toMatchSnapshot();
});

test("New Show notification snapshot", () => {
  const name = "Atlanta";
  const body = createNewShowEmailBody(name);
  expect(body).toMatchSnapshot();
});

test("Request notification snapshot", () => {
  const name = "Atlanta";
  const type = "show";
  const user = "Mark";
  const body = createRequestEmailBody(name, type, user);
  expect(body).toMatchSnapshot();
});
