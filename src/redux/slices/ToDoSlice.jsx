
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Define your initial state
const initialState = {
  allData: [],
  data: [],
  allBatchNum: [],
  isLoadingAll: false,
  isLoadingData: false,
  errorAll: null,
  errorData: null,
};

const apiUrlDownload = process.env.REACT_APP_API_BASE_URL+"download";
const apiUrlAll = process.env.REACT_APP_API_BASE_URL+"all";
const apiUrlData = process.env.REACT_APP_API_BASE_URL+"data";
const apiUrlBatchNum = process.env.REACT_APP_API_BASE_URL+"allbatch";

// Create async thunks for each API endpoint
export const fetchAllData = createAsyncThunk('data/fetchAllData', async () => {
  const response = await fetch(apiUrlAll);
  const data = await response.json();
  return data;
});

export const fetchData = createAsyncThunk('data/fetchData', async (queryParams = "") => {
  const url = `${apiUrlData}?${queryParams}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
});
export const fetchBatchNum = createAsyncThunk('data/fetchBatchNum', async () => {
  const response = await fetch(apiUrlBatchNum);
  const data = await response.json();
  return data;
});


export const fetchDownloadData = createAsyncThunk('data/fetchDownloadData', async ( type ) => {
  const url = `${apiUrlDownload}?type=${type}`;
  
  const response = await fetch(url);
  
  const data = await response.json();
  return data;
});


// Create a slice for the data
const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Reducer for "http://localhost:8080/info/all"
      .addCase(fetchAllData.pending, (state) => {
        state.isLoadingAll = true;
        state.errorAll = null;
      })
      .addCase(fetchAllData.fulfilled, (state, action) => {
        state.isLoadingAll = false;
        state.allData = action.payload;
      })
      .addCase(fetchAllData.rejected, (state, action) => {
        state.isLoadingAll = false;
        state.errorAll = action.error.message;
      })

        // Reducer for "http://localhost:8080/info/all"
        .addCase(fetchBatchNum.pending, (state) => {
          state.isLoadingAll = true;
          state.errorAll = null;
        })
        .addCase(fetchBatchNum.fulfilled, (state, action) => {
          state.isLoadingAll = false;
          state.allBatchNum = action.payload;
        })
        .addCase(fetchBatchNum.rejected, (state, action) => {
          state.isLoadingAll = false;
          state.errorAll = action.error.message;
        })
      
   

      // Reducer for "http://localhost:8080/info/data"
      .addCase(fetchData.pending, (state) => {
        state.isLoadingData = true;
        state.errorData = null;
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.isLoadingData = false;
        state.data = action.payload.data;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.isLoadingData = false;
        state.errorData = action.error.message;
      })



 // Reducer for 'http://localhost:8080/info/download';

 .addCase(fetchDownloadData.pending, (state) => {
     
    })
    .addCase(fetchDownloadData.fulfilled, (state, action) => {
     
      console.log('Download Data:', action.payload);
    })
    .addCase(fetchDownloadData.rejected, (state, action) => {
     
      console.error('Error fetching Download Data:', action.error.message);
    });






      

  },
});

// Export only the reducer
export default dataSlice.reducer;

