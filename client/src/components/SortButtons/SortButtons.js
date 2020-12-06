import React from 'react';
import { Col, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import styles from './SortButtons.module.scss';

const SortButtons = (props) => {
  const sortOptions = [
    { label: 'Newest', func: props.sortNewest },
    { label: 'Oldest', func: props.sortOldest },
    { label: 'Unanswered', func: props.filterUnanswered },
    { label: 'Votes', func: props.sortByVotes },
    { label: 'Views', func: props.sortByViews },
  ];

  return (
    <Col
      lg={7}
      className={`pt-lg-5 ${styles.col_sort_buttons} mt-lg-4 d-flex justify-content-lg-end`}
    >
      <ToggleButtonGroup
        className="flex-wrap"
        type="radio"
        name="options"
        defaultValue={0}
        size="sm"
      >
        {sortOptions.map((srtOpt, key) => (
          <ToggleButton
            value={key}
            key={key}
            variant="outline-secondary"
            className={'rounded-0 px-1 ' + styles.sort_buttons}
            size="sm"
            onClick={srtOpt.func}
          >
            {srtOpt.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Col>
  );
};

export default SortButtons;
