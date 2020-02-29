import React, { memo, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';

import { createPlaylist } from '../actions/playlistActions';
import Button from './common/Button';
import RadioGroup from './common/form/RadioGroup';
import TextField from './common/form/TextField';
import Select from './common/form/Select';

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

export default memo(() => {
  const dispatch = useDispatch();
  const { labels } = useSelector(stateSelector);

  const submitHandler = useCallback(
    (data, { resetForm }) => {
      dispatch(createPlaylist(data));
      resetForm();
    },
    [dispatch]
  );

  return (
    <Formik
      initialValues={defaultValues}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={submitHandler}
    >
      {({ values, handleSubmit, resetForm }) => (
        <StyledForm>
          <Header>
            <span>Create new playlist</span>
            <Field name="type" options={playlistTypes} as={RadioGroup} row />
          </Header>
          <Inputs>
            <Field name="name" label="Name" as={TextField} />
            <Field name="description" label="Description" as={TextField} />
            {values.type === 'label' && (
              <Field
                name="label_id"
                options={labels}
                label="Select label"
                as={Select}
              />
            )}
          </Inputs>
          <Actions>
            <Button variant="submit" type="submit" onClick={handleSubmit}>
              Submit
            </Button>
            <Button variant="cancel" onClick={resetForm}>
              Reset
            </Button>
          </Actions>
        </StyledForm>
      )}
    </Formik>
  );
});

const StyledForm = styled(Form)`
  display: grid;
  row-gap: 10px;
`;
const Header = styled.div`
  min-width: 0;
  display: flex;
  justify-content: space-between;
  > span {
    font-size: 2rem;
    margin-block-start: 6px;
    margin-block-end: 6px;
    margin-right: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
const Inputs = styled.div`
  display: flex;
  flex-direction: column;
`;
const Actions = styled.div`
  display: grid;
  grid-auto-flow: column;
  column-gap: 6px;
`;

const defaultValues = {
  name: '',
  description: '',
  type: 'mix',
  label_id: '',
};
const playlistTypes = [
  {
    type: 'mix',
    label: 'Mix',
  },
  {
    type: 'label',
    label: 'Label',
  },
];
