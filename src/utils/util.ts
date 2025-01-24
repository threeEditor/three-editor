export const formatJsonStr = (json: object) => {
    try {
        const formattedJson = JSON.stringify(json, null, 4);
        return formattedJson;
    } catch (error) {
        console.error('Invalid JSON:', error);
        return 'JSON Format Error!';
    }
};

// 自定义函数生成指定范围内的随机数
export const getRandomRange = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
};