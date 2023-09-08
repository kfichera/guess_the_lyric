//permission scopes
const scopes = [
    "user-read-playback-state",
    "user-read-currently-playing",
    "playlist-read-private",
    "playlist-read-collaborative",
    "user-follow-read",
    "user-top-read",
    "user-read-recently-played",
    "user-library-read",
    "user-read-email",
    "user-read-private"
].join(',');

const params = {
    scope: scopes,
};

const queryParamString = new URLSearchParams(params);

const LOGIN_URL = `https://accounts.spotify.com/authorize?${queryParamString.toString()}`;

export {LOGIN_URL}