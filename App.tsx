import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Share, ActivityIndicator, Modal } from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { Polyline } from 'react-native-maps';
import * as TaskManager from 'expo-task-manager';
import { createTable, deleteAll, getDBConnection, insert, select } from './db/connection';

let foregroundSubscription: any = null

const LOCATION_TASK_NAME = 'background-location-task';



export default function App() {
  //const route = [{ "lat": "-26.9039384", "lon": "-48.6691109", "timestamp": "1692110300063" }, { "lat": "-26.9037515", "lon": "-48.6691061", "timestamp": "1692110302929" }, { "lat": "-26.9037326", "lon": "-48.6690661", "timestamp": "1692110306134" }, { "lat": "-26.9038211", "lon": "-48.6690381", "timestamp": "1692110309733" }, { "lat": "-26.9038607", "lon": "-48.6690281", "timestamp": "1692110313333" }, { "lat": "-26.9038868", "lon": "-48.6690194", "timestamp": "1692110316423" }, { "lat": "-26.9039055", "lon": "-48.6690052", "timestamp": "1692110319514" }, { "lat": "-26.9039185", "lon": "-48.6690014", "timestamp": "1692110322585" }, { "lat": "-26.903937", "lon": "-48.6690067", "timestamp": "1692110325675" }, { "lat": "-26.9039454", "lon": "-48.669014", "timestamp": "1692110334443" }, { "lat": "-26.9039483", "lon": "-48.6690294", "timestamp": "1692110337513" }, { "lat": "-26.9039358", "lon": "-48.6690174", "timestamp": "1692110342134" }, { "lat": "-26.9039152", "lon": "-48.6689736", "timestamp": "1692110345734" }, { "lat": "-26.9038831", "lon": "-48.6689308", "timestamp": "1692110348825" }, { "lat": "-26.9036659", "lon": "-48.6688441", "timestamp": "1692110351924" }, { "lat": "-26.9033406", "lon": "-48.6688273", "timestamp": "1692110354739" }, { "lat": "-26.903", "lon": "-48.6687929", "timestamp": "1692110357739" }, { "lat": "-26.902757", "lon": "-48.6687702", "timestamp": "1692110360739" }, { "lat": "-26.9026361", "lon": "-48.6687566", "timestamp": "1692110363739" }, { "lat": "-26.9025873", "lon": "-48.6686831", "timestamp": "1692110366740" }, { "lat": "-26.9024839", "lon": "-48.66846", "timestamp": "1692110369740" }, { "lat": "-26.9022926", "lon": "-48.6682563", "timestamp": "1692110372739" }, { "lat": "-26.9020031", "lon": "-48.6680389", "timestamp": "1692110375740" }, { "lat": "-26.9017716", "lon": "-48.6678599", "timestamp": "1692110378739" }, { "lat": "-26.9016619", "lon": "-48.6677787", "timestamp": "1692110381739" }, { "lat": "-26.9016042", "lon": "-48.6677592", "timestamp": "1692110384740" }, { "lat": "-26.9014927", "lon": "-48.6677864", "timestamp": "1692110387740" }, { "lat": "-26.9013256", "lon": "-48.6680113", "timestamp": "1692110390739" }, { "lat": "-26.9012051", "lon": "-48.6682989", "timestamp": "1692110393739" }, { "lat": "-26.9011445", "lon": "-48.6684526", "timestamp": "1692110396739" }, { "lat": "-26.9011296", "lon": "-48.6684885", "timestamp": "1692110399739" }, { "lat": "-26.9011206", "lon": "-48.6685224", "timestamp": "1692110402740" }, { "lat": "-26.9010803", "lon": "-48.6686088", "timestamp": "1692110405739" }, { "lat": "-26.9009359", "lon": "-48.6688358", "timestamp": "1692110408739" }, { "lat": "-26.9006957", "lon": "-48.6691621", "timestamp": "1692110411739" }, { "lat": "-26.9003825", "lon": "-48.6694819", "timestamp": "1692110414739" }, { "lat": "-26.9000408", "lon": "-48.6698427", "timestamp": "1692110417740" }, { "lat": "-26.8996448", "lon": "-48.6702209", "timestamp": "1692110420739" }, { "lat": "-26.8992044", "lon": "-48.6705674", "timestamp": "1692110423739" }, { "lat": "-26.8987646", "lon": "-48.6709478", "timestamp": "1692110426739" }, { "lat": "-26.8982824", "lon": "-48.671288", "timestamp": "1692110429739" }, { "lat": "-26.8977866", "lon": "-48.6716013", "timestamp": "1692110432740" }, { "lat": "-26.897281", "lon": "-48.6719173", "timestamp": "1692110435739" }, { "lat": "-26.8968001", "lon": "-48.672209", "timestamp": "1692110438740" }, { "lat": "-26.8963816", "lon": "-48.6724992", "timestamp": "1692110441740" }, { "lat": "-26.8959196", "lon": "-48.6727957", "timestamp": "1692110444739" }, { "lat": "-26.8954348", "lon": "-48.6731426", "timestamp": "1692110447739" }, { "lat": "-26.8949816", "lon": "-48.6734937", "timestamp": "1692110450739" }, { "lat": "-26.894609", "lon": "-48.6738055", "timestamp": "1692110453739" }, { "lat": "-26.8943436", "lon": "-48.674034", "timestamp": "1692110456740" }, { "lat": "-26.8941827", "lon": "-48.6741605", "timestamp": "1692110459740" }, { "lat": "-26.8941469", "lon": "-48.6741918", "timestamp": "1692110462739" }, { "lat": "-26.8941379", "lon": "-48.6741926", "timestamp": "1692110465740" }, { "lat": "-26.8941328", "lon": "-48.6742021", "timestamp": "1692110474740" }, { "lat": "-26.8940162", "lon": "-48.6743112", "timestamp": "1692110477526" }, { "lat": "-26.8935881", "lon": "-48.6746038", "timestamp": "1692110480739" }, { "lat": "-26.893207", "lon": "-48.6749084", "timestamp": "1692110483739" }, { "lat": "-26.8928188", "lon": "-48.6752071", "timestamp": "1692110486739" }, { "lat": "-26.8925529", "lon": "-48.6754484", "timestamp": "1692110489739" }, { "lat": "-26.8922381", "lon": "-48.6757098", "timestamp": "1692110492739" }, { "lat": "-26.8918771", "lon": "-48.6759966", "timestamp": "1692110495739" }, { "lat": "-26.8915134", "lon": "-48.6763103", "timestamp": "1692110498740" }, { "lat": "-26.8912082", "lon": "-48.6765668", "timestamp": "1692110501739" }, { "lat": "-26.8909928", "lon": "-48.6767534", "timestamp": "1692110504740" }, { "lat": "-26.8907312", "lon": "-48.6769842", "timestamp": "1692110507740" }, { "lat": "-26.8905096", "lon": "-48.6771636", "timestamp": "1692110510739" }, { "lat": "-26.89033", "lon": "-48.6773375", "timestamp": "1692110513740" }, { "lat": "-26.8900909", "lon": "-48.6775204", "timestamp": "1692110516739" }, { "lat": "-26.8897824", "lon": "-48.6777661", "timestamp": "1692110519739" }, { "lat": "-26.8894548", "lon": "-48.6780396", "timestamp": "1692110522739" }, { "lat": "-26.8890971", "lon": "-48.6783546", "timestamp": "1692110525740" }, { "lat": "-26.8887161", "lon": "-48.6786528", "timestamp": "1692110528739" }, { "lat": "-26.8884275", "lon": "-48.6788919", "timestamp": "1692110531740" }, { "lat": "-26.8881817", "lon": "-48.6791582", "timestamp": "1692110534739" }, { "lat": "-26.8879174", "lon": "-48.6794654", "timestamp": "1692110537739" }, { "lat": "-26.8876952", "lon": "-48.679773", "timestamp": "1692110540739" }, { "lat": "-26.8875403", "lon": "-48.6799913", "timestamp": "1692110543739" }, { "lat": "-26.88745", "lon": "-48.6801494", "timestamp": "1692110546739" }, { "lat": "-26.8874567", "lon": "-48.6802704", "timestamp": "1692110549740" }, { "lat": "-26.887577", "lon": "-48.6803986", "timestamp": "1692110552739" }, { "lat": "-26.8877505", "lon": "-48.6804617", "timestamp": "1692110555740" }, { "lat": "-26.8878642", "lon": "-48.6804652", "timestamp": "1692110558739" }, { "lat": "-26.887902", "lon": "-48.6804313", "timestamp": "1692110561740" }, { "lat": "-26.8879468", "lon": "-48.6804016", "timestamp": "1692110564739" }, { "lat": "-26.8880036", "lon": "-48.6803269", "timestamp": "1692110567739" }, { "lat": "-26.8881074", "lon": "-48.6801934", "timestamp": "1692110570740" }, { "lat": "-26.8881726", "lon": "-48.6801289", "timestamp": "1692110573739" }, { "lat": "-26.8882477", "lon": "-48.680063", "timestamp": "1692110576740" }, { "lat": "-26.8883488", "lon": "-48.6799506", "timestamp": "1692110579739" }, { "lat": "-26.8883234", "lon": "-48.6798523", "timestamp": "1692110582739" }, { "lat": "-26.8883152", "lon": "-48.6797832", "timestamp": "1692110585740" }, { "lat": "-26.8883142", "lon": "-48.6797345", "timestamp": "1692110588740" }, { "lat": "-26.8883187", "lon": "-48.6797448", "timestamp": "1692110594739" }, { "lat": "-26.8883301", "lon": "-48.6798092", "timestamp": "1692110600739" }, { "lat": "-26.8883604", "lon": "-48.6799022", "timestamp": "1692110603739" }]
  const [getPosition, setGetPosition] = useState<boolean>(false)
  const [listPosition, setListPosition] = useState<Location.LocationObjectCoords[]>([])
  const [load, setLoad] = useState<boolean>(false)
  const [openMap, setOpenMap] = useState<boolean>(false)

  TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
    if (error) {
      return;
    }
    if (data) {
      const { locations } = data as {
        locations: {
          coords: Location.LocationObjectCoords
        }[]
      }
      const db = await getDBConnection('local')
      const newInsert = await insert(db, 'locals', [{ name: 'latitude', value: locations[0].coords.latitude }, { name: 'longitude', value: locations[0].coords.longitude }])
      console.log('Local: ', locations[0].coords)
      setListPosition(list => [...list, locations[0].coords])
    }
  });

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
      await AsyncStorage.removeItem('listPositions');
    } catch (e) {
      Alert.alert(`Error: ${e}`)
    }
  }

  const handleStartBackgroundGetPosition = useCallback(async () => {
    setGetPosition(true)
    try {
      const { status } = await Location.requestBackgroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location and task was denied');
        return;
      }
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.High,
        distanceInterval: 1,
        timeInterval: 2000,
        foregroundService: {
          notificationTitle: "BackgroundLocation Is On",
          notificationBody: "We are tracking your location",
          notificationColor: "#ffce52",
        },
      });
    } catch (e) {
      Alert.alert(`Error: ${e}`)
    }
  }, [])

  const handleStopBackgroundGetPosition = useCallback(async () => {
    setGetPosition(false)
    await TaskManager.unregisterTaskAsync(LOCATION_TASK_NAME)
  }, [])



  const handleStartWatchPosition = useCallback(async () => {
    setGetPosition(true)
    try {
      await foregroundSubscription?.remove()
      foregroundSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          distanceInterval: 1,
          timeInterval: 3000
        },
        async ({ coords }) => {
          const db = await getDBConnection('local')
          const newInsert = await insert(db, 'locals', [{ name: 'latitude', value: coords.latitude }, { name: 'longitude', value: coords.longitude }])
          setListPosition(list => [...list, coords])
        }
      );
    } catch (e) {
      Alert.alert(`Error: ${e}`)
    }
  }, [])

  const handleStopWatchPosition = useCallback(async () => {
    await storeData(listPosition)
    setGetPosition(false)
    await foregroundSubscription?.remove()
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
      const db = await getDBConnection('local')
      setListPosition([])
      await clearAll()
      await deleteAll(db, 'locals')
    } catch (e) {
      Alert.alert(`Error: ${e}`)
    }
  }

  useEffect(() => {
    (async () => {
      const db = await getDBConnection('local')
      const newTable = await createTable(db, 'locals', [{ name: 'latitude', type: 'number' }, { name: 'longitude', type: 'number' }])
      console.log('Table: ', newTable)
      const result = await select(db, 'locals')
      console.log('Result: ', result)
      const taskStatus = await TaskManager.isAvailableAsync()
      const getDataLocalListPosition = await getData()
      setListPosition(result)
    })();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.containerButton}>
        {
          getPosition ?
            <TouchableOpacity style={[styles.button, { backgroundColor: 'red' }]} onPress={handleStopBackgroundGetPosition}>
              <Text style={styles.buttonText}>Finalizar</Text>
            </TouchableOpacity>
            :
            <TouchableOpacity style={[styles.button, { backgroundColor: 'green' }]} onPress={handleStartBackgroundGetPosition}>
              <Text style={styles.buttonText}>Iniciar</Text>
            </TouchableOpacity>
        }
      </View>
      <View style={styles.containerMap}>
        {
          listPosition.length > 0 &&
          <>
            {
              listPosition.map((item, index) =>
                <View key={index} style={{ borderBottomWidth: 1 }}>
                  <Text>{item.latitude}</Text>
                  <Text>{item.longitude}</Text>
                </View>)
            }
            {/* <MapView style={styles.map}
            region={{
              latitude: listPosition[listPosition.length - 1].latitude,
              longitude: listPosition[listPosition.length - 1].longitude,
              latitudeDelta: 0.0052,
              longitudeDelta: 0.0051,
            }}

          >
            <Polyline
              coordinates={listPosition}
              strokeWidth={5}
            />
          </MapView> */}
          </>

        }
      </View>
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
  containerMap: {
    width: '85%',
    height: '50%',
    borderRadius: 10,
    backgroundColor: 'white',
    marginBottom: 20,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
