import React, { memo, useMemo, useCallback } from 'react';
import { Formik, Form, Field } from 'formik';
import styled from 'styled-components';
import { createSelector } from 'reselect';
import { useSelector, useDispatch } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import * as yup from 'yup';

import {
  createLabel,
  updateLabel,
  deleteLabel,
} from '../../actions/labelActions';
import { confirm } from '../../actions/appActions';
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

export default memo(({ id, isOpen, close }) => {
  const dispatch = useDispatch();
  const { labelsById, genres } = useSelector(stateSelector);

  const deleteHandler = useCallback(
    () =>
      dispatch(
        confirm({
          title: 'Are you sure you want to delete this label?',
          description: 'All associations will be PERMANENTLY lost!',
        })
      )
        .then(() => dispatch(deleteLabel(id)))
        .catch(() => {}),
    [(dispatch, id)]
  );

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
          onSubmit={(data, { resetForm }) => {
            if (id) {
              if (data !== initialValues) {
                const sanitizedData = {
                  ...(data.name !== initialValues.name && { name: data.name }),
                  ...(data.verbose !== initialValues.verbose && {
                    verbose: data.verbose,
                  }),
                  ...(data.color !== initialValues.color && {
                    color: data.color,
                  }),
                  ...(data.type === 'subgenre' && {
                    type: data.type,
                    parent_id: data.parent_id,
                    ...(data.suffix !== initialValues.suffix && {
                      suffix: data.suffix,
                    }),
                  }),
                };
                dispatch(updateLabel(id, sanitizedData));
              }
            } else {
              dispatch(createLabel(data));
            }
            resetForm();
            close();
          }}
        >
          {({ values, handleSubmit }) => (
            <StyledForm>
              <LeftContainer>
                <Header createForm={!id}>
                  {!id && <span>New Label</span>}
                  <StyledLabel color={values.color} name={values.name} />
                  {!!id && (
                    <SpecialActions>
                      <Button
                        disabled
                        variant="special"
                        startIcon={<PlaylistAddIcon />}
                        tooltip="Create label playlist."
                      />
                      <Button
                        onClick={deleteHandler}
                        variant="danger"
                        startIcon={<DeleteIcon />}
                        tooltip="Delete Label permantenly."
                      />
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
                  <Button variant="cancel" onClick={close}>
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
  /* display: flex; */
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(0, max-content);
  align-items: center;
  ${props =>
    props.createForm ? '' : 'grid-template-columns: max-content 1fr;'}
  margin-bottom: 4px;
  > span {
    display: block;
    font-size: 2rem;
    font-weight: 600;
    margin-block-start: 10px;
    margin-block-end: 6px;
    margin-right: 6px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
const SpecialActions = styled.div`
  justify-self: end;
  > button {
    margin-left: 10px;
  }
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
