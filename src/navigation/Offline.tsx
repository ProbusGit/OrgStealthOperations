import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const OfflineScreen: React.FC = ({ navigation }: any) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>You are Offline</Text>
            <Text style={styles.message}>
                It seems like your device is not connected to the internet. Please check your connection and try again.
            </Text>
            <Button title="Retry" onPress={() => navigation.goBack()} />
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

export default OfflineScreen;