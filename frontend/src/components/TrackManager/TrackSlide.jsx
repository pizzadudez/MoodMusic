import React, { memo, useCallback, useMemo } from 'react';
import { createSelector } from 'reselect';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import { modifyTrackSelection } from '../../actions/trackActions';
import Button from '../common/Button';

const stateSelector = createSelector(
  state => state.playlists.playlistsById,
  state => state.labels.labelsById,
  (playlistsById, labelsById) => ({
    playlistsById,
    labelsById,
  })
);

export default memo(({ track, checked, widthRestriction, setOpenTrack }) => {
  // console.log('TrackSlide');
  const dispatch = useDispatch();
  const { playlistsById, labelsById } = useSelector(stateSelector);

  const handleSelect = useCallback(
    e => {
      dispatch(modifyTrackSelection(e.target.value));
    },
    [dispatch]
  );
  const openTrackModal = useCallback(() => {
    setOpenTrack(track.id);
  }, [setOpenTrack, track]);

  return (
    <Slide widthRestriction={widthRestriction}>
      <Column>
        <Checkbox checked={checked} onChange={handleSelect} value={track.id} />
      </Column>
      <Column>
        <span>{track.name}</span>
      </Column>
      <Column>{track.liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}</Column>
      <Column>
        <span>{track.artist}</span>
      </Column>
      {widthRestriction ? (
        undefined
      ) : (
        <Column>
          <span>{track.album.name}</span>
        </Column>
      )}
      <ChipColumn>
        <Button onClick={openTrackModal}>Open</Button>
        {track.playlist_ids.map(id => (
          <Chip key={'playlist_' + id} label={playlistsById[id].name} />
        ))}
        {track.label_ids.map(id => (
          <Chip
            key={'label' + id}
            label={labelsById[id].name}
            style={{ backgroundColor: 'tomato' }}
          />
        ))}
        {/* <div
          style={{ background: '#353535', width: '100%', height: '100%' }}
        ></div> */}
      </ChipColumn>
    </Slide>
  );
});

const Slide = styled.div`
  display: grid;
  grid-template-columns: ${props =>
    props.widthRestriction
      ? `min-content
        minmax(180px, 200px)
        30px
         minmax(100px, 120px)
         minmax(300px, 1fr)`
      : `min-content
        minmax(200px, 300px)
        30px
         minmax(150px, 200px)
         minmax(150px, 300px)
         minmax(300px, 1fr)`};
  justify-content: start;
  align-items: center;
  height: 40px;
  width: 100%;
  outline: 1px solid #7777771f;
  padding: 4px 0;
  padding-right: 15px;
`;
const Column = styled.div`
  display: grid;
  align-items: center;
  height: 100%;
  text-shadow: 0.7px 0.9px #00000099;
  color: #6aff6a;
  & span:not(.MuiButtonBase-root) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
const ChipColumn = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(70px, auto));
  align-items: center;
  height: 100%;
`;
