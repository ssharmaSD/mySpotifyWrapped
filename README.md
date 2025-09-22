 # Suhani's Spotify Wrapped – Streamlit App

 An interactive web app to explore my Spotify listening history and insights, built with Streamlit.

 ## Features
 - Overview metrics and highlight charts
 - BTS deep dive (top songs, albums)
 - Extended history trends (hours per year, countries listened)
 - Temporal clustering of listening sessions

 ## Project Structure
 - `Suhani's Wrapped.ipynb` – analysis notebook (exports datasets)
 - `data/` – exported datasets used by the app
 - `app.py` – Streamlit app entry
 - `pages/` – multi-page app modules
 - `requirements.txt` – dependencies

 ## Setup
 ```bash
 # 1) Create and activate a virtual environment (recommended)
 python3 -m venv .venv && source .venv/bin/activate

 # 2) Install dependencies
 pip install -r requirements.txt
 ```

 ## Export Data
 In the notebook, run the "Export key datasets for the Streamlit app" cell to produce:
 - `data/all_music.parquet` (and CSV)
 - `data/clustered_sessions.parquet` (and CSV, optional)

 ## Run the App
 ```bash
 streamlit run app.py
 ```

 ## Deploy (Streamlit Community Cloud)
 1. Push this repo to GitHub
 2. Create a new Streamlit app, point it to `app.py`
 3. Set Python version (3.10+) and requirements from `requirements.txt`

 Optional environment variables for API usage:
 - `SPOTIFY_USERNAME`
 - `SPOTIFY_CLIENT_ID`
 - `SPOTIFY_CLIENT_SECRET`

 ## Notes
 - The app reads precomputed datasets; re-run the notebook to update
 - Credentials are optional; the app works offline with exported data

## Suhani's Spotify Wrapped 
This is my personal passion project that just explores my music taste and some of my favorite artists over my Spotify history. 
