$(document).ready(function() {
  console.log("document Ready");
  render();
});

function render() {
  console.log("render called");
  console.log(1, {
    fingerprint: session.id,
    data: session.data,
    user: session.user
  });
}
