import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { StyleSheet, Text, View, TextInput, useWindowDimensions, Image, ImageBackground, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Moment from 'react-moment';
import 'moment-timezone';
import GetLocation from 'react-native-get-location'
import { Location, Permissions } from 'expo'


export default function App() {

  const [errorMsg, setErrorMsg] = useState('')
  const [userLocation, setUserLocation] = useState('')

  let getLocation = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      console.log('Not granted')
      setErrorMsg('Permission not granted')
    }
  }

  const userLocation = Location.getCurrentPosition()

  setUserLocation(userLocation)


  const API_KEY = "16909a97489bed275d13dbdea4e01f59"
  const [city, setCity] = useState('Barcelona')
  const [weekList, setWeekList] = useState([])
  const [weatherData, setWeatherData] = useState({
    weekDays: '',
    temp: '',
    minTemp: '',
    maxTemp: '',
    icon: '',
    cityDisplay: '',
    descript: '',
    maindescr: '',
    weekDay: '',
  })

  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;

  GetLocation.getCurrentPosition({
    enableHighAccuracy: true,
    timeout: 15000,
  })
    .then(location => {
      console.log(location);
    })
    .catch(error => {
      const { code, message } = error;
      console.warn(code, message);
    })

  let findWeatherData = (city) => {
    let forecastUrl = `https://api.openweathermap.org/data/2.5/forecast/daily?q=${city}&cnt=7&appid=${API_KEY}`
    axios.get(forecastUrl)
      .then((res) => {
        console.log(res.data)
        setWeekList(res.data.list)
        setWeatherData({
          ...weatherData,
          cityDisplay: res.data.city.name,
          temp: (res.data.list[0].temp.day - 273.15).toFixed(0) + "°",
          maindescr: res.data.list[0].weather[0].main,
          weekDay: res.data.list[0].dt * 1000
        })
      })
      .catch((error) => {
        console.log(error.message)
      })
  }
  //var weekDayName = moment(1616065200).format('dddd');
  console.log(weatherData.weekDay)
  //console.log(weekDayName)   

  let renderDayLines = () => (
    weekList.map((day, idx) => {
      return <View key={idx} style={styles.weather_line_week}>
        <View style={styles.weather_line_city}>

          <Text style={styles.forecast_text}>{new Date(day.dt * 1000).toLocaleString("en-us", { weekday: "long" })}</Text>
        </View>
        <View style={styles.weather_line_icon}>
          <Image style={styles.weather_Img} source={{ uri: `http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png` }} />
        </View>
        <View style={styles.weather_line_temp}>
          <Text style={styles.forecast_text}>{(day.temp.max - 273.15).toFixed(0) + "°"}</Text>
          <Text style={styles.forecast_text}>{(day.temp.min - 273.15).toFixed(0) + "°"}</Text>
        </View>
      </View>
    })
  )

  // new Date(day.dt * 1000).toLocaleString("en-us", { weekday: "long" })

  useEffect(() => {
    findWeatherData(city)
    getLocation()
  }, [])

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
            <Text style={styles.city_text}>{weatherData.cityDisplay}</Text>
            <Text style={styles.main_text}>{weatherData.maindescr}</Text>
            <Text style={styles.temperature_text}>{weatherData.temp}</Text>
          </View>
        </View>
        <View style={styles.weather_box_week}>
          <View style={styles.weather_holder_week}>
            {renderDayLines()}
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
    flexDirection: 'column'
  },
  weather_holder_view: {
    height: '80%',
    width: '90%',
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 15,
    alignItems: 'center',
    flexDirection: 'column'
  },
  temperature_text: {
    fontSize: 50,
    color: '#FFF',
    marginLeft: '5%'
  },
  city_text: {
    fontSize: 30,
    color: '#FFF',
    marginLeft: '5%',
    marginTop: '10%'
  },
  main_text: {
    fontSize: 20,
    color: '#FFF',
    marginLeft: '5%',
    marginTop: '3%'
  },
  weather_box_week: {
    height: '50%',
    width: '100%',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  weather_holder_week: {
    height: '80%',
    width: '90%',
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 15,
    flexDirection: 'column',
  },
  weather_line_week: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '2.3%'
  },
  weather_line_city: {
    width: 130
  },
  weather_line_icon: {
    width: 90
  },
  weather_line_temp: {
    width: 90,
    marginRight: '3%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  forecast_text: {
    fontSize: 20,
    color: '#FFF',
    marginLeft: '6%',
    marginTop: '3%'
  },
  weather_Img: {
    height: 45,
    width: 45,
  }
});