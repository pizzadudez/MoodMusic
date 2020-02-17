import React, { memo, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { Formik, Form, Field } from 'formik';
import { createSelector } from 'reselect';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';

import { createPlaylist, updatePlaylist } from '../../actions/playlistActions';
import Button from '../common/Button';
import TextField from '../common/TextField';
import RadioGroup from '../common/RadioGroup';
import Select from '../common/Select';

const validationSchema = yup.object().shape({
  name: yup.string().required('Required field.'),
  description: yup.string(),
  label_id: yup.string().when('type', {
    is: 'label',
    then: yup.string().required('You must select a label to associate with.'),
    otherwise: yup.string().notRequired(),
  }),
});
const stateSelector = createSelector(
  state => state.labels.labelsById,
  labelsById => ({
    labels: Object.values(labelsById).filter(label => !label.playlist_id),
  })
);

export default memo(({ playlist, onClose: closeForm }) => {
  const dispatch = useDispatch();
  const { labels } = useSelector(stateSelector);

  const initialValues = useMemo(() => {
    if (playlist) {
      return {
        name: playlist.name,
        description: playlist.description || '',
        type: playlist.type,
        label_id: playlist.label_id || '',
      };
    }
    return defaultValues;
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
              data.label_id !== initialValues.label_id && {
                type: 'label',
                label_id: data.label_id,
              }),
          };
          dispatch(updatePlaylist(playlist.id, sanitizedData));
        } else {
          dispatch(createPlaylist(data));
        }
      }
      resetForm();
      closeForm();
    },
    [playlist, closeForm, initialValues, dispatch]
  );

  return (
    <Wrapper>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={submitHandler}
      >
        {({ values, handleSubmit }) => (
          <StyledForm>
            <Field
              name="type"
              options={playlist ? playlistTypes.update : playlistTypes.new}
              as={RadioGroup}
            />
            <Field name="name" label="name" as={TextField} />
            <Field name="description" label="description" as={TextField} />
            {values.type === 'label' && (
              <Field
                name="label_id"
                options={labels}
                label="Select label"
                as={Select}
              />
            )}
            <Button type="submit" onClick={handleSubmit}>
              Submit
            </Button>
            <Button onClick={closeForm}>Cancel</Button>
            {/* <div>
              <pre>{JSON.stringify(values, null, 2)}</pre>
            </div> */}
          </StyledForm>
        )}
      </Formik>
    </Wrapper>
  );
});

const StyledForm = styled(Form)`
  display: flex;
  flex-wrap: wrap;
`;
const Wrapper = styled.div`
  height: 100%;
`;

const defaultValues = {
  name: '',
  description: '',
  type: 'mix',
  label_id: '',
};
const playlistTypes = {
  new: [
    {
      type: 'mix',
      label: 'Mix',
    },
    {
      type: 'label',
      label: 'Label',
    },
  ],
  update: [
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
  ],
};
