import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import * as Location from "expo-location";
import { ListItem, Avatar } from "react-native-elements";
import { ActivityIndicator } from "react-native";

import { API_URL, API_KEY, WEATHER_URL } from "../../.env.json";
import Title from "../styles/Title";
import Subtitle from "../styles/SubTitle";
import LoadingIndicator from "../styles/LoadingIndicator";

const HomeScreen = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchWeatherData = async (lat, lon) => {
    setLoading(true); // start loading
    const response = await fetch(
      `${API_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`
    );
    const data = await response.json();
    setWeatherData(data);
    setLoading(false); // end loading
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      fetchWeatherData(location.coords.latitude, location.coords.longitude);
    })();
  }, []);

  return loading ? (
    <LoadingIndicator />
  ) : (
    <View style={styles.container}>
      {errorMsg ? (
        <Text>Error: {errorMsg}</Text>
      ) : (
        weatherData && (
          <View>
            {/* <Avatar
              source={{
                uri: `${weatherData.weather[0].icon}`,
              }}
            /> */}
            <Title>City: {weatherData.name}</Title>
            <Title>Country: {weatherData.sys.country}</Title>
            <Title>Temperature: {weatherData.main.temp}°F</Title>
            <Title>Weather: {weatherData.weather[0].description}</Title>

            <View style={styles.watherStyle}>
              {weatherData.weather.map((data, i) => (
                <ListItem key={i} bottomDivider>
                  <Avatar
                    source={{
                      uri: `${WEATHER_URL}/img/wn/${data.icon}.png`,
                    }}
                  />
                  <ListItem.Content>
                    <Title>{data.main}</Title>
                    <Subtitle>{data.description}</Subtitle>
                  </ListItem.Content>
                </ListItem>
              ))}
            </View>
          </View>
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 15,
  },
  watherStyle: {
    paddingTop: 10,
  },
});

export default HomeScreen;
