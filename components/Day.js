import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, SafeAreaView, Alert } from 'react-native';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';


// import { openWeatherKey } from './Secrets';
const openWeatherKey = `2cc7f238ba7cd430d974b1f12b930f85`;
let url = `https://api.openweathermap.org/data/2.5/onecall?&units=metric&exclude=minutely&appid=${openWeatherKey}`;


const App = () => {

    const [forecast, setForecast] = useState(null);

    const loadForecast = async () => {

        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission für die Location wurde abgelehnt');
        }

        let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });

        const response = await fetch(`${url}&lat=${location.coords.latitude}&lon=${location.coords.longitude}`);
        const data = await response.json();

        if (!response.ok) {
            Alert.alert(`Fehler bei dem Fetchen der Daten: ${data.message}`);
        } else {
            setForecast(data);
        }

    }

    useEffect(() => {
        if (!forecast) {
            loadForecast();
        }
    })

    if (!forecast) {
        return <SafeAreaView style={styles.loading}>
            <ActivityIndicator size="large" />
        </SafeAreaView>;
    }

    return (

        <View>
            <LinearGradient
                colors={['#a6c1ee', '#fbc2eb']}  
                style={styles.linearGradient}
            >
                <Text style={styles.subtitle}>Nächste 7 Tage</Text>
                {forecast.daily.slice(0, 7).map(d => { 
                    const weather = d.weather[0];
                    var dt = new Date(d.dt * 1000);
                    return <View style={styles.day} key={d.dt}>
                        <Text style={styles.dayTemp}>{Math.round(d.temp.max)}°C</Text>
                        <Image
                            style={styles.smallIcon}
                            source={{
                                uri: `http://openweathermap.org/img/wn/${weather.icon}@4x.png`,
                            }}
                        />
                        <View style={styles.dayDetails}>
                            <Text style={styles.dayDate}> {dt.toLocaleDateString()}</Text>
                            <Text style={styles.dayDate}> {weather.description}</Text>
                        </View>
                    </View>
                })}
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    subtitle: {
        fontSize: 24,
        marginVertical: 12,
        marginLeft: 4,
        color: 'white',
        marginLeft: 10,
    },

    day: {
        flexDirection: 'row',
    },
    dayDetails: {
        justifyContent: 'center',
    },
    dayTemp: {
        marginLeft: 12,
        alignSelf: 'center',
        fontSize: 20,
        color: 'white'
    },
    dayDate: {
        color: 'white'
    },
    smallIcon: {
        width: 100,
        height: 100,
    },
    linearGradient: {
        flex: 1,
        borderRadius: 25,
        marginTop: 20,
        paddingTop: 10, 
    }
});

export default App;