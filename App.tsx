import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Share, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Position = {
  lat: string,
  lon: string,
  timestamp: string
}

let foregroundSubscription: any = null

export default function App() {
  const [getPosition, setGetPosition] = useState<boolean>(false)
  const [listPosition, setListPosition] = useState<Position[]>([])
  const [load, setLoad] = useState<boolean>(false)




  const storeData = async (value: Object[]) => {
    try {
      console.log(value)
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('listPositions', jsonValue);
    } catch (e) {
      Alert.alert(`Error: ${e}`)
    }
  }

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('listPositions');
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      Alert.alert(`Error: ${e}`)
    }
  }

  const clearAll = async () => {
    try {
      await AsyncStorage.clear()
    } catch (e) {
      Alert.alert(`Error: ${e}`)
    }
  }

  const handleStartWatchPosition = useCallback(async () => {
    setGetPosition(true)
    try {
      foregroundSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          distanceInterval: 1,
          timeInterval: 3000
        },
        ({ coords, timestamp }) => {
          setListPosition(list => [...list, {
            lat: coords.latitude.toString(),
            lon: coords.longitude.toString(),
            timestamp: timestamp.toString()
          }])
        }
      );
    } catch (e) {
      Alert.alert(`Error: ${e}`)
    }


  }, [])

  const handleStopWatchPosition = useCallback(async () => {
    await storeData(listPosition)
    setGetPosition(false)
    foregroundSubscription.remove()
  }, [])

  async function handleShare() {
    setLoad(true)
    try {
      if (listPosition.length < 1) {
        throw new Error("Empty List")
      }
      await Share.share({ message: JSON.stringify(listPosition) });
    } catch (e) {
      Alert.alert(`Error: ${e}`)
    } finally {
      setLoad(false)
    }
  }

  const handleClearListPosition = () =>
    Alert.alert('Aviso', 'Tem certeza que quer apagar a listagem das localizações?', [
      {
        text: 'Não',
        onPress: () => { },
        style: 'cancel',
      },
      { text: 'Sim', onPress: actionClearListPosition },
    ]);

  async function actionClearListPosition() {
    try {
      setListPosition([])
      await clearAll()
    } catch (e) {
      Alert.alert(`Error: ${e}`)
    }

  }

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }
      const getDataLocalListPosition = await getData()
      console.log(getDataLocalListPosition)
      setListPosition(getDataLocalListPosition)
    })();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.containerButton}>
        {
          getPosition ?
            <TouchableOpacity style={[styles.button, { backgroundColor: 'red' }]} onPress={handleStopWatchPosition}>
              <Text style={styles.buttonText}>Finalizar</Text>
            </TouchableOpacity>
            :
            <TouchableOpacity style={[styles.button, { backgroundColor: 'green' }]} onPress={handleStartWatchPosition}>
              <Text style={styles.buttonText}>Iniciar</Text>
            </TouchableOpacity>
        }
      </View>
      <FlatList
        data={listPosition}
        keyExtractor={(item, index) => index.toString()}
        style={styles.listPositions}
        renderItem={({ item }) => (
          <View style={{
            borderWidth: 1,
            padding: 10,
            gap: 5
          }}>
            <Text>Lat:{item.lat}</Text>
            <Text>Lon:{item.lon}</Text>
            <Text>Time:{item.timestamp}</Text>
          </View>
        )}
      />
      {
        listPosition.length > 0 && !getPosition &&
        <>
          <TouchableOpacity style={styles.buttonShare} onPress={handleShare}>
            {
              load ?
                <ActivityIndicator size={'large'} animating />
                :
                <Text style={styles.buttonText}>Exportar dados</Text>
            }
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonDelete} onPress={handleClearListPosition}>
            {
              load ?
                <ActivityIndicator size={'large'} animating />
                :
                <Text style={styles.buttonText}>Excluir os dados</Text>
            }
          </TouchableOpacity>
        </>

      }
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8d8b8b',
    alignItems: 'center',
  },
  containerButton: {
    width: '100%',
    height: '30%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 100,
    height: 100,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonShare: {
    width: '50%',
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2477f3',
    marginBottom: 20,
  },
  buttonDelete: {
    width: '50%',
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f32424',
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  listPositions: {
    width: '85%',
    height: '60%',
    borderRadius: 10,
    backgroundColor: 'white',
    marginBottom: 30,
  }
});
