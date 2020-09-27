import { StatusBar } from 'expo-status-bar';
import * as React  from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Button, Modal, TextInput } from 'react-native';
import { FloatingAction } from 'react-native-floating-action';
import { Formik } from 'formik';

export default function App() {0
  const [players, setPlayers] = React.useState([]);
  const [modalVisible, setModalVisible] = React.useState(false);

  const addPlayer = (values) => {
    let uri = `http://192.168.1.59:4000/players/add?team=Team&id=${players.length+1}&firstName=${values['fname']}&lastName=${values['lname']}&num=${values['num']}&level=${values['lvl']}`
    console.log(uri);
    fetch(uri)
        .then(response =>  response)
        .then(response => {
          //console.log("data :" + response.data);
        })
        .catch(err => console.error(err));
  }

  React.useEffect(() => {
    fetch('http://192.168.1.59:4000/players')
      .then(response => response.json())
      .then(response => {
        console.log(response.data);
        setPlayers(response.data);
      })
      .catch(err => console.error(err));
  }, [])

  const actions = [
    {text: 'Editar', icon:null, name:'EditBtn', position:1},
    {text: 'Añadir', icon:null, name:'AddBtn', position:2},
  ];

  return (
    <>
    <View style={styles.header}>
      <Text style={styles.headerText}>U meidit boi</Text>
    </View>

    <ScrollView style={styles.container}>
      <Modal visible={modalVisible} animationType='fade'>
          <Text>Hei boy</Text>
          <Formik
            initialValues={{fname: '', lname: '', num: '', lvl: ''}}
            onSubmit={values => {
              addPlayer(values);
              let tmplayers = players;
              let tmp = {"firstName" : values['fname'], "lastName": values['lname'], "level":values['lvl'], "num": values['num'], "playerID": players.length+1}
              tmplayers.push(tmp);
              setPlayers(tmplayers)
              console.log(tmp)
              setModalVisible(false);
            }}
          >
            {(props) => (
              <View>
              <TextInput
                placeholder='Nombre'
                onChangeText={props.handleChange('fname')}
                value={props.values.fname}
              />
              <TextInput
                placeholder='Apellidos'
                onChangeText={props.handleChange('lname')}
                value={props.values.lname}
              />
              <TextInput
                placeholder='Dorsal'
                onChangeText={props.handleChange('num')}
                value={props.values.num}
                keyboardTpye='numeric'
              />
              <TextInput
                placeholder='Nivel'
                onChangeText={props.handleChange('lvl')}
                value={props.values.lvl}
                keyboardTpye='numeric'
              />
              <Button title='submit' onPress={props.handleSubmit}/>
              </View>
            )}
          </Formik>
      </Modal>

      {players.map((player) => (
        <View
          style={styles.playerCard}
          key={player.playerID}>
          <Text style={styles.playerCardText}>
            {player.firstName} {player.lastName}
          </Text>
          <View style={styles.playerCardStats}>
            <Text style={styles.playerStats}>
              Dorsal: {player.num}
            </Text>
            <Text style={styles.playerStats}>
              Nivel: {player.level}
            </Text>
          </View>
        </View>
      ))}

      <StatusBar style="auto" />
    </ScrollView>
    <FloatingAction
      actions={actions}
      color = '#34495e'
      onPressItem={name => {
        console.log(`Selected button ${name}`);
        if(name == 'AddBtn'){
          setModalVisible(true);
        }
      }}
    />
    </>
  );
}

const styles = StyleSheet.create({
  container : {
    marginTop : 6,
  },
  playerCard : {
    backgroundColor : '#bdc3c7',
    marginTop : 3,
    margin : 5,
    padding : 3,
    borderRadius : 4,
  },
  playerCardText: {
    fontSize : 25,
    marginLeft : 8,
    marginRight : 8,
    textAlign : 'left',
    borderBottomWidth : 1,
    borderBottomColor : 'black',
  },
  playerCardStats: {
    display: 'flex',
    flexDirection : 'row',
  },
  playerStats: {
    textAlign : 'center',
    flex: 1
  },
  header: {
    backgroundColor: '#34495e',
    paddingTop : 10,
  },
  headerText: {
    fontSize : 30,
    textAlign : 'center',
    color : '#e67e22',
    paddingTop : 3,
    paddingBottom : 8,
  },
});
