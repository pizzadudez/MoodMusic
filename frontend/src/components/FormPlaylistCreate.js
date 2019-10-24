import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Formik, Field, Form } from 'formik';

import { createPlaylist } from '../actions/playlistActions';

class FormPlaylistCreate extends Component {
  render() {
    const { createPlaylist } = this.props;
    return (
      <Formik
        onSubmit={(values, actions) => {
          createPlaylist(values);
          actions.setSubmitting(false);
        }}
        render={({ values, isSubmitting }) => (
          <Form>
            <Field type="text" name="name" />
            <button type="submit" disabled={isSubmitting}>Submit</button>
          </Form>
        )}
      />
    );
  }
}

export default connect(null, { createPlaylist })(FormPlaylistCreate);