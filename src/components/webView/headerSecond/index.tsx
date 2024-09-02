import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView} from 'react-native';

// Weather service function
const fetchWeather = async location => {
  const API_KEY = '3192dfcf1643de07950bd30f3f729e36'; // Replace with your actual API key
  const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
  try {
    const response = await fetch(
      `${BASE_URL}?q=${location}&appid=${API_KEY}&units=metric`,
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

// Custom header component
const CustomHeader = ({location}) => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const getWeather = async () => {
      const data = await fetchWeather(location);
      setWeather(data);
    };

    getWeather();
  }, [location]);

  return (
    <View style={styles.header}>
      {/* <Text style={styles.title}>Weather App</Text> */}
      {weather ? (
        <View style={styles.weatherContainer}>
          <Text style={styles.weatherText}>{weather.main.temp}°C</Text>
          <Text style={styles.weatherText}>
            {weather.weather[0].description}
          </Text>
        </View>
      ) : (
        <Text style={styles.loadingText}>Loading...</Text>
      )}
    </View>
  );
};

// Main app component
const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader location="London" />
      {/* Your other components */}
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 60,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  weatherContainer: {
    marginLeft: 'auto',
    alignItems: 'flex-end',
  },
  weatherText: {
    fontSize: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#888',
  },
});

export default App;
