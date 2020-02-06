import React, { memo, useState, useCallback } from 'react';
import { Formik, Form, Field } from 'formik';
import styled from 'styled-components';
import { createSelector } from 'reselect';
import { useSelector, useDispatch } from 'react-redux';

import Button from '../common/Button';
import ColorPicker from './ColorPicker';
import TextField from '../common/TextField';
import RadioGroup from '../common/RadioGroup';
import Select from '../common/Select';
import { createLabel } from '../../actions/labelActions';

const labelTypes = [
  {
    type: 'genre',
    label: 'Genre',
  },
  {
    type: 'subgenre',
    label: 'Subgenre',
  },
  {
    type: 'mood',
    label: 'Mood',
  },
];
const initialValues = {
  name: '',
  verbose: '',
  type: 'genre',
  color: '',
};

const stateSelector = createSelector(
  state => state.labels,
  ({ labelsById, ids }) => ({
    labelsById,
    ids: ids,
    genres: ids
      .filter(id => labelsById[id].type === 'genre')
      .map(id => labelsById[id]),
  })
);

export default memo(() => {
  const dispatch = useDispatch();
  const { labelsById, ids, genres } = useSelector(stateSelector);

  return (
    <Wrapper>
      <Formik
        initialValues={initialValues}
        onSubmit={async (data, { setSubmitting, resetForm }) => {
          setSubmitting(true);
          await dispatch(createLabel(data));
          console.log(data);
          setSubmitting(false);
          resetForm();
        }}
      >
        {({ values, isSubmitting, setFieldValue, handleSubmit }) => (
          <StyledForm>
            <Field name="name" label="Name" as={TextField} />
            <Field name="verbose" label="Verbose" as={TextField} />
            <Field name="type" options={labelTypes} as={RadioGroup} />
            {values.type === 'subgenre' && (
              <>
                <Field
                  name="parent_id"
                  options={genres}
                  label="Select parent genre"
                  as={Select}
                />
                <Field name="suffix" label="Suffix" as={TextField} />
              </>
            )}
            <Field
              name="color"
              as={ColorPicker}
              setFieldValue={setFieldValue}
            />
            <Button type="submit" onClick={handleSubmit}>
              Submit
            </Button>
            <pre>{JSON.stringify(values, null, 2)}</pre>
          </StyledForm>
        )}
      </Formik>
    </Wrapper>
  );
});

const StyledForm = styled(Form)`
  display: grid;
  grid-template-rows: repeat(auto-fit, auto);
  grid-row-gap: 12px;
`;
const Wrapper = styled.div``;
