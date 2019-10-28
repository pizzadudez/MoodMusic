import axios from 'axios';
import {
  PLAY_TRACK,
} from './types';

export const playTrack = id => dispatch => {
  axios.post('/api/player/track', { track_id: id })
}