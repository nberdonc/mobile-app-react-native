import React, { useState } from 'react';
import axios from 'axios'
import { StatusBar, StyleSheet, Text, View, Button, TextInput, useWindowDimensions, Image, ImageBackground, TouchableOpacity, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign'
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function App() {

  const API_KEY = "16909a97489bed275d13dbdea4e01f59"
  const [city, setCity] = useState('')
  const [weatherData, setWeatherData] = useState([])
  const [temp, setTemp] = useState('')
  const [minTemp, setMinTemp] = useState('')
  const [maxTemp, setMaxTemp] = useState('')
  const [icon, setIcon] = useState('')
  const [cityDisplay, setCityDisplay] = useState('')
  const [desc, setDesc] = useState('')
  const [main, setMain] = useState('')
  const [humidity, setHumidity] = useState('')
  const [pressure, setPressure] = useState('')
  const [visibility, setVisibility] = useState('')

  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;

  let findWeatherData = (city) => {
    console.log("finding data")
    console.log(city)
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
    axios.get(url)
      .then((res) => {
        console.log(res.data)
        setWeatherData(res.data)
        setTemp((res.data.main.temp - 273.15).toFixed(0) + " C°")
        setMinTemp((res.data.main.temp_min - 273.15).toFixed(0) + " C°")
        setMaxTemp((res.data.main.temp_max - 273.15).toFixed(0) + " C°")
        setIcon(res.data.weather[0].icon)
        setCityDisplay(res.data.name)
        setDesc(res.data.weather[0].description)
        setMain(res.data.weather[0].main)
        setHumidity(res.data.main.humidity + " %")
        setPressure(res.data.main.pressure + " hPa")
        setVisibility((res.data.visibility / 1000).toFixed(0) + " km")
        console.log(res.data.weather[0].icon)
      })
      .catch((error) => {
        console.log(error.message)
      })
  }

  return (
    <>
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1602102245142-a0a02e7a6b05?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MjAwfHxibHVlJTIwc2t5fGVufDB8MXwwfA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' }}
        style={styles.Image_Background}
      >
        <View style={styles.input_box_view}>
          <TextInput
            placeholder='Search'
            placeholderTextcolor='#fff'
            style={styles.input_box}
            onChangeText={(text) => setCity(text)}
          />
          <TouchableOpacity style={styles.search_btn}>
            <Icon name='search1' size={24} color='#fff'
              onPress={() => {
                findWeatherData(city);
              }} />
          </TouchableOpacity>
        </View>

        <View style={styles.weather_box_main}>
          <View style={styles.weather_holder_view}>
            <Image source={{ uri: `http://openweathermap.org/img/wn/${icon}@2x.png` }} style={styles.weather_Img} />
            <View>
              <Text style={styles.temperature_text}>{temp}</Text>
              <Text style={styles.city_text}>{cityDisplay}</Text>
            </View>
          </View>
        </View>
      </ImageBackground>
    </>
  )
}

const styles = StyleSheet.create({
  Image_Background: {
    height: '100%',
    width: '100%'
  },
  input_box_view: {
    height: '20%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  input_box: {
    height: '35%',
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 15,
    color: '#FFF',
    paddingHorizontal: 15
  },
  search_btn: {
    marginLeft: '5%',
    height: '35%',
    width: '8%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  weather_box_main: {
    height: '30%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  weather_holder_view: {
    height: '80%',
    width: '90%',
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 15,
    alignItems: 'center',
    flexDirection: 'row'
  },
  weather_Img: {
    height: '80%',
    width: '50%'
  },
  temperature_text: {
    fontSize: 30,
    color: '#FFF',
    marginLeft: '5%'
  },
  city_text: {
    fontSize: 20,
    color: '#FFF',
    marginLeft: '5%',
    marginTop: '3%'
  },
});

// let { Title, Year, Plot } = res.data
//setMovie({ title: Title, year: Year, plot: Plot })
