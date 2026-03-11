import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import MapView from 'react-native-maps'

const Dummy = () => {
    return (
        <SafeAreaView edges={["bottom"]} style={{ flex: 1 }}>
            <MapView
                style={{ flex: 1 }}
                provider="google"
                initialRegion={{
                    latitude: 37.78825,
                    longitude: -122.4324,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            />
        </SafeAreaView>
    )
}

export default Dummy

const styles = StyleSheet.create({})