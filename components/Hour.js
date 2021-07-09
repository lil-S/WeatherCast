import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, SafeAreaView, FlatList, Alert } from 'react-native';
import * as Location from 'expo-location';

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
          <Text style={styles.subtitle}>Stündliche Vorhersage</Text>
          <FlatList horizontal
            data={forecast.hourly.slice(0, 24)}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ justifyContent: 'center', flexDirection: 'row'}}
            renderItem={(hour) => {
              const weather = hour.item.weather[0];
              var dt = new Date(hour.item.dt * 1000);
              return <View style={styles.hour}>
                <Text>{dt.toLocaleTimeString().replace(/:\d+ /, ' ')}</Text>
                <Text>{Math.round(hour.item.temp)}°C</Text>
                <Image
                  style={styles.smallIcon}
                  source={{
                    uri: `http://openweathermap.org/img/wn/${weather.icon}@4x.png`,
                  }}
                />
                <Text>{weather.description}</Text>
              </View>
            }}
          />
        </View>

  );
}

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 24,
    marginVertical: 12,
    marginLeft: 4,
    color: '#fbc2eb',
    marginLeft: 10,
  },
  hour: {
    padding: 6,
    alignItems: 'center',
    backgroundColor: "#dedede",
    justifyContent: 'space-around',
    margin: 5,
    borderRadius: 10,
    color: 'white',
  },
  smallIcon: {
    width: 100,
    height: 100,
  }
});

export default App;