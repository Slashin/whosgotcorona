import React from 'react';
import { css } from '@emotion/core';

import { RingLoader } from 'react-spinners';

 
// Can be a string as well. Need to ensure each key-value pair ends with ;
const override = css`
    display: block;
    margin: 0 auto;
`;
 
class Spinner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    }
  }
  render() {
    return (
      <div className='spinnerBox'>
        <div className='spinner'>
            <RingLoader
            css={override}
            sizeUnit={"px"}
            size={100}
            color={'#1699ba'}
            loading={this.state.loading}
            />
        </div>
      </div> 
    )
  }
}

export default Spinner