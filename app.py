import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
from pathlib import Path
from spotify_auth import get_spotify_client
 
st.set_page_config(page_title="Suhani's Spotify Wrapped", layout="wide")

# Replace default sidebar page labels with explicit navigation
try:
    pages = [
        st.Page("app.py", title="Introduction", icon="🏠"),
        st.Page("pages/1_🧭_Overview.py", title="Overview", icon="🧭"),
        st.Page("pages/2_🎧_BTS_Deep_Dive.py", title="BTS Deep Dive", icon="🎧"),
        st.Page("pages/3_📈_Extended_History.py", title="Extended History", icon="📈"),
        st.Page("pages/4_⏱️_Temporal_Clusters.py", title="Temporal Clusters", icon="⏱️"),
    ]
    nav = st.navigation(pages)
    # Style the first nav item (home) to match theme accent
    st.markdown(
        """
        <style>
        section[data-testid="stSidebar"] a[class^="st-emotion-"] span:first-child { color: #A23B72 !important; }
        </style>
        """,
        unsafe_allow_html=True,
    )
    nav.run()
except Exception:
    # Fallback if this Streamlit version doesn't support st.navigation
    pass

DATA_DIR = Path('data')
 
@st.cache_data
def load_df(name: str) -> pd.DataFrame | None:
    f_parquet = DATA_DIR / f"{name}.parquet"
    f_csv = DATA_DIR / f"{name}.csv"
    if f_parquet.exists():
        return pd.read_parquet(f_parquet)
    if f_csv.exists():
        return pd.read_csv(f_csv)
    return None
 
all_music = load_df('all_music')
clustered_sessions = load_df('clustered_sessions')
 
st.title("Suhani's Spotify Wrapped")
st.markdown("Explore my personal Spotify listening story: highlights, deep dives, and temporal patterns.")

# Welcoming homepage description
st.markdown(
    """
    ### Welcome
    This interactive site turns my Spotify listening history into clear, visual insights. It is designed to be easy to browse even if you’re not a data expert.

    - **Overview**: Quick snapshot of total listening time, top artists and songs, and how my listening has changed by year.
    - **BTS Deep Dive**: A focused look at my BTS listening — most-played tracks and albums.
    - **Extended History**: Longer-term trends across years and a view of listening while traveling.
    - **Temporal Clusters**: Groups of similar “listening sessions” by time of day and duration to reveal patterns (e.g., quick evening sessions vs. longer weekend sessions).

    Use the sidebar to filter by year and to see whether live Spotify access is connected. All charts update based on your selections.
    """
)

# Optional: surface auth status (used if you enable API-powered features later)
spotify, token = get_spotify_client()
if token:
    st.sidebar.success("Spotify auth: connected")
else:
    st.sidebar.info("Spotify auth: not connected (using exported data)")
 
if all_music is None:
    st.warning("Data not found. Please run the notebook export cell to generate data/all_music.parquet.")
    st.stop()
 
 # Sidebar filters
years = sorted(all_music['year'].dropna().unique().tolist()) if 'year' in all_music else []
year_sel = st.sidebar.multiselect("Year", years, default=years)
 
df = all_music.copy()
if year_sel:
    df = df[df['year'].isin(year_sel)]
 
 # KPIs
total_hours = (df['ms_played'].sum() / 3_600_000) if 'ms_played' in df else np.nan
total_days = total_hours / 24 if not np.isnan(total_hours) else np.nan
top_artist = df['artist'].value_counts().idxmax() if 'artist' in df and not df['artist'].isna().all() else "N/A"
top_song = df['track'].value_counts().idxmax() if 'track' in df and not df['track'].isna().all() else "N/A"
 
c1, c2, c3, c4 = st.columns(4)
c1.metric("Total Hours", f"{total_hours:.0f}" if total_hours==total_hours else "-")
c2.metric("Total Days", f"{total_days:.0f}" if total_days==total_days else "-")
c3.metric("Top Artist", top_artist)
c4.metric("Top Song", top_song)
 
st.markdown("---")
 
# Listening over time (yearly)
if {'year','ms_played'}.issubset(df.columns):
    yearly = df.groupby('year', as_index=False)['ms_played'].sum()
    yearly['hours'] = yearly['ms_played'] / 3_600_000
    fig = px.line(yearly, x='year', y='hours', markers=True, title='Total Hours per Year')
    st.plotly_chart(fig, use_container_width=True)
 
 # Top artists
if 'artist' in df:
    st.subheader("Top Artists")
    top_artists = df['artist'].value_counts().head(15).reset_index()
    top_artists.columns = ['artist','plays']
    fig = px.bar(top_artists, y='artist', x='plays', orientation='h')
    fig.update_layout(yaxis={'categoryorder':'total ascending'})
    st.plotly_chart(fig, use_container_width=True)
 
# Top songs
if {'track'}.issubset(df.columns):
    st.subheader("Top Songs")
    top_songs = df['track'].value_counts().head(20).reset_index()
    top_songs.columns = ['track','plays']
    fig = px.bar(top_songs, y='track', x='plays', orientation='h')
    fig.update_layout(yaxis={'categoryorder':'total ascending'})
    st.plotly_chart(fig, use_container_width=True)
 
st.markdown("---")
 
 # Clusters preview
if clustered_sessions is not None and 'cluster' in clustered_sessions.columns:
    st.subheader("Listening Mode Clusters (Preview)")
    counts = clustered_sessions['cluster'].value_counts().reset_index()
    counts.columns = ['cluster','sessions']
    st.dataframe(counts.sort_values('cluster'))
    if {'avg_hour','session_duration_minutes','cluster'}.issubset(clustered_sessions.columns):
        fig = px.scatter(clustered_sessions, x='avg_hour', y='session_duration_minutes', color='cluster',
                        title='Session Duration vs. Average Hour by Cluster', opacity=0.6)
        st.plotly_chart(fig, use_container_width=True)
else:
    st.info("Run the clustering section in the notebook and re-export to enable the clusters preview.")


