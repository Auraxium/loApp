/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {useState, useEffect} from 'react';
import {
  View,
  Button,
  Text,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import YoutubeIframe from 'react-native-youtube-iframe';
import axios from 'axios';

//var songs = [];
//var screen = Dimensions.get('screen');

const SongUI = props => (
  <TouchableOpacity style={s.listItem} onPress={props.click}>
    <View style={s.listItemView}>
      <Text style={s.listItemText}>{props.song.name}</Text>
      {/* <Icon name="remove" size={20} color="firebrick" /> */}
    </View>
  </TouchableOpacity>
);

export default function App() {
  var [songs, setSongs] = useState([]);
  var [videoID, setVideoID] = useState('');

  console.log('i loaded');

  useEffect(() => {
    axios.get('https://lo-player.onrender.com/load').then(res => {
      let map = res.data.songs;
      map.reverse();
      map.length = 40;

      for (let i = 0; i < map.length; i++) {
        map[i].sid = map[i].id;
        map[i].id = i;
      }

      setSongs(map);
    });
  }, []);



  return (
    <View style={{flex: 1}}>
      <View style={s.header}>
        <Text style={s.text} onPress={() => console.log(songs)}>
          Lo-plaayer
        </Text>
      </View>

      <View style={{flex: 76}}>
        {videoID ? (
          <View>
            <YoutubeIframe
              height={220}
              width={Dimensions.get('screen').width}
              play={true}
              videoId={videoID}
            />
          </View>
        ) : (
          <Text>Loading</Text>
        )}

        <FlatList
          style={{overflow: 'scroll'}}
          data={songs}
          renderItem={({item}) => (
            <SongUI song={item} click={() => setVideoID(item.sid)} />
          )}
        />
      </View>
      <View style={s.header}>
        <Button
          title="asd"
          style={{width: 30, height: 30}}
          onPress={() => console.log("asx")}></Button>
      </View>
    </View>
  );
}

const s = {
  minContainer: {
    flex: 1,
  },

  controls: {},

  header: {
    height: 60,
    padding: 15,
    backgroundColor: 'darkslateblue',
  },

  text: {
    color: '#fff',
    fontSize: 23,
    textAlign: 'center',
  },

  listItem: {
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  listItemText: {
    fontSize: 18,
    color: 'black',
  },
  listItemView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
};
