import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import Dropdown from './Dropdown';
import Dropdown2 from './Dropdown2';

class LabelCreation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: '1',
    };
    this.typeRef = React.createRef();
    this.genreRef = React.createRef();
  }
  
  handleSubmit(e) {
    e.preventDefault();
    console.log('test');
  }
  handleInputChange(e) {
    console.log(e.target.value);
  }
  handleOptionSelect(e) {
    this.setState({
      type: e.target.value
    });
    console.log(e.target.value);
  }
  render() {
    return (
      <Form onSubmit={this.handleSubmit} >
        {/* <Label>
          Type
          <Input ref={this.typeRef} autoComplete="off" type="text" name="type" value={this.state.type} />
          <Dropdown 
            options={['genre', 'subgenre', 'mood']}
            onClick={e => this.handleOptionSelect(e)}
          />
        </Label>
        {this.state.type === 'subgenre'
          ? (
            <Label>
              Genre
              <Input type="text" name="genre" />
            </Label>
          )
          : null}
        <Label>
          Name
          <Input ref={this.genreRef} type="text" name="name" />
        </Label> */}
        <Dropdown2
          options={['genre', 'subgenre', 'mood']}
          onClick={e => this.handleOptionSelect(e)}
        />
        <label>
          Color
          <input type="text" name="color" />
        </label>
        <input type="submit" text="Submit" />
      </Form>
    );
  }
}

const mapStateToProps = state => ({
  labels: state.labels.labels,
  genres: state.labels.labels.filter(label => label.type === 'genre'),
});

export default connect(mapStateToProps, { })(LabelCreation);

const Form = styled.form`
  width: 800px;
  height: 500px;
  background: tomato;
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  position: relative;
`;

const Input = styled.input`
  &:focus {
    background-color: yellowgreen;
    & ~ ul {
      background-color: yellowgreen;
      opacity: 1;
    }
  }
`;