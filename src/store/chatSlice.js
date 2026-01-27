import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { CHATBOT } from '../utils/constants';
import { fetchRagResponse } from '../utils/api';

const initialState = {
    messages: [
        { from: 'bot', text: CHATBOT.INIT }
    ],
    loading: false,
    error: null,
    boardId: null,
};

export const sendChatMessage = createAsyncThunk(
    'chat/sendChatMessage',
    async ({ message, boardId: argBoardId }, { dispatch, getState, rejectWithValue }) => {
        try {
            dispatch(addUserMessage(message));
            
            const state = getState();
            const activeBoardId = argBoardId || state.chat.boardId;
            const history = state.chat.messages
                .slice(1) 
                .slice(-3) 
                .map(msg => ({
                    role: msg.from === 'bot' ? 'assistant' : 'user',
                    content: msg.text
                }));

            const token = localStorage.getItem('token');
            const options = {
                history,
                boardId: activeBoardId || null,
                token: token || null
            };

            const response = await fetchRagResponse(message, options);
            
            if (response.error) throw new Error(response.error);
            
            const botText = response.answer || (typeof response === 'string' ? response : JSON.stringify(response));
            
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
        clearChat: {
            reducer: (state, action) => {
                state.messages = [{ from: 'bot', text: CHATBOT.INIT }];
                state.loading = false;
                state.error = null;
                if (action?.payload?.boardId) {
                    state.boardId = action.payload.boardId;
                }
            },
            prepare: (payload) => ({ payload }),
        },
        setBoardId: (state, action) => {
            state.boardId = action.payload;
        },
        resetBoardId: (state) => {
            state.boardId = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendChatMessage.pending, (state) => {
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

export const { addUserMessage, addBotMessage, clearChat, setBoardId, resetBoardId } = chatSlice.actions;
export default chatSlice.reducer;