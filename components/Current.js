import React from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'


export default function Current({ currentWeather }) {
    const {
        main: { temp },
        weather: [details],
        name,
    } = currentWeather

    const { icon, description } = details
    const iconUrl = `http://openweathermap.org/img/wn/${icon}@4x.png`
    return (
        <View>
            <Text style={styles.title} >Aktuelles Wetter</Text>
            <Text style={styles.place} >{name}</Text>
            <View style={styles.currents}>
            <Text style={styles.currentTemp} >{Math.round(temp)}°C</Text>
                <Image
                    style={styles.largeIcon}
                    source={{
                        uri: iconUrl,
                    }}
                />
            </View>
            <Text style={styles.currentDescription}>{description}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        width: '100%',
        textAlign: 'center',
        fontSize: 42,
        color: '#a6c1ee',
        marginTop: 20,
    },
    place: {
        width: '100%',
        textAlign: 'center',
        fontSize: 18 ,
    },
    currents: {
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center',
    },
    currentTemp: {
        fontSize: 48,
        textAlign: 'center',
        color: '#a6c1ee',
        paddingLeft: 25,
    },
    currentDescription: {
        width: '100%',
        textAlign: 'center',
        fontWeight: '200',
        fontSize: 24,
        marginBottom: 24
    },
    largeIcon: {
        width: 250,
        height: 200,
    },

});
