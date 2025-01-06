export const formatJsonStr = (json: object) => {
    try {
        const formattedJson = JSON.stringify(json, null, 4);
        return formattedJson;
    } catch (error) {
        console.error('Invalid JSON:', error);
        return 'JSON Format Error!';
    }
};