const calculateReadingTime = (content)=> {
    const wordsPerMin = 200;
    const totalWords = content?.split();
    const minutes = totalWords?.length/wordsPerMin;
    const readTime = Math.ceil(minutes);
    return readTime;
};

export default calculateReadingTime;