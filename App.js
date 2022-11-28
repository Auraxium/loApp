/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {useState, useEffect, useRef} from 'react';
import {
  View,
  Button,
  Text,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import YoutubeIframe from 'react-native-youtube-iframe';
import axios from 'axios';
import SystemNavigationBar from 'react-native-system-navigation-bar';
//SystemNavigationBar.navigationHide();

var songs = [];
//var screen = Dimensions.get('screen');
var songIndex = 0;
var queue = [];
var vid_bool = false;

const SongUI = props => (
  <TouchableOpacity style={s.listItem} onPress={props.click}>
    <View style={s.listItemView}>
      <Text style={s.listItemText}>{props.song.name}</Text>
      {/* <Icon name="remove" size={20} color="firebrick" /> */}
    </View>
  </TouchableOpacity>
);

export default function App() {
  var [songsUI, setSongsUI] = useState([]);
  var [videoID, setVideoID] = useState('');
  var [playerHeight, setPlayerHeight] = useState(0);
  const playerRef = useRef();

  console.log('i loaded');

  useEffect(() => {
    console.log('iran');

    axios.get('https://lo-player.onrender.com/load').then(res => {
      let map = res.data.songs;
      map.reverse();
      //map.length = 100;

      for (let i = 0; i < map.length; i++) {
        let el = map[i];
        el.sid = el.id;
        el.id = i;
      }

      queue = Array.apply(null, Array(map.length)).map(function (x, i) {
        return i;
      });
      //queue.sort(() => Math.random() - 0.5);
      songs = map;
      setSongsUI(songs);
    });
  }, []);

  function clickedSong(song) {
    songIndex = 0;
    queue.sort(() => Math.random() - 0.5);

    var temp = queue.indexOf(song.id);
    var temp2 = queue[0];
    queue[0] = song.id;
    queue[temp] = temp2;

    setVideoID(song.sid);
  }

  function shiftSong(num) {
    //songIndex = ((songIndex+num) >= queue.length) ? 0 : songIndex
    if (num > 0) {
      songIndex = ++songIndex >= queue.length ? 0 : songIndex;
    } else {
      songIndex = --songIndex < 0 ? queue.length - 1 : songIndex;
    }
    //console.log(queue + '\n' + songIndex)
    setVideoID(songs[queue[songIndex]].sid);
  }

  function stateChange(e) {
    if (e == 'ended') {
      shiftSong(1);
    }
  }

  function toggleVideo() {
    (vid_bool = !vid_bool)
      ? setPlayerHeight((Dimensions.get('screen').width * 9) / 16)
      : setPlayerHeight(0);
  }

  return (
    <View style={{flex: 1}}>
      <View style={s.header}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'flex-start',
          }}>
          <Text style={s.text} onPress={() => console.log(songs)}>
            Lo-plaayer
          </Text>
          <Button title="hide" onPress={toggleVideo}></Button>
        </View>
      </View>

      <View style={{flex: 76}}>
        {videoID ? (
          <View>
            <YoutubeIframe
              ref={playerRef}
              height={playerHeight}
              width={Dimensions.get('screen').width}
              volume={100}
              play={true}
              videoId={videoID}
              forceAndroidAutoplay={true}
              onChangeState={e => stateChange(e)}
              onError={() => shiftSong(1)}
            />
          </View>
        ) : (
          <Text>Loading</Text>
        )}

        <TextInput
          onChangeText={e =>
            setSongsUI(
              songs.filter(el =>
                el.name.toLocaleLowerCase().includes(e.toLocaleLowerCase()),
              ),
            )
          }
        />

        <FlatList
          // style={{flexDirection: 'column-reverse'}}
          data={songsUI}
          renderItem={({item}) => (
            <SongUI song={item} click={() => clickedSong(item)} />
          )}
        />
      </View>
      <View style={s.header}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'flex-start',
          }}>
          <Button
            title="Prev"
            style={{width: 30, height: 30}}
            onPress={() => shiftSong(-1)}></Button>
          <Button
            title="Pause"
            style={{width: 30, height: 30}}
            onPress={toggleNav}></Button>
          <Button
            title="Next"
            style={{width: 30, height: 30}}
            onPress={() => shiftSong(1)}></Button>
        </View>
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

var navUI = false;
function toggleNav() {
  (navUI = !navUI)
    ? SystemNavigationBar.navigationHide()
    : SystemNavigationBar.navigationShow();
}

function playSong() {}
