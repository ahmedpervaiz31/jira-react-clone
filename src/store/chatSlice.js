import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { CHATBOT } from '../utils/constants';
import { fetchRagResponse } from '../utils/api';


const initialState = {
	messages: [
		{ from: 'bot', text: CHATBOT.INIT }
	],
	loading: false,
	error: null,
};

export const sendChatMessage = createAsyncThunk(
  'chat/sendChatMessage',
  async (userMessage, { dispatch, rejectWithValue }) => {
    try {
        dispatch(addUserMessage(userMessage));
        const token = localStorage.getItem('token');
        
        const options = {};
        if (token) {
            options.token = token;
        }
		const response = await fetchRagResponse(userMessage, options);

        if (response.error) 
            throw new Error(response.error);
        
        const botText = typeof response === 'string' ? response : response.answer || JSON.stringify(response);
        return botText;
        } catch (err) {
            return rejectWithValue(err.message);
    }
  }
);


const chatSlice = createSlice({
	name: 'chat',
	initialState,
	reducers: {
		addUserMessage: (state, action) => {
			state.messages.push({ from: 'user', text: action.payload });
		},
		addBotMessage: (state, action) => {
			state.messages.push({ from: 'bot', text: action.payload });
		},
		clearChat: (state) => {
			state.messages = [
				{ from: 'bot', text: CHATBOT.INIT }
			];
			state.loading = false;
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(sendChatMessage.pending, (state, action) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(sendChatMessage.fulfilled, (state, action) => {
				state.loading = false;
				state.messages.push({ from: 'bot', text: action.payload });
			})
			.addCase(sendChatMessage.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload || 'Failed to get response';
				state.messages.push({ from: 'bot', text: `Error: ${state.error}` });
			});
	},
});

export const { addUserMessage, addBotMessage, clearChat } = chatSlice.actions;
export default chatSlice.reducer;
