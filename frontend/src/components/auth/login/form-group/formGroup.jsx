import React from 'react'

const formGroup = (props) => {
  return (
  
    <div className="form-group">
      <label >{props.label}:</label>
      <input id={props.id} type={props.type} name={props.name} placeholder={props.placeholder} required />
    </div>
  );
}

export default formGroup