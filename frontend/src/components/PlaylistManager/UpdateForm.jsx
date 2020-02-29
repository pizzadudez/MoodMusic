import React, { memo, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';
import { Formik, Field, Form } from 'formik';
import { CSSTransition } from 'react-transition-group';
import * as yup from 'yup';

import { updatePlaylist } from '../../actions/playlistActions';
import Button from '../common/Button';
import RadioGroup from '../common/form/RadioGroup';
import TextField from '../common/form/TextField';
import Select from '../common/form/Select';

const validationSchema = yup.object().shape({
  name: yup.string().required('Required field.'),
  description: yup.string(),
});
const stateSelector = createSelector(
  state => state.labels.labelsById,
  labelsById => ({
    labels: Object.values(labelsById).filter(label => !label.playlist_id),
  })
);

export default memo(({ playlist, isOpen, close }) => {
  const dispatch = useDispatch();
  const { labels } = useSelector(stateSelector);

  const initialValues = useMemo(() => {
    if (playlist) {
      return {
        name: playlist.name,
        description: playlist.description || '',
        type: playlist.type,
        label_id: '',
      };
    }
    return {};
  }, [playlist]);

  const submitHandler = useCallback(
    (data, { resetForm }) => {
      if (data !== initialValues) {
        if (playlist) {
          const sanitizedData = {
            ...(data.name !== initialValues.name && { name: data.name }),
            ...(data.description !== initialValues.description && {
              description: data.description,
            }),
            ...(data.type !== initialValues.type && {
              type: data.type,
            }),
            ...(data.type === 'label' &&
              !!data.label_id &&
              data.label_id !== initialValues.label_id && {
                type: 'label',
                label_id: data.label_id,
              }),
          };
          dispatch(updatePlaylist(playlist.id, sanitizedData));
        }
      }
      resetForm();
      close();
    },
    [playlist, close, initialValues, dispatch]
  );

  return (
    <CSSTransition
      in={isOpen}
      timeout={500}
      classNames="form"
      appear
      unmountOnExit
    >
      <Container>
        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={submitHandler}
        >
          {({ values, handleSubmit }) => (
            <StyledForm>
              <Field name="type" options={playlistTypes} as={RadioGroup} />
              <Inputs>
                <InputRow>
                  <Field name="name" label="Playlist Name" as={TextField} />
                  {values.type === 'label' && (
                    <Field
                      name="label_id"
                      options={labels}
                      label="Change Label"
                      as={Select}
                    />
                  )}
                </InputRow>
                <Field name="description" label="Description" as={TextField} />
              </Inputs>
              <Actions>
                <Button variant="cancel" onClick={close}>
                  Cancel
                </Button>
                <Button variant="submit" type="submit" onClick={handleSubmit}>
                  Submit
                </Button>
              </Actions>
            </StyledForm>
          )}
        </Formik>
      </Container>
    </CSSTransition>
  );
});

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;

  z-index: 3;
  min-width: 0;
  width: 0;
  transition: 0.5s;
  &.form-enter-active,
  &.form-enter-done {
    width: 100%;
  }
  &.form-exit-active,
  &.form-exit-done {
    width: 0;
  }
`;
const StyledForm = styled(Form)`
  min-width: 530px;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: min-content 1fr min-content;
  column-gap: 6px;
  align-items: center;
`;
const Inputs = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
const InputRow = styled.div`
  display: flex;
  margin-top: -10px;
  display: grid;
  grid-template-columns: 1fr 140px;
  column-gap: 6px;
`;
const Actions = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const playlistTypes = [
  {
    type: 'mix',
    label: 'Mix',
  },
  {
    type: 'label',
    label: 'Label',
  },
  {
    type: 'untracked',
    label: 'Untracked',
  },
];
