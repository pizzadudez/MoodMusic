import React, { Component } from 'react';
import styled from 'styled-components';

export default class DropDown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hidden: true,
    }
  }
  handleOnClickButton = () => this.setState({ hidden: !this.state.hidden })
  handleOnClickOption = event => {
    this.setState({ hidden: !this.state.hidden });
    this.props.onClick(event);
  }
  render() {
    const { options } = this.props;
    return (
      <Container>
        <Button onClick={this.handleOnClickButton}>TEST</Button>
        {!this.state.hidden ? (
          <Menu>
            {options.map(option => 
              <Option 
                key={option}
                onClick={this.handleOnClickOption}
                value={option}
              >
                <span>{option}</span>
              </Option>
            )}
          </Menu>
        ) : null}
      </Container>
    );
  }
}

const Container = styled.div`
  position: relative;
  width: 100px;
`;
const Menu = styled.ul`
  z-index: 2;
  position: absolute;
  top: 0;
  left: 0;
  background-color: white;
  width: 100px;
  margin-block-start: 0;
  margin-block-end: 0;
  padding-inline-start: 0;
`;
const Option = styled.li`
  list-style-type: none;
  span {
    margin: 0 5px;
  }
  &:hover {
    background-color: red;
  }
`;
const Button = styled.button`
  width: 100%;
`;