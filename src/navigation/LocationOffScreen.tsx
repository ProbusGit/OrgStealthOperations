import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
const { check, request } = require('react-native-location-enabler');
// const { SUCCESS } = require('react-native-location-enabler').RESULT;

const LocationOffScreen = ({ navigation }: any) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Location Services Off</Text>
            <Text style={styles.message}>
            It seems like your device's location services are turned off. Please enable location services and try again.
            </Text>
            <Button
            title="Retry"
            onPress={async () => {
                console.log('location ----------',)

                const result = await check({
                useSettingsDialog: true,
                rationale: {
                    title: "Enable Location",
                    message: "This app requires location services to be enabled.",
                    buttonPositive: "OK",
                    buttonNegative: "Cancel",
                },
                });
                console.log('location ----------', result)
                // if (result === SUCCESS) {
                // navigation.goBack();
                // }
            }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f8f9fa',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    message: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        color: '#666',
    },
});

export default LocationOffScreen;