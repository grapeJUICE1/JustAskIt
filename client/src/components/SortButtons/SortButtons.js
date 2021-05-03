import classNames from 'classnames';
import React from 'react';
import { Col, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import styles from './SortButtons.module.scss';

const SortButtons = (props) => {
  const sortOptions = [
    { label: ' All ', func: props.removeFilter },
    { label: 'Newest', func: props.sortNewest },
    { label: 'Oldest', func: props.sortOldest },
    { label: 'Votes', func: props.sortByVotes },
    { label: 'Views', func: props.sortByViews },
    { label: 'Unanswered', func: props.filterUnanswered },
  ];

  return (
    <Col
      lg={7}
      className={classNames({
        'pt-lg-5 mt-lg-4 d-flex justify-content-lg-end': true,
        [`${styles.col_sort_buttons}`]: !props.isProfile,
        [`${styles.col_sort_buttons_for_profile}`]: props.isProfile,
      })}
    >
      <ToggleButtonGroup
        className="flex-wrap"
        type="radio"
        name="options"
        defaultValue={1}
        size="sm"
      >
        {sortOptions.map((srtOpt, key) => {
          if (!srtOpt.func) return null;
          return (
            <ToggleButton
              value={key}
              key={key}
              checked
              variant="outline-secondary"
              className={'rounded-0 px-1 ' + styles.sort_buttons}
              size="sm"
              onClick={srtOpt.func}
            >
              {srtOpt.label}
            </ToggleButton>
          );
        })}
      </ToggleButtonGroup>
    </Col>
  );
};

export default SortButtons;
