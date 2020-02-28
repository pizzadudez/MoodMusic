import React, { memo, useMemo } from 'react';
import { Formik, Form, Field } from 'formik';
import styled from 'styled-components';
import { createSelector } from 'reselect';
import { useSelector, useDispatch } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import * as yup from 'yup';

import { createLabel, updateLabel } from '../../actions/labelActions';
import Button from '../common/Button';
import ColorPicker from '../common/form/ColorPicker';
import TextField from '../common/form/TextField';
import RadioGroup from '../common/form/RadioGroup';
import Select from '../common/form/Select';
import Label from '../common/Label';
import DeleteIcon from '@material-ui/icons/Delete';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';

const validationSchema = yup.object().shape({
  name: yup.string().required('Required field.'),
  parent_id: yup.string().when('type', {
    is: 'subgenre',
    then: yup.string().required('Required field'),
    otherwise: yup.string().notRequired(),
  }),
});
const stateSelector = createSelector(
  state => state.labels.labelsById,
  labelsById => ({
    labelsById,
    genres: Object.values(labelsById).filter(label => label.type === 'genre'),
  })
);

export default memo(({ id, close: closeForm, isOpen }) => {
  const dispatch = useDispatch();
  const { labelsById, genres } = useSelector(stateSelector);

  const initialValues = useMemo(() => {
    if (id) {
      const l = labelsById[id];
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
  }, [id, labelsById]);

  return (
    <CSSTransition
      in={isOpen}
      timeout={500}
      classNames="form"
      appear
      unmountOnExit
    >
      <Container update={!!id}>
        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={async (data, { setSubmitting, resetForm }) => {
            setSubmitting(true);
            if (id) {
              await dispatch(updateLabel(id, data));
            } else {
              await dispatch(createLabel(data));
            }
            setSubmitting(false);
            closeForm();
            resetForm();
          }}
        >
          {({ values, handleSubmit }) => (
            <StyledForm>
              <LeftContainer>
                <Header>
                  <StyledLabel color={values.color} name={values.name} />
                  {!!id && (
                    <SpecialActions>
                      <Button
                        variant="special"
                        startIcon={<PlaylistAddIcon />}
                      ></Button>
                      <Button
                        variant="danger"
                        startIcon={<DeleteIcon />}
                      ></Button>
                    </SpecialActions>
                  )}
                </Header>
                <Field name="name" label="Name" as={TextField} />
                <Field name="verbose" label="Verbose" as={TextField} />
                {!id && (
                  <Field name="type" options={labelTypes} as={RadioGroup} row />
                )}
                {values.type === 'subgenre' && (
                  <InputRow>
                    <Field name="suffix" label="Suffix" as={TextField} />
                    <Field
                      name="parent_id"
                      options={genres}
                      label="Genre"
                      as={Select}
                    />
                  </InputRow>
                )}
                <Actions>
                  <Button variant="cancel" onClick={closeForm}>
                    Cancel
                  </Button>
                  <Button variant="submit" type="submit" onClick={handleSubmit}>
                    Submit
                  </Button>
                </Actions>
              </LeftContainer>
              <Field name="color" as={ColorPicker} />
            </StyledForm>
          )}
        </Formik>
      </Container>
    </CSSTransition>
  );
});

const Container = styled.div`
  height: ${props => (props.update ? undefined : '338px')};
  background: ${props => (props.update ? '#3e3e3e' : '#353535')};
  margin: ${props => (props.update ? 0 : 4)}px;
  border-radius: ${props => (props.update ? undefined : '4px')};
  box-shadow: ${props =>
    props.update
      ? undefined
      : `0px 2px 1px -1px rgba(0, 0, 0, 0.2),
         0px 1px 1px 0px rgba(0, 0, 0, 0.14), 
         0px 1px 3px 0px rgba(0, 0, 0, 0.12)`};
  padding: 6px;
  overflow: hidden;

  transition: 0.5s;
  width: 0px;
  &.form-enter-active,
  &.form-enter-done {
    width: 488px;
  }
`;
const StyledForm = styled(Form)`
  display: grid;
  grid-auto-flow: column;
  column-gap: 8px;
  height: 100%;
`;
const StyledLabel = styled(Label)`
  cursor: default;
  height: 56px;
  min-width: 90px;
  max-width: 110px;
  font-size: 1.1rem;
  span {
    padding: 0 12px;
  }
`;
const LeftContainer = styled.div`
  width: 260px;
  display: flex;
  flex-direction: column;
`;
const Header = styled.div`
  display: flex;
  margin-bottom: 4px;
`;
const SpecialActions = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;
const InputRow = styled.div`
  display: grid;
  grid-template-columns: 40% 1fr;
  column-gap: 6px;
`;
const Actions = styled.div`
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 8px;
  align-items: end;
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
