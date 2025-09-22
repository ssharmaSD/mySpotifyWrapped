import streamlit as st
import pandas as pd
import plotly.express as px
from pathlib import Path

st.set_page_config(page_title="Overview", layout="wide")

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
st.title("Overview")

if all_music is None:
    st.warning("Data not found. Please run the export cell in the notebook.")
    st.stop()

years = sorted(all_music['year'].dropna().unique().tolist()) if 'year' in all_music else []
year_sel = st.sidebar.multiselect("Year", years, default=years)
df = all_music if not year_sel else all_music[all_music['year'].isin(year_sel)]

if {'year','ms_played'}.issubset(df.columns):
    st.markdown(
        """
        #### Listening Time by Year
        This line chart shows how many hours of music I listened to each year. Higher points indicate years with more listening. Use the year filter in the sidebar to focus on specific years.
        """
    )
    yearly = df.groupby('year', as_index=False)['ms_played'].sum()
    yearly['hours'] = yearly['ms_played'] / 3_600_000
    st.subheader("Total Hours per Year")
    st.plotly_chart(px.line(yearly, x='year', y='hours', markers=True), use_container_width=True)

if 'artist' in df:
    st.markdown(
        """
        #### Top Artists
        The bar chart ranks the artists I listened to most frequently. Bars further to the right indicate more plays.
        """
    )
    st.subheader("Top Artists")
    top_artists = df['artist'].value_counts().head(15).reset_index()
    top_artists.columns = ['artist','plays']
    st.plotly_chart(px.bar(top_artists, y='artist', x='plays', orientation='h'), use_container_width=True)

