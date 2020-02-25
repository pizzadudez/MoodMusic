import React, { memo, useCallback, useMemo } from 'react';
import { createSelector } from 'reselect';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

import Checkbox from '../common/Checkbox';
import Label from '../common/Label';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import { modifyTrackSelection, toggleLike } from '../../actions/trackActions';

const stateSelector = createSelector(
  state => state.playlists.playlistsById,
  state => state.labels.labelsById,
  (playlistsById, labelsById) => ({
    playlistsById,
    labelsById,
  })
);

export default memo(({ track, checked, widthRestriction, setOpenTrack }) => {
  console.log('TrackSlide');
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
  const toggleLikeHandler = useCallback(
    () => dispatch(toggleLike(track.id, !track.liked)),
    [track.liked]
  );

  return (
    <Slide widthRestriction={widthRestriction}>
      <Column>
        <Checkbox checked={checked} onChange={handleSelect} value={track.id} />
      </Column>
      <Column>
        <span>{track.name}</span>
      </Column>
      <Column style={{ cursor: 'pointer' }} onClick={toggleLikeHandler}>
        {track.liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      </Column>
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
      <ChipColumn onClick={openTrackModal}>
        {/* <button style={{ width: 20 }} onClick={openTrackModal}>
          Open
        </button> */}
        {track.label_ids.map(id => (
          <Label
            key={'label' + id}
            name={labelsById[id].name}
            color={labelsById[id].color}
          />
        ))}
        {track.playlist_ids
          .filter(id => playlistsById[id].type === 'mix')
          .map(id => (
            <Label key={'playlist_' + id} name={playlistsById[id].name} />
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
         minmax(180px, 190px)
         30px
         minmax(100px, 120px)
         minmax(320px, 448px)`
      : `min-content
         minmax(200px, 280px)
         30px
         minmax(150px, 200px)
         minmax(150px, 250px)
         minmax(320px, 448px)`};
  justify-content: start;
  align-items: center;
  height: 40px;
  width: 100%;
  outline: 1px solid #7777771f;
  padding: 4px 0;
  /* padding-right: 15px; */
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
  grid-template-columns: repeat(auto-fill, 64px);

  align-items: center;
  height: 100%;
  cursor: pointer;
`;
