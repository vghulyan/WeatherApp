import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import * as Location from "expo-location";
import { ListItem, Avatar } from "react-native-elements";
import { ActivityIndicator } from "react-native";

import { API_URL, API_KEY, WEATHER_URL } from "../../.env.json";
import Title from "../styles/Title";
import Subtitle from "../styles/SubTitle";
import LoadingIndicator from "../styles/LoadingIndicator";

const ForecastScreen = () => {
  const [location, setLocation] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchForecastData = async (lat, lon) => {
    setLoading(true); // start loading
    const response = await fetch(
      `${API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`
    );
    const data = await response.json();
    // Extract the list and create a new array containing only one forecast per day
    const dailyData = data.list.filter((_, index) => index % 8 === 0);
    setForecastData(dailyData);
    setLoading(false); // end loading
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      fetchForecastData(location.coords.latitude, location.coords.longitude);
    })();
  }, []);

  return loading ? (
    <LoadingIndicator />
  ) : (
    <View style={styles.container}>
      {forecastData.map((data, i) => (
        <ListItem key={i} bottomDivider>
          <Avatar
            source={{
              uri: `${WEATHER_URL}/img/wn/${data.weather[0].icon}.png`,
            }}
          />
          <ListItem.Content>
            <Title>
              {new Date(data.dt * 1000).toLocaleDateString()} -{" "}
              {data.weather[0].main}
            </Title>

            <Subtitle>Temperature: {data.main.temp}°F</Subtitle>
            <Subtitle>Humidity: {data.main.humidity}</Subtitle>
            <Subtitle>Pressure: {data.main.pressure}</Subtitle>
            <Subtitle>Wind: {data.wind.speed}</Subtitle>
          </ListItem.Content>
        </ListItem>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {},
});

export default ForecastScreen;
