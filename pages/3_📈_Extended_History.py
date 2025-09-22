import streamlit as st
import pandas as pd
import plotly.express as px
from pathlib import Path

st.set_page_config(page_title="Extended History", layout="wide")

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
st.title("Extended History")

if all_music is None:
    st.warning("Data not found. Please run the export cell in the notebook.")
    st.stop()

if {'year','ms_played'}.issubset(all_music.columns):
    st.markdown(
        """
        #### Listening Hours by Year
        This bar chart summarizes my total listening time each year. It’s helpful for spotting peak years and slowdowns.
        """
    )
    yearly = all_music.groupby('year', as_index=False)['ms_played'].sum()
    yearly['hours'] = yearly['ms_played'] / 3_600_000
    st.subheader("Listening Hours by Year")
    st.plotly_chart(px.bar(yearly, x='year', y='hours'), use_container_width=True)

if {'country','ms_played','year'}.issubset(all_music.columns):
    st.subheader("Listening While Traveling")
    st.markdown(
        """
        This grouped chart shows where I listened to music outside the U.S., by country and year. Taller bars indicate more listening time while traveling.
        """
    )
    non_us = all_music[all_music['country'] != 'US']
    by_country = non_us.groupby(['year','country'], as_index=False)['ms_played'].sum()
    by_country['hours'] = by_country['ms_played'] / 3_600_000
    st.plotly_chart(px.bar(by_country, x='country', y='hours', color='year', barmode='group'), use_container_width=True)

