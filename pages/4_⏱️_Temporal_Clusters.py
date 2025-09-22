import streamlit as st
import pandas as pd
import plotly.express as px
from pathlib import Path

st.set_page_config(page_title="Temporal Clusters", layout="wide")

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

clustered_sessions = load_df('clustered_sessions')
st.title("Temporal Clusters")
 
if clustered_sessions is None or 'cluster' not in clustered_sessions.columns:
    st.info("No clustered sessions exported yet. Run the clustering section in the notebook and re-export.")
    st.stop()
 
# Cluster counts
st.markdown(
    """
    #### What are clusters?
    Clusters group similar listening sessions based on when and how long I listened. This helps distinguish patterns like short evening sessions vs. longer weekend sessions.
    """
)
counts = clustered_sessions['cluster'].value_counts().reset_index()
counts.columns = ['cluster','sessions']
st.subheader("Cluster Distribution")
st.plotly_chart(px.bar(counts.sort_values('cluster'), x='cluster', y='sessions'), use_container_width=True)
 
# Session duration vs hour
if {'avg_hour','session_duration_minutes','cluster'}.issubset(clustered_sessions.columns):
    st.subheader("Session Duration vs. Hour")
    st.markdown(
        """
        Each point represents one listening session. The vertical position shows how long the session lasted; the horizontal position shows the average hour of the session.
        """
    )
    fig = px.scatter(clustered_sessions, x='avg_hour', y='session_duration_minutes', color='cluster', opacity=0.6)
    st.plotly_chart(fig, use_container_width=True)
 
# Day distribution
if {'day_of_week','cluster'}.issubset(clustered_sessions.columns):
    st.subheader("Days by Cluster")
    st.markdown(
        """
        This histogram shows how sessions are distributed across the days of the week for each cluster.
        """
    )
    day_order = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
    temp = clustered_sessions.copy()
    temp['day_of_week'] = pd.Categorical(temp['day_of_week'], categories=day_order, ordered=True)
    st.plotly_chart(px.histogram(temp, x='day_of_week', color='cluster', barmode='group'), use_container_width=True)


