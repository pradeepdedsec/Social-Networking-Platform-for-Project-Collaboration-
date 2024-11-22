import { Fragment } from "react";
import styles from "./CustomInputs.module.css";

export const InputField = ({
  name,
  id,
  handleOnchange,
  attributes,
  type,
  value,
  placeholder,
  noLabel,
}) => {
  return (
    <div className={styles.InputContainer}>
      {!noLabel && <label className={styles.Label}> {name}:</label>}
      <input
        type={type || "text"}
        value={value}
        id={id}
        onChange={handleOnchange}
        {...attributes}
        className={styles.Inputfield}
        placeholder={placeholder || name}
      />
    </div>
  );
};


export const TEXTAREA = ({
  name,
  id,
  handleOnchange,
  attributes,
  type,
  value,
  placeholder,
  noLabel,
}) => {
  return (
    <div className={styles.InputContainer}>
      {!noLabel && <label className={styles.Label}> {name}:</label>}
      <textarea
        type={type || "text"}
        value={value}
        id={id}
        onChange={handleOnchange}
        {...attributes}
        className={styles.Inputfield}
        placeholder={placeholder || name}
      />
    </div>
  );
};

export const RadioButton = ({ id, handleOnchange, option, value, name }) => {
  return (
    <div className={styles.RadioContainer}>
      <label className={styles.Label}> {name}:</label>
      <div className={styles.Radiocontent}>
        {option.map((item) => {
          return (
            <Fragment key={item.id}>
              <input
                type="radio"
                value={value}
                id={id}
                onChange={handleOnchange}
                className={styles.Radiofield}
                name={name}
              />
              <label className={styles.OptionLabel} htmlFor={id}> {item.name}</label>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};

export const Button = ({ name, handleClick, CustclassName }) => {
  return (
    <button
      className={`${styles.Button} ${CustclassName ? CustclassName : ""}`}
      onClick={handleClick}
    >
      {name}
    </button>
  );
};

export const Chiptag = ({ name, handleClick, Icon,id }) => {
  return (
    <div className={styles.chipcontainer} key={id}>
      <p>{name}</p>
      <button className={styles.removeicon} onClick={handleClick}>
        {Icon}
      </button>
    </div>
  );
};
