import React, { memo, useMemo } from 'react';
import styled from 'styled-components';
import { Formik, Form, Field } from 'formik';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';

import Button from '../common/Button';
import TextField from '../common/TextField';
import RadioGroup from '../common/RadioGroup';

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
const initialValues = {
  name: '',
  description: '',
  type: 'mix',
  label_id: '',
};
const validationSchema = yup.object().shape({
  name: yup.string().required('Required field.'),
  label_id: yup.string().when('type', {
    is: 'label',
    then: yup.string().required('You must select a label to associate with.'),
    otherwise: yup.string().notRequired(),
  }),
});

export default memo(({ playlist, onClose: closeForm }) => {
  const dispatch = useDispatch();

  const updateInitialValues = useMemo(() => {
    if (playlist) {
      return {
        name: playlist.name,
        description: playlist.description || '',
        type: playlist.type,
        label_id: playlist.label_id || '',
      };
    }
    return null;
  }, [playlist]);

  return (
    <Wrapper>
      <Formik
        initialValues={updateInitialValues || initialValues}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={(data, { setSubmitting, resetForm }) => {
          setSubmitting(true);
          if (data !== updateInitialValues) {
            console.log(data);
          } else {
            console.log('no changes');
          }
          // if (updateInitialValues) {
          //   dispatch(updatePlaylist(playlist.id, playlist));
          // } else {
          //   dispatch(createPlaylist(data));
          // }
          setSubmitting(false);
          resetForm();
          closeForm();
        }}
      >
        {({ values, isSubmitting, handleSubmit }) => (
          <StyledForm>
            <Field name="name" label="name" as={TextField} />
            <Field name="description" label="description" as={TextField} />
            <Field name="type" options={playlistTypes} as={RadioGroup} />
            <Button type="submit" onClick={handleSubmit}>
              Submit
            </Button>
            <Button onClick={closeForm}>Cancel</Button>
          </StyledForm>
        )}
      </Formik>
    </Wrapper>
  );
});

const StyledForm = styled(Form)`
  display: flex;
`;
const Wrapper = styled.div`
  height: 100%;
`;
