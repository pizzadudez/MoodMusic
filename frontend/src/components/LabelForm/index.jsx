import React, { memo, useState, useCallback, useMemo } from 'react';
import { Formik, Form, Field } from 'formik';
import styled from 'styled-components';
import { createSelector } from 'reselect';
import { useSelector, useDispatch } from 'react-redux';
import * as yup from 'yup';

import Button from '../common/Button';
import ColorPicker from './ColorPicker';
import TextField from '../common/TextField';
import RadioGroup from '../common/RadioGroup';
import Select from '../common/Select';
import { createLabel, updateLabel } from '../../actions/labelActions';

const validationSchema = yup.object().shape({
  name: yup.string().required('Required field.'),
  parent_id: yup.string().when('type', {
    is: 'subgenre',
    then: yup.string().required('You must select a parent genre.'),
    otherwise: yup.string().notRequired(),
  }),
});
const stateSelector = createSelector(
  state => state.labels.labelsById,
  state => state.app.updatingLabelId,
  (labelsById, updatingLabelId) => ({
    labelsById,
    genres: Object.values(labelsById).filter(label => label.type === 'genre'),
    updatingLabelId,
  })
);

export default memo(() => {
  console.log('LabelForm');
  const dispatch = useDispatch();
  const { updatingLabelId, labelsById, genres } = useSelector(stateSelector);

  const initialValues = useMemo(() => {
    if (updatingLabelId) {
      const l = labelsById[updatingLabelId];
      return {
        name: l.name,
        verbose: l.verbose || '',
        type: l.type,
        parent_id: l.parent_id || undefined,
        suffix: l.suffix || '',
        color: l.color,
      };
    }
    return defaultValues;
  }, [updatingLabelId, labelsById]);

  return (
    <Wrapper>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={async (data, { setSubmitting, resetForm }) => {
          setSubmitting(true);
          if (updatingLabelId) {
            await dispatch(updateLabel(updatingLabelId, data));
          } else {
            await dispatch(createLabel(data));
          }
          setSubmitting(false);
          resetForm();
        }}
      >
        {({ values, isSubmitting, handleSubmit }) => (
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
            <Field name="color" as={ColorPicker} />
            <Button type="submit" onClick={handleSubmit}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
            {/* <div>
              <pre>{JSON.stringify(values, null, 2)}</pre>
              <pre>{JSON.stringify(errors, null, 2)}</pre>
            </div> */}
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

const defaultValues = {
  name: '',
  verbose: '',
  type: 'genre',
  color: '#bdbdbd',
  parent_id: '',
  suffix: '',
};
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
