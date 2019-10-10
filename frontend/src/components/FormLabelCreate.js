import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import styled from 'styled-components';

import { createLabel } from '../actions/actions';

class FormLabelCreate extends Component {
  render() {
    return (
      <Formik 
        // initialValues={}
        onSubmit={(values, actions) => {
          console.log(values);
          this.props.createLabel(values);
          actions.setSubmitting(false);
        }}
        render={({ values, errors, status, touched, isSubmitting }) => (
          <Form>
            <Field name="type" component="select" placeholder="Select type">
              <option value="genre">Genre</option>
              <option value="subgenre">Subgenre</option>
              <option value="mood">Mood</option>
            </Field>
            {values.type === 'subgenre'
              ? <Field name="parent_id" component="select">
                {this.props.genres.map(genre => (
                  <option value={genre.id}>{genre.name}</option>
                ))}
              </Field>
              : null
            }
            <Field type="text" name="name" />
            <button type="submit" disabled={isSubmitting}>Submit</button>
          </Form>
        )}
      />
    );
  }
}

const mapStateToProps = state => ({
  labels: state.labels.labels,
  genres: state.labels.labels.filter(label => label.type === 'genre'),
});

export default connect(mapStateToProps, { createLabel })(FormLabelCreate);