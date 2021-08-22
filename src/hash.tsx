// Get the hash of the url

interface URLAccessToken {
    access_token?: string
}

const hash: URLAccessToken = window.location.hash
  .substring(1)
  .split("&")
  .reduce(function(acc: URLAccessToken, curr: string) {
    if (curr) {
        var parts = curr.split("=");
        if (parts[0] === "access_token") {
            Object.assign(acc, {access_token: decodeURIComponent(parts[1])})
        }
    }
    return acc;
  }, {});
window.location.hash = "";

export default hash;
