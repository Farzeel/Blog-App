import React from 'react'
import { getCoins } from '../../api/external'
import styles from "./Crypto.module.css"
import { useEffect,useState } from 'react'
import { TailSpin } from 'react-loader-spinner'


const Crypto = () => {
    const [conins, setconins] = useState([]);
    const [loading, setloading] = useState(false);
    useEffect(() => {
        (async () => {
            setloading(true);

            const data = await getCoins();
            setconins(data);
            setloading(false);
        })();
        setconins([]);
    }, []);
    const poitiveStyle = {
        color:"#1dd1a1"
    }
    const NegitiveStyle = {
        color:"#ff6b6b"
    }
  return (
    <>
    {loading?<div className={styles.articleloader}>Currencies laoding.....<TailSpin height={30} color="gold"/></div>
    
    :
    <div className={styles.tablewraper}>
 <h2>Top CryptoCurrencies</h2>

<table className={styles.table}>
    <thead>
        <tr className={styles.rowhead}>
            <th >#</th>
            <th >Coin</th>
            <th >Symbol</th>
            <th >Price</th>
            <th >Price-cahnge-24-hour-per</th>
            <th >last updated</th>
        </tr>
    </thead>
    <tbody className={styles.tablebody}>
       { conins.map(coin=>
       <tr key={coin.id} className={styles.tablerow}>
            <td>{coin.market_cap_rank}</td>
            <td>
            <div className={styles.logo}>
            <img src={coin.image} alt="" /> {coin.name}
               
            </div>
                </td>
            <td>{coin.symbol}</td>
            <td>{coin.current_price} $</td>
            <td style={coin.price_change_percentage_24h>0?poitiveStyle:NegitiveStyle}>
                {coin.price_change_percentage_24h} $</td>
            <td>{new Date(coin.last_updated).toLocaleString()}</td>
        </tr>)}
   
      
    </tbody>
</table>
    </div>
       }
       </>
  )
}

export default Crypto
