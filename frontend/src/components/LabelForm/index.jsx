import React, { memo, useState, useCallback, useMemo } from 'react';
import { Formik, Form, Field } from 'formik';
import styled from 'styled-components';
import { createSelector } from 'reselect';
import { useSelector, useDispatch } from 'react-redux';

import Button from '../common/Button';
import ColorPicker from './ColorPicker';
import TextField from '../common/TextField';
import RadioGroup from '../common/RadioGroup';
import Select from '../common/Select';
import { createLabel, updateLabel } from '../../actions/labelActions';

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
  color: '#bdbdbd',
};

const stateSelector = createSelector(
  state => state.app.updatingLabelId,
  state => state.labels,
  (updatingLabelId, { labelsById, ids }) => ({
    updatingLabelId,
    labelsById,
    ids: ids,
    genres: ids
      .filter(id => labelsById[id].type === 'genre')
      .map(id => labelsById[id]),
  })
);

export default memo(() => {
  console.log('LabelForm');
  const dispatch = useDispatch();
  const { updatingLabelId, labelsById, ids, genres } = useSelector(
    stateSelector
  );

  const updateInitialValues = useMemo(() => {
    if (updatingLabelId) {
      const l = labelsById[updatingLabelId];
      return {
        name: l.name,
        verbose: l.verbose || '',
        type: l.type,
        parent_id: l.parent_id || undefined,
        suffix: l.suffix || '',
        color: l.color || '#bdbdbd',
      };
    }

    return labelsById[updatingLabelId];
  }, [updatingLabelId, labelsById]);

  return (
    <Wrapper>
      <Formik
        initialValues={updateInitialValues || initialValues}
        enableReinitialize
        onSubmit={async (data, { setSubmitting, resetForm }) => {
          setSubmitting(true);
          if (updatingLabelId) {
            await dispatch(updateLabel(updatingLabelId, data));
          } else {
            await dispatch(createLabel(data));
          }
          console.log(data);
          setSubmitting(false);
          resetForm();
        }}
      >
        {({ values, isSubmitting, setFieldValue, handleSubmit }) => (
          <StyledForm>
            <Field name="name" label="Name" as={TextField} />
            <Field name="verbose" label="Verbose" as={TextField} />
            {!updatingLabelId && (
              <Field name="type" options={labelTypes} as={RadioGroup} />
            )}
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
            <div>
              <pre>{JSON.stringify(values, null, 2)}</pre>
            </div>
            <Button type="submit" onClick={handleSubmit}>
              Submit
            </Button>
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
const Wrapper = styled.div`
  height: 100%;
`;
