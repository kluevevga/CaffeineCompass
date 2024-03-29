import { useEffect, useState, useContext } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Banner from "../components/banner";
import Card from "../components/card";
import { fetchCoffeeStores } from "../lib/coffee-stores";
import useTrackLoctaion from "../hooks/use-track-location";
import { ACTION_TYPES, StoreContext } from "../store/store-context";

export default function Home(props) {
   const { handleTruckLocaion, locationErrorMsg, isFindingLocation } =
      useTrackLoctaion();
   // const [coffeeStores, setCoffeeStores] = useState('')
   const [coffeeStoresError, setCoffeeStoresError] = useState(null);
   const { dispatch, state } = useContext(StoreContext);
   const { coffeeStores, latLng } = state;

   const handleOnBunnderClick = () => {
      handleTruckLocaion();
   };

   useEffect(() => {
      if (latLng) {
         try {
            const getStores = async () => {
               const res = await fetch(
                  `/api/getCoffeeStoresByLocation?latLng=${latLng}&limit=${30}`
               );
               // setCoffeeStores(fetchedCoffeeStores)
               const fetchedCoffeeStores = await res.json();
               dispatch({
                  type: ACTION_TYPES.SET_COFFEE_STORES,
                  payload: { coffeeStores: fetchedCoffeeStores },
               });
               setCoffeeStoresError("");
            };
            getStores();
         } catch (error) {
            console.log(error);
            setCoffeeStoresError(error.message);
         }
      }
   }, [latLng]); //eslint-disable-line

   return (
      <div className={styles.container}>
         <Head>
            <title>CaffeineCompass</title>
            <meta name="description" content="Generated by create next app" />
            <link rel="icon" href="/favicon.svg" />
         </Head>

         <main className="main">
            <Banner
               buttonText={
                  isFindingLocation ? "Locating..." : "View stores nearby"
               }
               handleOnClick={handleOnBunnderClick}
            />
            {locationErrorMsg && (
               <p>Something went wrong: {locationErrorMsg}</p>
            )}
            {coffeeStoresError && (
               <p>Something went wrong: {coffeeStoresError}</p>
            )}

            {coffeeStores.length > 0 && (
               <div className={styles.sectionWrapper}>
                  <h2 className={styles.heading2}>Stores near me</h2>
                  <div className={styles.cardLayout}>
                     {coffeeStores.map((coffeeStore) => (
                        <Card
                           key={coffeeStore.id}
                           name={coffeeStore.name}
                           imgUrl={
                              coffeeStore.imgUrl ||
                              "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                           }
                           href={`/coffee-store/${coffeeStore.id}`}
                        />
                     ))}
                  </div>
               </div>
            )}

            {props.coffeeStores.length > 0 && (
               <div className={styles.sectionWrapper}>
                  <h2 className={styles.heading2}>Moskow city stores</h2>
                  <div className={styles.cardLayout}>
                     {props.coffeeStores.map((coffeeStore) => (
                        <Card
                           key={coffeeStore.id}
                           name={coffeeStore.name}
                           imgUrl={
                              coffeeStore.imgUrl ||
                              "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                           }
                           href={`/coffee-store/${coffeeStore.id}`}
                        />
                     ))}
                  </div>
               </div>
            )}
         </main>
      </div>
   );
}

export const getStaticProps = async (context) => {
   const coffeeStores = await fetchCoffeeStores();
   return { props: { coffeeStores } };
};
