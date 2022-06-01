function Input(props) {
  const classes = `${props.className}`;

  return (
    <input type={props.type} placeholder={props.placeholder} className={classes}/>
  )
}

export default Input;
