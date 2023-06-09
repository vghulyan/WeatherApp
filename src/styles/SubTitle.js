import { Text, StyleSheet } from "react-native";

const Subtitle = ({ children }) => {
  return <Text style={styles.subtitle}>{children}</Text>;
};

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
});

export default Subtitle;
