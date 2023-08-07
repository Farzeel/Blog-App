import axios from "axios";

const API_KEY = process.env.REACT_APP_NEWS_API_KEY;
const coinUrl = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=15&page=1&sparkline=false&locale=en`
const newsUrl = `https://newsapi.org/v2/everything?q=business%20AND%20blockchain%20AND%20crypto&language=en&apiKey=${API_KEY}`
const getNews = async ()=>{

   let response;
    try {
         response = await axios.get(newsUrl);
        response = response.data.articles.slice(0,100);
       
    } catch (error) {
        return error
    }
    return response;
}
export const getCoins = async ()=>{

   let response;
    try {
         response = await axios.get(coinUrl);
        response = response.data;
        
    } catch (error) {
        console.log(error) 
    }
    return response;
}

export default getNews;