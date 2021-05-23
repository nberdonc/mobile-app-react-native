import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { StyleSheet, Text, View, Image, ImageBackground, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign'
import 'moment-timezone';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { WEATHER_API_KEY, GOOGLE_API_KEY } from '@env'


export default function App() {

  const [city, setCity] = useState('Barcelona')
  const [weekList, setWeekList] = useState([])
  const [location, setLocation] = useState({
    userLat: '',
    userLng: ''
  })
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

  ///GET LOCATION///
  let getCoordinates = () => {
    let options = {
      enableHighAccuracy: true,//to receive the best possible results
      timeout: 10000,//max waiting time
    };
    let success = (pos) => {
      let crd = pos.coords;
      let lat = crd.latitude.toString();
      let lng = crd.longitude.toString();

      setLocation({
        userLat: lat,
        userLng: lng
      })

      console.log(`Latitude: ${lat}, Longitude: ${lng}`)
      displayLocationWeather(lat, lng)
    }
    let error = (err) => {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }
    navigator.geolocation.getCurrentPosition(success, error, options);
  }
  ///GET LOCATION WEATHER DATA///
  console.log(location.userLat)
  let displayLocationWeather = (lat, lng) => {
    let forecastByCoordUrl = `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lng}&cnt=7&appid=${WEATHER_API_KEY}`
    axios.get(forecastByCoordUrl)
      .then((res) => {
        console.log(res)
        setCity(res.data.city.name)
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

  ///GET WEATHER DATA///
  let findWeatherData = (city) => {
    let forecastUrl = `https://api.openweathermap.org/data/2.5/forecast/daily?q=${city}&cnt=7&appid=${WEATHER_API_KEY}`
    axios.get(forecastUrl)
      .then((res) => {
        console.log(res)
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
  console.log(weatherData.weekDay)

  let renderDayLines = () => (
    weekList.map((day, idx) => {
      if (idx < 7) {
        return <View key={idx} style={styles.weather_line_week}>
          <View style={styles.weather_line_city}>
            <Text style={styles.forecast_text}>{new Date(day.dt * 1000).toString().split(' ')[0]}</Text>
          </View>
          <View style={styles.weather_line_icon}>
            <Image style={styles.weather_Img} source={{ uri: `http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png` }} />
          </View>
          <View style={styles.weather_line_temp}>
            <Text style={styles.forecast_text}>{(day.temp.max - 273.15).toFixed(0) + "°"}</Text>
            <Text style={styles.forecast_text}>{(day.temp.min - 273.15).toFixed(0) + "°"}</Text>
          </View>
        </View>
      }
      else { null }
    })
  )

  useEffect(() => {
    getCoordinates()
  }, [])

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1564324889062-df1710527dd9?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTE3fHxza3l8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' }}
        style={styles.Image_Background}>
        <View style={styles.input_box_view}>
          <GooglePlacesAutocomplete
            placeholder='Search'
            placeholderTextcolor='#fff'
            style={styles.input_box}
            onPress={(data, details = null) => {
              // 'details' is provided when fetchDetails = true
              console.log("triggers when user selected something from the dropdown of suggestions", data, details);
              setCity(data.structured_formatting.main_text)
              findWeatherData(data.structured_formatting.main_text)
            }}
            query={{
              key: GOOGLE_API_KEY,
              language: 'en',
            }}

          />
          <TouchableOpacity style={styles.search_btn}>
            <Icon name='search1' size={24} color='#fff'
              onPress={() => {
                findWeatherData(city);
                console.log(city)
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
    </View>
  )
}

const styles = StyleSheet.create({
  container: {

  },
  Image_Background: {
    resizeMode: 'stretch'
  },
  input_box_view: {
    height: '18%',
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: '8%',
    marginLeft: '5%',
    marginRight: '3%',
  },
  input_box: {
    height: '12%',
    width: '80%',
    borderColor: 'gray',
    color: '#FFF',
  },
  search_btn: {
    marginLeft: '5%',
    height: '35%',
    width: '8%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  weather_box_main: {
    height: 220,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  weather_holder_view: {
    height: '80%',
    width: '90%',
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 15,
    alignItems: 'center',
    flexDirection: 'column',
  },
  temperature_text: {
    fontSize: 50,
    color: 'rgb(46, 45, 45)',
    marginLeft: '5%',
  },
  city_text: {
    fontSize: 30,
    color: 'rgb(46, 45, 45)',
    marginLeft: '5%',
    marginTop: '5%',
  },
  main_text: {
    fontSize: 20,
    color: 'rgb(46, 45, 45)',
    marginLeft: '5%',
    marginTop: '2%',
  },
  weather_box_week: {
    height: 355,
    width: '100%',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  weather_holder_week: {
    height: '88%',
    width: '90%',
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 15,
    flexDirection: 'column',
  },
  weather_line_week: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weather_line_city: {
    width: 130
  },
  weather_line_icon: {
    width: 90
  },
  weather_line_temp: {
    width: 90,
    marginRight: '5%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  forecast_text: {
    fontSize: 20,
    color: 'rgb(46, 45, 45)',
    marginLeft: '20%',
    marginTop: '3%',
  },
  weather_Img: {
    height: 45,
    width: 45,
  }
});
