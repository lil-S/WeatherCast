import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, ScrollView, RefreshControl } from 'react-native'
import * as Location from 'expo-location'
import * as Haptics from 'expo-haptics';
import { Header } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import Current from './components/Current'
import Hour from './components/Hour'
import Day from './components/Day'

const BASE_WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather?'
const WEATHER_API_KEY = '2cc7f238ba7cd430d974b1f12b930f85'



export default function App() {
  const [errorMessage, setErrorMessage] = useState(null)
  const [currentWeather, setCurrentWeather] = useState(null)
  const [refreshing, setRefreshing] = useState(false);
  const [unitsSystem, setUnitsSystem] = useState('metric')

  useEffect(() => {
    load()
  }, [unitsSystem])

  async function load() {
    setRefreshing(true);
    setCurrentWeather(null)
    setErrorMessage(null)
    try {
      let { status } = await Location.requestForegroundPermissionsAsync()

      if (status !== 'granted') {
        setErrorMessage('ugriff auf Location ist erforderlich, um die App zu starten')
        return
      }
      let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true })

      const { latitude, longitude } = location.coords

      const weatherUrl = `${BASE_WEATHER_URL}lat=${latitude}&lon=${longitude}&units=${unitsSystem}&appid=${WEATHER_API_KEY}`


      const response = await fetch(weatherUrl)
      const result = await response.json()

      if (response.ok) {
        setCurrentWeather(result)
      } else {
        setErrorMessage(result.message)
      }

      const forecastResponse = await fetch(`${url}&lat=${latitude}&lon=${longitude}`);
      const data = await forecastResponse.json();

      if (forecastResponse.ok) {
        setForecast(data)
      } else {
        setErrorMessage(data.message)
      }

    } catch (error) {
      setErrorMessage(error.message)
    }

    setRefreshing(false);
  }
  if (currentWeather) {
    return (
      <View style={styles.container}>
        <StatusBar translucent={true} backgroundColor={'transparent'} />
        <Header
          centerComponent={{ text: 'WeatherCast', style: { color: '#fff', fontSize: 22, } }}
          containerStyle={{
            height: 75,
          }}
          ViewComponent={LinearGradient}
          linearGradientProps={{
            colors: ['#fbc2eb', '#a6c1ee'],
            start: { x: 0, y: 0.5 },
            end: { x: 1, y: 0.5 },
          }}
        />
        <StatusBar style="auto" />
        <ScrollView
          refreshControl={
            <RefreshControl
              onRefresh={() => {
                load(),
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
              }}
              refreshing={refreshing}
            />}
        >
          <Current currentWeather={currentWeather} />
          <Hour />
          <Day />
        </ScrollView>

      </View>
    )
  } else {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>{errorMessage}</Text>
        <StatusBar style="auto" />
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  main: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  }
})