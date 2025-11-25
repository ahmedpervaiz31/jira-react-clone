/*
this file has all the reusable functions specifically the taskid generation functions
*/

export const generateTaskId = (count) => {
    return `TASK-${count + 1}`;
};

export const generateUUID = () => {
    return crypto.randomUUID();
};