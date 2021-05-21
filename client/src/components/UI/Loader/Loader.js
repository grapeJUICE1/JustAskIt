import React from 'react';
import styles from './Loader.module.scss';

const Loader = (props) => {
  let margin =
    props.isLoaderFor === 'question'
      ? '1.7rem'
      : props.isLoaderFor === 'answer'
      ? '5.3rem'
      : props.isLoaderFor === 'comment'
      ? '1.2rem'
      : 0;
  let loaderSize = props.isLoaderFor === 'comment' ? '1.2rem' : '2rem';

  return (
    <>
      {props.isSmall ? (
        <div
          className={styles.lds_ring}
          style={{ width: margin, height: margin }}
        >
          <div style={{ width: loaderSize, height: loaderSize }}></div>
          <div style={{ width: loaderSize, height: loaderSize }}></div>
          <div style={{ width: loaderSize, height: loaderSize }}></div>
          <div style={{ width: loaderSize, height: loaderSize }}></div>
        </div>
      ) : (
        <div className={styles.loader}>Loading...</div>
      )}
    </>
  );
};

export default Loader;
