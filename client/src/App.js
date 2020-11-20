import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Navbar,
  Nav,
  Spinner,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  ButtonGroup
} from 'react-bootstrap';
import { slide as Menu } from 'react-burger-menu';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import classnames from 'classnames';
import TimeFromNow from './formatDate';

import './App.scss';

const PER_PAGE = 10;

function App() {
  let [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('createdAt');
  const [filter, setFilter] = useState({});
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, sortBy, filter]);

  async function fetchData() {
    try {
      const res = await axios.get('http://localhost:7000/api/v1/posts', {
        params: {
          sort: sortBy,
          limit: PER_PAGE,
          page: currentPage,
          ...filter,
        },
      });
      setTotal(res.data.results);
      setTotalPages(res.data.totalNumOfPost);
      setTotal(res.data.results);
      setPosts(res.data.data.posts);
    } catch (err) {
      setError(err);
    }
  }

  function handlePageClick({ selected }) {
    currentPage = selected + 1;
    setCurrentPage(selected + 1);
    currentPage = selected + 1;
  }

  function sortByViews(e) {
    setFilter({});
    setSortBy('-views');
  }
  function sortByVotes(e) {
    setFilter({});
    setSortBy('-voteCount');
  }
  function sortNewest(e) {
    setFilter({});
    setSortBy('-createdAt');
  }
  function sortOldest(e) {
    setFilter({});
    setSortBy('createdAt');
  }
  function filterUnanswered(e) {
    setCurrentPage(0);
    setSortBy('-createdAt');
    setFilter({ ...filter, answerCount: 0 });
  }

  const pageCount = Math.ceil(
    (Object.keys(filter).length === 0 ? totalPages : total) / PER_PAGE
  );
  return (
    <React.Fragment>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" fixed="top">
        <Menu className="pt-5">
          <a id="home" className="menu-item" href="#">
            Home
          </a>
          <a id="about" className="menu-item" href="#">
            About
          </a>
          <a id="contact" className="menu-item" href="#">
            Contact
          </a>
          <a className="menu-item--small" href="#">
            Settings
          </a>
        </Menu>
        <Navbar.Brand href="#home" className="ml-lg-3">
          <h3>Forum</h3>
        </Navbar.Brand>
        <Nav className="ml-auto">
          <Nav.Link href="#deets">Posts</Nav.Link>
          <Nav.Link href="#ggg">Grape</Nav.Link>
          <Nav.Link eventKey={2} href="#memes">
            Dank memes
          </Nav.Link>
        </Nav>
      </Navbar>

      <Container className="d-flex flex-column justify-content-between ml-lg-4 pt-5 mt-5">
        {!error && (
          <Row>
            <Col lg={5} className="l">
              <h2 className="mt-4">All Questions</h2>
              <h3 className="mt-4">{totalPages} questions</h3>
            </Col>
            <Col
              lg={7}
              className="pt-lg-5 col-sort-buttons mt-lg-4 d-flex justify-content-lg-end"
            >
      <ToggleButtonGroup type="radio" name="options" defaultValue={1} size=
      "sm">
              <ToggleButton
                value={1}
                variant="outline-secondary"
                className="rounded-0 py-0 px-1 sort-buttons"
                size="sm"
                onClick={sortNewest}
              >Newest</ToggleButton>
              <ToggleButton
              value={2}
                className="rounded-0 px-1 sort-buttons"
			variant="outline-secondary"
                size="sm"
                onClick={sortOldest}
              >
                Oldest
              </ToggleButton>
              <ToggleButton
              value={3}
                className="rounded-0 px-1 sort-buttons"
                variant="outline-secondary"
                size="sm"
                onClick={filterUnanswered}
              >
                Unanswered
              </ToggleButton>
              <ToggleButton
              value={4}
                className="rounded-0 px-1 sort-buttons"
			variant="outline-secondary"
                size="sm"
                onClick={sortByVotes}
              >
                Votes
              </ToggleButton>
              <ToggleButton
              value={5}
                className="rounded-0 px-1 sort-buttons"
			variant="outline-secondary"
                size="sm"
                onClick={sortByViews}
              >
                Views
              </ToggleButton>
</ToggleButtonGroup>
            </Col>
          </Row>
        )}
        {(posts.length === 0 || posts === undefined) && !error && (
          <Spinner
            animation="border"
            role="status"
            className="spinner-round mx-auto my-5"
          >
            <span className="sr-only">Loading...</span>
          </Spinner>
        )}
        {error && <h1 className="text-center py-5">{error.message}</h1>}
        <Row className="ratio">
          <Col lg={9} className="App mt-4  ml-0 ">
            {posts.map((el) => {
              return (
                <div className="lol p-3 mt-1" key={el.id}>
                  <h3>{`${el.title.slice(0, 100)} ...`}</h3>
                  <div className="d-flex pt-2">
                    <p className="text-muted pr-4">
                      <span>
                        <i
                          className={classnames('fas fa-arrow-up pr-2', {
                            'text-success': el.voteCount > 0,
                          })}
                        ></i>
                      </span>
                      {`${el.voteCount} Votes`}
                    </p>
                    <p className="text-muted pr-4">
                      <span>
                        <i
                          className={classnames('fas fa-comment-alt pr-2', {
                            'text-danger': el.answerCount > 0,
                          })}
                        ></i>
                      </span>
                      {`${el.answerCount} answers`}
                    </p>
                    <p className="text-muted pr-4">
                      <span>
                        <i
                          className={classnames('fas fa-eye pr-2', {
                            'text-primary': el.views > 0,
                          })}
                        ></i>
                      </span>
                      {`${el.views} views`}
                    </p>
                  </div>
                  <div className="pt-2">
                    {el.tags.map((tag) => (
                      <div
                        key={tag}
                        className="tag-inside px-1 py-1 mr-1 mb-1"
                        role="button"
                      >
                        {tag}
                      </div>
                    ))}
                  </div>
                  <div className="d-flex flex-row-reverse flex-end pt-3">
                    <div className="d-flex flex-column">
                      <small className="text-muted">
                        {`Asked ${TimeFromNow(el.createdAt)} ago `}
                      </small>
                      <p>{`${el.postedBy.name}`}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </Col>
        </Row>
        <ReactPaginate
          previousLabel={'<<'}
          nextLabel={'>>'}
          pageCount={pageCount}
          onPageChange={handlePageClick}
          containerClassName={'pagination pb-5'}
          previousLinkClassName={'pagination__link'}
          nextLinkClassName={'pagination__link'}
          disabledClassName={'pagination__link--disabled'}
          activeClassName={'pagination__link--active'}
        />
      </Container>
    </React.Fragment>
  );
}

export default App;
