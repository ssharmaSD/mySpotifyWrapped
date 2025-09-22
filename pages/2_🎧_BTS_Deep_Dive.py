import streamlit as st
import pandas as pd
import plotly.express as px
from pathlib import Path

st.set_page_config(page_title="BTS Deep Dive", layout="wide")

# Use shared data loading from main app
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
st.title("BTS Deep Dive")

if all_music is None:
    st.warning("Data not found. Please run the export cell in the notebook.")
    st.stop()

bts = all_music[all_music['artist'] == 'BTS'] if 'artist' in all_music else None
if bts is None or bts.empty:
    st.info("No BTS songs found in the dataset.")
    st.stop()

st.subheader("Top 20 BTS Songs")
st.markdown(
    """
    This chart highlights which BTS tracks I returned to the most. Taller bars indicate songs I played more often.
    """
)
top_bts = bts['track'].value_counts().head(20).reset_index()
top_bts.columns = ['track','plays']
fig = px.bar(top_bts, y='track', x='plays', orientation='h')
fig.update_layout(yaxis={'categoryorder':'total ascending'})
st.plotly_chart(fig, use_container_width=True)

if 'album' in bts:
    st.subheader("Albums in My Top BTS Songs")
    st.markdown(
        """
        This view shows how many of my most-played BTS songs came from each album. Longer bars mean more representation in my top list.
        """
    )
    album_counts = bts.groupby('album').size().reset_index(name='songs')
    st.plotly_chart(px.bar(album_counts.sort_values('songs', ascending=False), x='songs', y='album', orientation='h'), use_container_width=True)

