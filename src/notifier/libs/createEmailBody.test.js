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

test("Request show notification snapshot", () => {
  const name = "Atlanta";
  const mediaType = "show";
  const requester = "Mark";
  const which = "all";
  const body = createRequestEmailBody(name, { mediaType, requester, which });
  expect(body).toMatchSnapshot();
});

test("Request movie notification snapshot", () => {
  const name = "Die Hard";
  const mediaType = "movie";
  const requester = "Mark";
  const body = createRequestEmailBody(name, { mediaType, requester });
  expect(body).toMatchSnapshot();
});
