function Button(prop) {
  const classes = `${prop.className}`;

  return (
    <button className={classes}>{prop.children}</button>
  );
}

export default Button;
