import os
import spotipy
from spotipy.oauth2 import SpotifyOAuth
from typing import Optional, Tuple

DEFAULT_SCOPE = "user-read-recently-played playlist-read-private user-library-read"
DEFAULT_CACHE = ".cache-spotify"

def get_spotify_client(
    client_id: Optional[str] = None,
    client_secret: Optional[str] = None,
    redirect_uri: Optional[str] = None,
    scope: str = DEFAULT_SCOPE,
    cache_path: str = DEFAULT_CACHE,
) -> Tuple[Optional[spotipy.Spotify], Optional[str]]:
    """Return a Spotipy client and current access token with auto-refresh via cache.

    Reads credentials from environment variables if not provided:
      SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REDIRECT_URI

    On first run, opens a browser for authorization and caches refresh token.
    Subsequent runs auto-refresh.
    """
    cid = client_id or os.getenv("SPOTIFY_CLIENT_ID")
    csecret = client_secret or os.getenv("SPOTIFY_CLIENT_SECRET")
    ruri = redirect_uri or os.getenv("SPOTIFY_REDIRECT_URI", "http://localhost:7777/callback")

    if not cid or not csecret or not ruri:
        return None, None

    oauth = SpotifyOAuth(
        client_id=cid,
        client_secret=csecret,
        redirect_uri=ruri,
        scope=scope,
        cache_path=cache_path,
        open_browser=True,
    )

    token_info = oauth.get_cached_token()
    if not token_info:
        # Start auth code flow
        auth_url = oauth.get_authorize_url()
        print("Open this URL to authorize:", auth_url)
        response_url = input("Paste the redirect URL here: ").strip()
        code = oauth.parse_response_code(response_url)
        token_info = oauth.get_access_token(code, check_cache=False)

    if not token_info:
        return None, None

    access_token = token_info.get("access_token")
    sp = spotipy.Spotify(auth=access_token)
    return sp, access_token
 

